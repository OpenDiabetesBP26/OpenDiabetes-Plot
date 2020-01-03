import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';
import DataManager from './DataManager.js';

//import { geoMercator, geoPath } from 'd3-geo'

class D3Sample extends Component {
  constructor(props){
    super(props);
  }

  render() {
      return <div><h2 id="d3sample_pagetitle">D3 Sample</h2><div id="my_dataviz"></div><svg id="d3sample" width="1000" height="500"></svg></div>;
  }

  initD3(data) {
	var dm = new DataManager();
	dm.readData(data);
	console.log(dm.getData());
	console.log(dm.getGlucoseCGMData());
	
    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var parseDate = d3.timeParse("%b %Y");

    var x = d3.scaleTime().range([0, width]),
        xBase = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0])

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);


    //Zoom Objekt siehe
    //https://github.com/d3/d3-zoom
    var zoom = d3.zoom()
        //Wie viel man unzoomen und zoomen kann
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




    //Initial domains
    x.domain(d3.extent(dm.getGlucoseCGMData(), function(d) { return d.time}))
    y.domain(d3.extent(dm.getGlucoseCGMData(), function(d) { return +d.value}))
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
        .attr("y", y(400)+margin.top)
        .attr("x", margin.left)
        .attr("height", y(185)-y(400))
        .attr("width", width)
        .attr("fill", "#f5f0b8")
    var gcNormal = svg.append("rect")
        .attr("class", "gcNormal")
        .attr("y", y(180)+margin.top)
        .attr("x", margin.left)
        .attr("height", y(70)-y(180))
        .attr("width", width)
        .attr("fill", "#e0e0e0")
    var gcLow = svg.append("rect")
        .attr("class", "gcLow")
        .attr("y", y(65)+margin.top)
        .attr("x", margin.left)
        .attr("height", y(0)-y(65))
        .attr("width", width)
        .attr("fill", "#faafaa")
    var circsG = svg.append("g")

    displayGlucose();
    svg.call(zoom);
	


    //Einfuegen und Updaten der Kreise
    function displayGlucose(){
      var circs = circsG.selectAll('circle').data(dm.getGlucoseCGMData()).join(
        (enter) => enter.append('circle')
                          .attr('r', 3)
                          .attr('cy', d => y(+d.value))
                          .attr('cx', d => x(d.time)),
        (update) => update
                          .attr('cy', d => y(+d.value))
                          .attr('cx', d => x(d.time))
      )
      .attr('transform', 'translate(' + margin.left + ' ' + margin.top +')');
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
      displayGlucose();
    }

    function type(d) {
      d.date = parseDate(d.date);
      d.price = +d.price;
      return d;
    }
  }

	componentDidMount(){
    fetch("/data/2019-11-20-1349_export-data.json").then(response=>{
      response.json().then(data=> {
        this.initD3(data);
      });
    });
	}
}

export default hot ? hot(module)(D3Sample) : D3Sample;
