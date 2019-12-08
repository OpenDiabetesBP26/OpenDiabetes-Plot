import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';
import Timeline from './Chart/Timeline';
//Load Test Data here !!! TODO -> import custom data
import data from '../../data/2019-11-20-1349_export-data.json';
//import { geoMercator, geoPath } from 'd3-geo'

class D3Sample extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
        };
    }
    render() {

        return <div>
          <svg id="food-chart" width="500" height="500">
            </svg>
            </div>;
    }
    // render() {
    //     const projection = geoMercator()
    //     const pathGenerator = geoPath().projection(projection)
    //     const countries = worlddata.features
    //        .map((d,i) => <path
    //        key={'path' + i}
    //        d={pathGenerator(d)}
    //        className='countries'
    //        />)
    //  return <svg width={500} height={500}>
    //         {countries}
    //         </svg>
    //  }
	componentDidMount(){
    //Debug outprint
    //Filter only CGM Data
    let glucoseData = data.data.slice(0,100).filter((e) => e.type=='GLUCOSE_CGM')
    var formatTime = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z");
    //Parse Time String to Date
    glucoseData.forEach(e => e.isoTime = formatTime(e.isoTime))
    //Select SVG
    const svg = d3.select('svg')
    const height = +svg.attr('height')
    const width = +svg.attr('width')
    const margin = {top: 20, right: 20, bottom: 20, left: 40}

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const yScale = d3.scaleLinear().domain([400, 0]).range([0, height-margin.top-margin.bottom]);
    const xScale = d3.scaleTime().domain(d3.extent(glucoseData, (d) => d.isoTime)).range([0, width-margin.left-margin.right]);
    const yAxis = d3.axisLeft().scale(yScale)
    const xAxis = d3.axisBottom().scale(xScale)
    const yAxisG = svg.append('g').attr('class', 'axisY').attr('transform', `translate(${margin.left},${margin.top})`)
    const xAxisG = svg.append('g').attr('class', 'axisX').attr('transform', `translate(${margin.left},${height-margin.bottom})`)
    yAxisG.call(yAxis)
    xAxisG.call(xAxis)
    var rect = g.append('rect')
      .attr('y', yScale(180))
      .attr('x', 0)
      .attr('width', 1000)
      .attr('height', yScale(90)-yScale(180))
      .attr('transform', `translate(0,0)`)
      .style('fill', '#62fc03')
      .style('opacity', 0.5)
        
    var circs = g.selectAll('circle').data(glucoseData).join(
      (enter) => enter.append('circle')
                      .attr('cx', (d) => xScale(d.isoTime))
                      .attr('cy', (d) => yScale(d.value))
                      .attr('r', 3)
                      .attr('stroke', 'black'),
      (update) => update,
      (exit) => exit.remove()
    );
  
    /*
    const data = [
      {date: new Date(2019, 11, 5, 8, 0), value: 102},
      {date: new Date(2019, 11, 5, 8, 30), value: 115},
      {date: new Date(2019, 11, 5, 9, 0), value: 152},
      {date: new Date(2019, 11, 5, 9, 30), value: 132},
      {date: new Date(2019, 11, 5, 10, 0), value: 92},
    ]
    //Selects first element of type
    const svg = d3.select('svg#d3sample_image');
    const height = +svg.attr('height');
    const width = +svg.attr('width');
    //Appends element and returns it
    const g = svg.append('g').attr('transform', `translate(30,0)`);
	//Adding Scales
    const yScale = d3.scaleLinear().domain([400, 0]).range([0, height]);
    const xScale = d3.scaleTime().domain(d3.extent(data, (d) => d.date)).range([0, width]);

    const yAxis = d3.axisLeft().scale(yScale)
    const xAxis = d3.axisBottom().scale(xScale)
    const yAxisG = svg.append('g').attr('class', 'axisY').attr('transform', `translate(30,0)`)
    const xAxisG = svg.append('g').attr('class', 'axisX').attr('transform', `translate(30,${height-20})`)
    yAxisG.call(yAxis)
    xAxisG.call(xAxis)


    const test = function(d){
      console.log(xScale(d))
    };
    var circs = g.selectAll('circle').data(data).join(
      (enter) => enter.append('circle')
                      .attr('cx', (d) => xScale(d.date))
                      .attr('cy', (d) => yScale(d.value))
                      .attr('r', 10)
                      .attr('stroke', 'black'),
      (update) => update,
      (exit) => exit.remove()
    );
  
  //Food Chart
  //Test Data
  const dataFood = [
    {date: new Date(2019, 11, 5, 8, 0), value: 56},
    {date: new Date(2019, 11, 5, 8, 30), value: 12},
    {date: new Date(2019, 11, 5, 9, 30), value: 12},
    {date: new Date(2019, 11, 5, 10, 0), value: 6},
    {date: new Date(2019, 11, 5, 12, 0), value: 152},
    {date: new Date(2019, 11, 5, 13, 0), value: 12},
    {date: new Date(2019, 11, 5, 14, 0), value: 32},
    {date: new Date(2019, 11, 5, 16, 0), value: 12},
    {date: new Date(2019, 11, 5, 19, 30), value: 132},
    {date: new Date(2019, 11, 5, 21, 0), value: 12},
  ]
  //Creating Selection
  const foodChart = d3.select('svg#food-chart');
  //Creating vars for graph size
  const widthChart = +foodChart.attr('width');
  const heightChart = +foodChart.attr('height');
  const margin = {top: 50, right: 40, bottom: 30, left: 40};
  const innerWidth = widthChart - margin.right - margin.left;
  const innerHeight = heightChart - margin.top - margin.bottom;
  const widthRect = 20
  //Creating Scales
  //Y Scale --> food consumed
  const yScaleFood = d3.scaleLinear().domain([d3.max(dataFood, d => d.value),0]).range([0,innerHeight])
  const xScaleFood = d3.scaleTime().domain(d3.extent(dataFood, (d) => d.date)).range([0,innerWidth])
  const groupFood = foodChart.append('g')
                                .attr('transform', 'translate('+margin.left+','+margin.top + ')'); //Move to offset
  const rects = groupFood.selectAll('rect').data(dataFood).join(
    (enter) => enter.append('rect')
                  .attr('height', d => innerHeight-yScaleFood(d.value))
                  .attr('x', d => xScaleFood(d.date))
                  .attr('y', d=>yScaleFood(d.value))
                  .attr('width', widthRect)
  );
  //Add Axes
  const xAxisFood = d3.axisBottom().scale(xScaleFood)
  const xAxisFoodG = foodChart.append('g')
                        .attr('class', 'xAxis')
                        .attr('transform', 'translate('+margin.left+','+(heightChart-margin.bottom)+')')
                        .call(xAxisFood)
  const yAxisFood = d3.axisLeft().scale(yScaleFood)
  const yAxisFoodG = foodChart.append('g')
                        .attr('class', 'yAxis')
                        .attr('transform', 'translate('+margin.left+', '+margin.top+')')
                        .call(yAxisFood)
  */
	}
}

export default hot ? hot(module)(D3Sample) : D3Sample;
