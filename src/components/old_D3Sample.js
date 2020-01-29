import React, { Component } from 'react';
import Loading from '../common/Loading'
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
import DataManager from '../services/DataManager.js';
import BackGround from '../services/BackGround.js';


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
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom
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
                .html("time: " + d.time + "<br/>" + "value: " + d.value + "<br/>" + "source: " + d.source)
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
        var x = d3.scaleTime().range([0, width]),
            xBase = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0])

        var xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y);

        //Zoom Objekt siehe
        //https://github.com/d3/d3-zoom
        var zoom = d3.zoom()
            //Wie viel man unzoomen und zoomen kann
            .translateExtent([
                [0, 0],
                [width, height]
            ])
            .extent([
                [0, 0],
                [width, height]
            ])
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

        var spaltsG = svg.append("g")
        var spaltGroup = spaltsG.append("g").classed('spaltGraph', true)
        var circsG = svg.append("g")
        var rectsG = svg.append("g")
        var percentilGroup = rectsG.append("g").classed('percentilGraph', true)

        displayGlucose(data, x);
        svg.call(zoom);

        //Einfuegen und Updaten der Kreise
        function displayGlucose() {
            var gd = dm.getGlucoseCGMData();

            if (gd.type == 'intraday') {
                creatBackGround()
                displayGlucose_intraday(gd)
            }
            if (gd.type == 'hourly') {
                creatBackGround()
                displayGlucose_percentil(gd);
            }
            if (gd.type == 'daily') {
                creatBackGround()
                displayGlucose_percentil(gd);
            }
            if (gd.type == 'weekly') {
                creatBackGround()
                displayGlucose_percentil(gd);
            }
            if (gd.type == 'monthly') {
                creatBackGround()
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
                .attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')')

        }


        function removePercentil() {
            percentilGroup.selectAll('g').remove()
        }


        //universal Scala-Spalt
        // entwurf process 
        //--> 1.lokalisiere layout von Spalten(context und Zusammenhang mit anderen layout) 
        //--> 2.absolute Locations von x-scala(https://github.com/d3/d3/wiki/API--%E4%B8%AD%E6%96%87%E6%89%8B%E5%86%8C
        //quelle Codes von axis.js Zeile 125. und ad Zeile 45.) 
        //--> 3.grobe Implemmentierung(benutze hilfe Functiuonen um attributen von Spalten zu bekommen)
        //--> 4.Codes rekunstruieren(versuche mit breitstehendes Code-style übereinstimmen, **performence noch nicht getestet**)
        //--> 5.löse Problem: mit separaten Spalten jeweils Scala oder mit interative sich abdeckende Spalten um natürliche Abstufung darzustellen
        //muss noch diskudieren wegen Performence und Style
        //--> 6.(noch nicht!) Style mit back-ground anzupassen
        //--> 7.(noch nicht!) Animation beim Zoomen
        //--> 8.(noch nicht!) ??? nach feedback
        function creatBackGround() {
            var bg = new BackGround();
            var readTicks = bg.readTicks(x);
            var opacityArr = bg.creatOpacity();
            var xPos = bg.creatXpos(x);
            var wdArr = bg.getWds();
            console.log("ticks", x.ticks())
            console.log("opacityArr", opacityArr)
            console.log("xPos", xPos)
            console.log("wdArr", wdArr)
            var ticksGroup = spaltGroup.selectAll('g').data(xPos).join(
                function(enter) {
                    let group = enter.append('g').classed('spalt', true)
                    group.append('rect')
                        .attr('x', d => d)
                        .attr('y', y(400))
                        .attr('height', 390 - margin.top)
                        .attr('width', (d, i) => wdArr[i])
                        .style("fill", "gray")
                        .style("opacity", (d, i) => opacityArr[i])
                        .classed("tag", true)
                    group.attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')');
                },
                function(update) {
                    update.select('rect.tag')
                        .attr('x', d => d)
                        .attr('width', (d, i) => wdArr[i])
                        .style("opacity", (d, i) => opacityArr[i])
                }
            )
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
                function(enter) {
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
                function(update) {
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
            displayGlucose()
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
        } finally {

            this.initD3(data.data);
        }
    }
}

export default hot ? hot(module)(D3Sample) : D3Sample;