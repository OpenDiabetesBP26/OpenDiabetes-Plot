import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';

class PercentileDay extends Component {
    constructor(props) {
        super(props);
        this.state = { data: props.data, svg: props.svg, x: props.x }
        this.svg = React.createRef()
    }
    render() {
        return (
            <svg id='percentile-day' width="100%" height="500" ref={(svg) => this.svg = svg}></svg>
         );
    }
    componentDidMount(){
        let x = d3.scaleTime().domain(d3.extent(this.props.data, d => d.time)).range(this.props.x.range());
        let y = d3.scaleLinear().domain([0, 400]).range([500, 0]);
        this.x = x;
        this.y = y;
        let y_axis = d3.axisLeft(y);
        let x_axis = d3.axisBottom(x);

        let svg = d3.select("svg#percentile-day");
        this.axisGroup_x = svg.append('g');
        this.axisGroup_y = svg.append('g');
        this.data_group = svg.append('g');
        this.data_group.call(y_axis).attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top +60) + ')');
        this.axisGroup_y.call(y_axis).attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top +60) + ')');
        this.axisGroup_x.call(x_axis).attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top +60) + ')');
        this.drawChart(this.props);

    }
    drawChart() {
        let x = d3.scaleTime().domain(d3.extent(this.props.data, d => d.time)).range(this.props.x.range());
        let x_axis = d3.axisBottom(x);
        this.axisGroup_x.call(x_axis);

        
        let y = this.y;
        //Median
        let median = [];
        this.props.data.forEach(d => median.push({y: y(d.value[2]), x: x(d.time)}))

        let upper = [];
        this.props.data.forEach(d => upper.push({y1: y(d.value[1]), y2: y(d.value[3]), x: x(d.time)}))

        let lines = d3.line().x(d => d.x).y(d=>d.y);
        let area = d3.area().x(d => d.x).y0(d => d.y1).y1(d=>d.y2);
        
        if(this.data_group){
            this.data_group.selectAll("path").remove();
            this.data_group.append("path").attr("d", area(upper)).attr("stroke", "lightblue").attr("style", "fill: lightblue").attr("stroke-width", 2).attr("fill", "none");
            this.data_group.append("path").attr("d", lines(median)).attr("stroke", "blue").attr("stroke-width", 2).attr("fill", "none");
        }

    }
    UNSAFE_componentWillReceiveProps(nextProps){
        console.log(nextProps.data)
        this.drawChart(nextProps);
    }
    shouldComponentUpdate(){
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(PercentileDay) : PercentileDay;