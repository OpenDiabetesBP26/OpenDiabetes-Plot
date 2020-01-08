import React, { Component } from 'react';
import Loading from '../common/Loading'
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
import DataManager from '../services/DataManager.js';

//import { geoMercator, geoPath } from 'd3-geo'

class D3Sample extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true }
    }

    render() {
        return <div>
            <Loading visible={this.state.loading} />
            <h2 id="d3sample_pagetitle">D3 Sample</h2>
            <div id="my_dataviz"></div>
            <svg id="d3sample" width="1000" height="500"></svg>
        </div>;
    }
    async initD3(data) {

        var dm = new DataManager();
        await dm.readData(data);

        var svg = d3.select("svg"),
            margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;
        //Tooltips style
        var tooltip = d3.select('body')
            .append("div")
            .style("text-align", "left")
            .style("position", "absolute")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("padding", "2px")
            .style("background-color", "lightsteelblue")
            .style("border-radius", "8px")
            .style("font", "sans-serif")
        //mouse actions 
        function mouseover_tp() {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "green")
                .style("opacity", 1)
                .transition()
                .duration(300)
                .attr('fill', 'yellow')
                .attr('opacity', 1)
                .attr('r', 3 * 3)
        }
        function mousemove_tp(d) {
            tooltip
                .html("Time: " + d.time + "<br/>" + "value: " + d.value)
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY) + "px")
        }
        function mouseout_tp() {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .transition()
                .duration(500)
                .attr('fill', 'black')
                .attr('opacity', 1)
                .attr('r', 3);
        }

        svg.selectAll('circle')
            //mouse actions
            .on("mouseover", mouseover_tp)
            .on("mousemove", mousemove_tp)
            .on("mouseout", mouseout_tp)

        var x = d3.scaleTime().range([0, width]),
            xBase = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0])

        var xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y);

        //Zoom Objekt siehe
        //https://github.com/d3/d3-zoom
        var zoom = d3.zoom()
            //Wie viel man unzoomen und zoomen kann
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Initial domains
        x.domain(d3.extent(dm.getGlucoseCGMData(), d => d.time))
        y.domain([0, 400])
        xBase.domain(x.domain());

        //X Achse
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        //Y AChse
        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);
        //Farbige Anzeige fuer Glukose
        var gcHigh = svg.append("rect")
            .attr("class", "gcHigh")
            .attr("y", y(400) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(185) - y(400))
            .attr("width", width)
            .attr("fill", "#f5f0b8")
        var gcNormal = svg.append("rect")
            .attr("class", "gcNormal")
            .attr("y", y(180) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(70) - y(180))
            .attr("width", width)
            .attr("fill", "#e0e0e0")
        var gcLow = svg.append("rect")
            .attr("class", "gcLow")
            .attr("y", y(65) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(0) - y(65))
            .attr("width", width)
            .attr("fill", "#faafaa")
        var circsG = svg.append("g")
        var rectsG = svg.append("g")
        var rectsQuantile = rectsG.append("g")
        var percentilGroup = rectsG.append("g").classed('percentilGraph', true)

        displayGlucose();
        svg.call(zoom);

        //Einfuegen und Updaten der Kreise
        function displayGlucose() {
            var gd = dm.getGlucoseCGMData();
            if (gd.type == 'intraday') {
                displayGlucose_intraday(gd);
            }
            if (gd.type == 'hourly') {
                displayGlucose_percentil(gd);
            }
            if (gd.type == 'daily') {
                displayGlucose_percentil(gd);
            }
            if (gd.type == 'weekly') {
                displayGlucose_percentil(gd);
            }
            if (gd.type == 'monthly') {
                displayGlucose_percentil(gd);
            }
        }
        function displayGlucose_intraday(data) {
            //Remove Rects
            removePercentil()
            var circs = circsG.selectAll('circle').data(data).join(
                (enter) => enter.append('circle')
                    .attr('r', 3)
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                    //mouse actions
                    .on("mouseover", mouseover_tp)
                    .on("mousemove", mousemove_tp)
                    .on("mouseout", mouseout_tp),
                (update) => update
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
            )
                .attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')');

        }
        function removePercentil() {
            percentilGroup.selectAll('g').remove()
        }
        function displayGlucose_percentil(data) {
            function getHeightHigher(d) {
                let height = (d.value_lower_perc >= gcHigh ? y(d.value_lower_perc) : y(gcHigh)) - y(d.value_higher_perc);
                if (height < 0) return 0
                return height
            }

            function getHeightMid(d) {
                let height = y(d.value_lower_perc < gcLow ? gcLow : d.value_lower_perc) - y(d.value_higher_perc > gcHigh ? gcHigh : d.value_higher_perc)
                if (height < 0) return 0
                return height
            }
            function getHeightLow(d) {
                let height = y(d.value_lower_perc) - y(d.value_higher_perc <= gcLow ? d.value_higher_perc : gcLow)
                if (height < 0) return 0
                return height
            }
            //Remove Circs
            circsG.selectAll('circle').remove();
            //Vars
            const gcHigh = 180;
            const gcLow = 70;
            const width = 6;
            var dataGroup = percentilGroup.selectAll('g').data(data).join(
                function (enter) {
                    let rectGroup = enter.append('g').classed('percentil', true)

                    rectGroup.append('rect')
                        .attr('width', width)
                        //if lower part is only in high range
                        .attr('height', d => getHeightHigher(d))
                        .attr('fill', 'red')
                        .attr('y', d => y(d.value_higher_perc))
                        .attr('x', d => x(d.time) - width / 2)
                        .classed("high", true)


                    rectGroup.append('rect')
                        .attr('width', width)
                        .attr('height', d => getHeightMid(d))
                        .attr('fill', 'grey')
                        .attr('y', d => y(d.value_higher_perc > gcHigh ? gcHigh : d.value_higher_perc))
                        .attr('x', d => x(d.time) - 3)
                        .classed("mid", true)

                    rectGroup.append('rect')
                        .attr('width', width)
                        //if lower part is only in high range
                        .attr('height', d => getHeightLow(d))
                        .attr('fill', 'blue')
                        .attr('y', d => y(d.value_higher_perc <= gcLow ? d.value_higher_perc : gcLow))
                        .attr('x', d => x(d.time) - width / 2)
                        .classed("low", true)

                    rectGroup.attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')');
                },
                function (update) {
                    update.select('rect.high')
                        .attr('x', d => x(d.time) - width / 2)
                        .attr('y', d => y(d.value_higher_perc))
                        .attr('height', d => getHeightHigher(d))

                    update.select('rect.mid')
                        .attr('x', d => x(d.time) - 3)
                        .attr('y', d => y(d.value_higher_perc > gcHigh ? gcHigh : d.value_higher_perc))
                        .attr('height', d => getHeightMid(d))
                    update.select('rect.low')
                        .attr('y', d => y(d.value_higher_perc <= gcLow ? d.value_higher_perc : gcLow))
                        .attr('x', d => x(d.time) - width / 2)
                        .attr('height', d => getHeightLow(d))
                }
            )
        }




        function zoomed() {
            //Wir benutzen xBase, da wir x brauchen um die Punkte zu updaten
            //x wird naemlich ueberschrieben
            x = d3.event.transform.rescaleX(xBase);
            //Update x Axis
            focus.select(".axis--x").call(d3.axisBottom(x));

            //Filter Data
            dm.updateDomain(x.domain())
            //Update Glucose Chart
            displayGlucose();
        }
    }

    load(loading) {
        this.setState({ loading: (loading ? true : false) });
    }

    componentWillMount() {
        this.load(true);
    }

    async componentDidMount() {
        try {
            const data = await (await fetch("/data/2019-11-20-1349_export-data.json")).json();
            this.initD3(data);
        }
        finally {
            this.load(false);
        }
    }
}

export default hot ? hot(module)(D3Sample) : D3Sample;
