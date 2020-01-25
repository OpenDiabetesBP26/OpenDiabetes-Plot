import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
import BackGround from '../../services/BackGround.js';

class IntradayChart extends Component {
    constructor(props) {
        super(props);
        this.state = { data: props.data, svg: props.svg, x: props.x }
    }
    render() {
        return (
            <g id='intraday' ref={g => this.g = g}></g>
        );
    }
    componentDidMount() {
        if (this.props.data != null) {
            let xAxis = d3.axisBottom(this.props.x)

            let yAxis = d3.axisLeft(this.props.y);
            this.yBasal = d3.scaleLinear().range([150, 0]).domain([0, 5]);
            let yBasalAxis = d3.axisRight(this.yBasal)
            let y = this.props.y;
            let margin = this.props.margin;
            let width = 1000;


            let comp = d3.select("g#intraday");





            //svg graph für background
            this.background = comp.append("g")
            //add background für bar am top
            this.topbar = comp.append("rect")
                .attr("class", "topbar")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .attr("height", 25)
                .attr("width", this.props.x.range()[1])
                .attr("fill", "#2E86C1")
                .style("opacity", 0.6)
            //Chart Legende
            this.legendeBackground = comp.append("rect")
                .attr("class", "legendeBackground")
                .attr("x", margin.left)
                .attr("y", margin.top + 26)
                .attr("height", 33)
                .attr("width", this.props.x.range()[1])
                .style("opacity", 0.3)
                .style("fill", "#F8F9F9") //"#F8F9F9"


            this.legendeText = comp.append("text")
                .text("BLOOD BLUCOSE     mg/dL")
                .attr("class", "legendeText")
                .attr("x", margin.left + 5)
                .attr("y", margin.top + 47)
                .style("font", "sans-serif")
                .attr("fill", "black")

            //svg graph für x und y achse
            //init x und y achse
            this.xAxis_graph = comp.append("g")
                .attr("class", "xline")
                .style("color", "white")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 25) + ")")
                .call(xAxis);



            this.yAxis_graph = comp.append("g")
                .attr("class", "yline")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 60) + ")")
                .call(yAxis);
            this.yBasal_graph = comp.append("g")
                .attr("class", "yline")
                .attr("transform", "translate(" + (margin.left + this.props.x.range()[1]) + "," + (margin.top + 60 + this.props.y.range()[0] - 150) + ")")
                .call(yBasalAxis)

            this.circs = comp.append('g');
            this.line = comp.append("g");



            this.drawChart(this.props);


        }

    }
    drawChart(props) {
        let y = props.y;
        let x = props.x;
        let yb = this.yBasal;

        //wenn xAxis neue Scale bekommt, erneue Graph von xAxis und draw Background
        if (this.xAxis_graph) {
            //neue xAxis Daten von props
            var newxAxis = d3.axisTop(x)
            this.xAxis_graph.call(newxAxis)
            var bg = new BackGround();
            var readTicks = bg.readTicks(x);
            var opacityArr = bg.creatOpacity();
            var xPos = bg.creatXpos(x);
            var wdArr = bg.getWds();
            //console.log("opacityArr", opacityArr)
            var ticksGroup = this.background.selectAll('rect').data(xPos).join(
                (enter) => enter.append('rect')
                    .attr('x', d => d)
                    .attr('y', y(400))
                    .attr('height', 400)
                    .attr('width', (d, i) => wdArr[i])
                    .style("fill", "lightgray")
                    .style("opacity", (d, i) => opacityArr[i]),
                (update) => update
                    .attr('x', d => d)
                    .attr('width', (d, i) => wdArr[i])
                    .style("opacity", (d, i) => opacityArr[i])
            )
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top + 60) + ')');

        }

        //circle_color 
        var circleColor = function (d) {
            return d.value >= 185 ? '#3498DB' : d.value >= 65 ? '#58D68D' : '#DC7633';
        }

        if (this.circs != null) {
            var circles = this.circs.selectAll('circle').data(props.data.glucose).join(
                (enter) => enter.append('circle')
                    .attr('r', 3)
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                    .attr('fill', circleColor),
                (update) => update
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                    .attr('fill', circleColor)
            )
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top + 60) + ')');
        }
        if (this.line != null) {
            var line = this.line.selectAll('line').data(props.data.basal).join(
                (enter) => enter.append('line')
                    .attr('x1', d => x(+d.time_start) < 0 ? 0 : x(+d.time_start))
                    .attr('y1', d => yb(+d.value))
                    .attr('x2', d => x(d.time_end) > x.range()[1] ? x.range()[1] : x(d.time_end))
                    .attr('y2', d => yb(+d.value))
                    .attr('stroke', 'blue'),
                (update) => update
                    .attr('x1', d => x(+d.time_start) < 0 ? 0 : x(+d.time_start))
                    .attr('y1', d => yb(+d.value))
                    .attr('x2', d => x(d.time_end) > x.range()[1] ? x.range()[1] : x(d.time_end))
                    .attr('y2', d => yb(+d.value)))

                .attr('transform', 'translate(' + this.props.margin.left + ' ' + ((this.props.margin.top + 60 + this.props.y.range()[0] - 150)) + ')');
        }

        //update topbar
        if (this.topbar) {
            this.topbar.attr("width", this.props.x.range()[1]);
            this.legendeBackground.attr("width", this.props.x.range()[1]);
        }
        //Update Normals for now
        if (this.gcHigh) {
            this.gcHigh.attr('width', props.x.range()[1]);
        }
        if (this.gcNormal) {
            this.gcNormal.attr('width', props.x.range()[1]);
        }
        if (this.gcLow) {
            this.gcLow.attr('width', props.x.range()[1]);
        }
    }
    /*
    creatColor(data){
        var color = data.value >= this.props.y(185) ? '#3498DB' : data.value >= this.props.y(70) ? '##27AE60' : data.value >= this.props.y(0) ? '#DC7633' : '#FDFEFE'
        return color;
    }
    */


    componentWillReceiveProps(nextProps) {
        //Wir können Daten hier neu rendern
        this.drawChart(nextProps);
        console.log(nextProps.data);
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
    componentDidUpdate() { }
}

export default hot ? hot(module)(IntradayChart) : IntradayChart;