import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';

//import { geoMercator, geoPath } from 'd3-geo'

class D3Sample extends Component {
    render() {

        return <div><div id="my_dataviz"></div><svg id="test" width="500" height="500"></svg></div>;
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
    const data = [
      {date: new Date(2019, 11, 5, 8, 0), value: 102},
      {date: new Date(2019, 11, 5, 8, 30), value: 115},
      {date: new Date(2019, 11, 5, 9, 0), value: 152},
      {date: new Date(2019, 11, 5, 9, 30), value: 132},
      {date: new Date(2019, 11, 5, 10, 0), value: 92},
    ]

    //Selects first element of type
    const svg = d3.select('svg');
    const height = +svg.attr('height');
    const width = +svg.attr('width');
    //Appends element and returns it
    const g = svg.append('g').attr('transform', `translate(30,0)`);

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

	}
}

export default hot ? hot(module)(D3Sample) : D3Sample;
