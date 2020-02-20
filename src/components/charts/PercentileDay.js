import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';
import TimeAxis from './TimeAxis';

class PercentileDay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <svg id='percentile-day' width="100%" height="580" ref={(svg) => this.svg = svg}>
            <g className="time-axis" transform='translate(60,00)' ref={(axis) => this.timeAxxis = axis}>
            <TimeAxis x={this.x} />
            </g>
            <g className="mainGroup" transform='translate(60,80)' ref={(group) => this.mainGroupElement = group}></g>
            </svg>
         );
    }
    componentDidMount(){
        let x = d3.scaleTime().domain(d3.extent(this.props.data, d => d.time)).range(this.props.x.range());
        let y = d3.scaleLinear().domain([0, 400]).range([500, 0]);
        this.x = x;
        this.y = y;
        let y_axis = d3.axisLeft(y);

        this.mainGroup = d3.select(this.mainGroupElement);
        this.axisGroup_x = this.mainGroup.append('g');
        this.axisGroup_y = this.mainGroup.append('g');
        this.data_group = this.mainGroup.append('g');
        this.data_group.call(y_axis);
        this.axisGroup_y.call(y_axis);
        this.drawChart(this.props);

    }
    drawChart(props) {
        let x = d3.scaleTime().domain(d3.extent(this.props.data, d => d.time)).range(props.x.range());
        this.x = x;
        d3.select(this.timeAxxis).select('g.upperTimeAxis').remove();

        
        let y = this.y;
        //Median
        let median = [];

        let upper = [];
        
        let outer = [];

        props.data.forEach( d => {
            if(!isNaN(y(d.value[2]))) median.push({y: y(d.value[2]), x: x(d.time)})
            if(!isNaN(y(d.value[1])) && !isNaN(y(d.value[3]))) upper.push({y1: y(d.value[1]), y2: y(d.value[3]), x: x(d.time)})
            if(!isNaN(y(d.value[0])) && !isNaN(y(d.value[4]))) outer.push({y1: y(d.value[0]), y2: y(d.value[4]), x: x(d.time)})
        })

        let lines = d3.line().x(d => d.x).y(d=>d.y);
        let area = d3.area().x(d => d.x).y0(d => d.y1).y1(d=>d.y2);
        
        if(this.data_group){
            this.data_group.selectAll("path").remove();
            this.data_group.append("path").attr("d", area(outer)).attr("stroke", "#daf3f7").attr("style", "fill: #daf3f7").attr("stroke-width", 2).attr("fill", "none");
            this.data_group.append("path").attr("d", area(upper)).attr("stroke", "lightblue").attr("style", "fill: lightblue").attr("stroke-width", 2).attr("fill", "none");
            this.data_group.append("path").attr("d", lines(median)).attr("stroke", "blue").attr("stroke-width", 2).attr("fill", "none");
        }

    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.drawChart(nextProps);
    }
    shouldComponentUpdate(){
        //Update ausgeschaltet -> wird nicht neu gerendert
        return true;
    }
}
export default hot ? hot(module)(PercentileDay) : PercentileDay;