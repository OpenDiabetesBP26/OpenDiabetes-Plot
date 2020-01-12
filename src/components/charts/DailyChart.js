import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';

class DailyChart extends Component {
    constructor(props){
        super(props);
        this.state = { data: props.data, svg: props.svg, x:props.x }
    }
    render() {
        console.log('Render Daily Chart');
        return (
            <g id='intraday' ref={g => this.g = g}></g>
         );
    }
    componentDidMount(){
        if(this.state.data != null){
            let xAxis = d3.axisBottom(this.props.x);
            let yAxis = d3.axisLeft(this.props.y);
            let y = this.props.y;
            let margin = this.props.margin;
            let width = 1000;

            let comp = d3.select("g#intraday");

            var gcHigh = comp.append("rect")
            .attr("class", "gcHigh")
            .attr("y", y(400) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(185) - y(400))
            .attr("width", width)
            .attr("fill", "#f5f0b8")
            var gcNormal = comp.append("rect")
            .attr("class", "gcNormal")
            .attr("y", y(180) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(70) - y(180))
            .attr("width", width)
            .attr("fill", "#e0e0e0")
            var gcLow = comp.append("rect")
            .attr("class", "gcLow")
            .attr("y", y(65) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(0) - y(65))
            .attr("width", width)
            .attr("fill", "#faafaa")

            this.circs = comp.append('g');



            
        }

    }
    componentWillReceiveProps(nextProps){
        //Wir können Daten hier neu rendern
        console.log(nextProps.data);
        let y = nextProps.y;
        let x = nextProps.x;
        if(this.circs != null){
            var circles = this.circs.selectAll('circle').data(nextProps.data.glucose).join(
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
    }
    shouldComponentUpdate(){
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
    componentDidUpdate(){
    }
}

export default hot ? hot(module)(DailyChart) : DailyChart;