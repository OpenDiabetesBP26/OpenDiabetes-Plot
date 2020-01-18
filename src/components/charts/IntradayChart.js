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
            let xAxis = d3.axisBottom(this.props.x);
            let yAxis = d3.axisLeft(this.props.y);
            let y = this.props.y;
            let margin = this.props.margin;
            let width = 1000;


            let comp = d3.select("g#intraday");

            this.gcHigh = comp.append("rect")
                .attr("class", "gcHigh")
                .attr("y", y(400) + margin.top)
                .attr("x", margin.left)
                .attr("height", y(185) - y(400))
                .attr("width", width)
                .attr("fill", "#f5f0b8")
            this.gcNormal = comp.append("rect")
                .attr("class", "gcNormal")
                .attr("y", y(180) + margin.top)
                .attr("x", margin.left)
                .attr("height", y(70) - y(180))
                .attr("width", width)
                .attr("fill", "#e0e0e0")
            this.gcLow = comp.append("rect")
                .attr("class", "gcLow")
                .attr("y", y(65) + margin.top)
                .attr("x", margin.left)
                .attr("height", y(0) - y(65))
                .attr("width", width)
                .attr("fill", "#faafaa")

            this.circs = comp.append('g');

            //svg graph für background
            this.background = comp.append("g")

            //svg graph für x und y achse
            //init x und y achse
            this.xAxis_graph = comp.append("g")
                .attr("class", "xline")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(xAxis);
            this.yAxis_graph = comp.append("g")
                .attr("class", "yline")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(yAxis);

            this.drawChart(this.props);


        }

    }
    drawChart(props) {
        let y = props.y;
        let x = props.x;

        //wenn xAxis neue Scale bekommt, erneue Graph von xAxis und draw Background
        if (this.xAxis_graph) {
            //neue xAxis Daten von props
            var newxAxis = d3.axisBottom(x)
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
                    .style("fill", "gray")
                    .style("opacity", (d, i) => opacityArr[i]),
                    (update) => update
                    .attr('x', d => d)
                    .attr('width', (d, i) => wdArr[i])
                    .style("opacity", (d, i) => opacityArr[i])
                )
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + this.props.margin.top + ')');

        }



        if (this.circs != null) {
            var circles = this.circs.selectAll('circle').data(props.data.glucose).join(
                    (enter) => enter.append('circle')
                    .attr('r', 3)
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time)),
                    (update) => update
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                )
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + this.props.margin.top + ')');
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

    componentWillReceiveProps(nextProps) {
        //Wir können Daten hier neu rendern
        this.drawChart(nextProps);
        //console.log(nextProps.xSize);
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
    componentDidUpdate() {}
}

export default hot ? hot(module)(IntradayChart) : IntradayChart;