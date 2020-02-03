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
        this.data_group.call(y_axis).attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top +60) + ')');;
        this.axisGroup_y.call(y_axis).attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top +60) + ')');;
        this.axisGroup_x.call(x_axis).attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top +60) + ')');;
        this.drawChart(this.props);

    }
    drawChart(props) {
        let x = d3.scaleTime().domain(d3.extent(this.props.data, d => d.time)).range(this.props.x.range());
        let x_axis = d3.axisBottom(x);
        this.axisGroup_x.call(x_axis);

        
        let y = this.y;
        //Median
        let median = [];
        this.props.data.forEach(d => median.push({y: y(d.value[2]), x: x(d.time)}))

        let upper = [];
        this.props.data.forEach(d => upper.push({y1: y(d.value[1]), y2: y(d.value[3]), x: x(d.time)}))
		
		let upperst = [];
		this.props.data.forEach(d => upperst.push({y1: y(d.value[3]), y2: y(d.value[4]), x: x(d.time)}))
		
		let lowerst = [];
		this.props.data.forEach(d => lowerst.push({y1: y(d.value[0]), y2: y(d.value[1]), x: x(d.time)}))


        let lines = d3.line().x(d => d.x).y(d=>d.y);
        let area = d3.area().x(d => d.x).y0(d => d.y1).y1(d=>d.y2);
  
        if(this.data_group){
            this.data_group.selectAll("path").remove();
			this.data_group.append("path").attr("d", area(upperst)).attr("stroke", "#B0C4DE").attr("style", "fill: #B0C4DE").attr("stroke-width", 2).attr("fill", "none");
			this.data_group.append("path").attr("d", area(lowerst)).attr("stroke", "#ADD8E6").attr("style", "fill: #ADD8E6").attr("stroke-width", 2).attr("fill", "none");
			this.data_group.append("path").attr("d", area(upper)).attr("stroke", "#00BFFF").attr("style", "fill: #00BFFF").attr("stroke-width", 2).attr("fill", "none");
            this.data_group.append("path").attr("d", lines(median)).attr("stroke", "#00008B").attr("stroke-width", 2).attr("fill", "none");
        }

    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps.data)
        this.drawChart(nextProps);
    }
    shouldComponentUpdate(){
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(PercentileDay) : DailyCPercentileDay;