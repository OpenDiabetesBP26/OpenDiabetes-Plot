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
            <g ref={g => this.g = g}></g>
         );
    }
    componentDidMount(){
        if(this.state.data != null){
        //Create d3 stuff
        var margin = { top: 20, right: 20, bottom: 110, left: 40 },
        width = 1000,
        height = 400;

        var x = d3.scaleTime().range([0, width]),
            xBase = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0])

        var xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y);
        
        x.domain(d3.extent(this.state.data, d => d.time))
        y.domain([0, 400])
        console.log('not null')
        }

    }
    componentWillReceiveProps(nextProps){
        //Wir können Daten hier neu rendern
        console.log('New Props')
    }
    shouldComponentUpdate(){
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
    componentDidUpdate(){
        console.log('Update Daily Chart')
        console.log(this.props.data)
        console.log(this.props.svg)
    }
}

export default hot ? hot(module)(DailyChart) : DailyChart;