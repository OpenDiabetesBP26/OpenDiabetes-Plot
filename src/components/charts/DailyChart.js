import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';
import BackGround from '../../services/BackGround.js';
class DailyChart extends Component {
    constructor(props) {
        super(props);
        this.state = { data: props.data, svg: props.svg, x: props.x }
    }
    render() {
        return (
            <g id='daily' ref={g => this.g = g}></g>
         );
    }
    componentDidMount(){
        /**
         * Hier können einmalige Objekte eingeügt und erstellt werden
         */
        console.log('Threehour mount');
        let xAxis = d3.axisBottom(this.props.x);
        let yAxis = d3.axisLeft(this.props.y);
        let y = this.props.y;
		let x = this.props.x;
        let margin = this.props.margin;
        let width = 1000;

        let comp = d3.select("g#daily");
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

        //drei Kreise von Legende
            this.lengdeCircs =
                comp.append("circle")
                .attr("class", "legendeCircleH")
                .attr('cx', x.range()[1] - 20)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
				.style("fill", "#3498DB")
            comp.append("circle")
                .attr("class", "legendeCircleN")
                .attr('cx', x.range()[1] - 40)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
				.style("fill", "#58D68D")
            comp.append("circle")
                .attr("class", "legendeCircleL")
                .attr('cx', x.range()[1] - 60)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
				.style("fill", "#DC7633")
		//Text von Legendecircle
		this.legendeText =
                comp.append("text")
                .attr("class", "legendeCircText")
                .text("low high")
                .attr("x", x.range()[1] - 110)
                .attr("y", margin.top + 50)	
				.style("word-spacing", "80px")
				.style("font", "sans-serif")
				.style("fill", "lightgray")
				
        this.legendeText = comp.append("text")
            .text("BLOOD BLUCOSE     mg/dL")
            .attr("class", "legendeText")
            .attr("x", margin.left + 5)
            .attr("y", margin.top + 47)
            .style("font", "sans-serif")
            .attr("fill", "black")
		
		//dotted line
		this.dashLine =
                comp.append("line")
                .attr("class", "dashLineH_N")
                .attr("x1", margin.left + x.range()[0])
                .attr("y1", margin.top + 60 + y(185))
                .attr("x2", margin.left + x.range()[1])
                .attr("y2", margin.top + 60 + y(185))
				.style("stroke-dasharray", "4, 7")
				.style("stroke", "#F4F6F7")
				.style("stroke-width", "2")
				
            comp.append("line")
                .attr("class", "dashLineN_L")
                .attr("x1", margin.left + x.range()[0])
                .attr("y1", margin.top + 60 + y(65))
                .attr("x2", margin.left + x.range()[1])
                .attr("y2", margin.top + 60 + y(65))
				.style("stroke-dasharray", "4, 7")
				.style("stroke", "#F4F6F7")
				.style("stroke-width", "2")
				
        //svg graph für x und y achse
        //init x und y achse
        this.xAxis_graph = comp.append("g")
            .attr("class", "xline")
            .style("color", "white")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + 25) + ")")
            .call(xAxis);



        this.yAxis_graph = comp.append("g")
            .attr("class", "yline")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + 60)+ ")")
            .call(yAxis);
		// y abdeckung
		this.yAbdeckung = comp.append("line")
                .attr("class", "yAbdeckung")
                .attr("x1", margin.left)
                .attr("y1", margin.top + y(400))
                .attr("x2", margin.left)
                .attr("y2", margin.top + 60 + y(0))
				.style("stroke", "white")
				.style("stroke-width", "2")
        this.circs = comp.append('g');
        this.drawChart(this.props);

    }
    drawChart(props) {
        let y = props.y;
        let x = props.x;

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
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top +60) + ')');

        }

        //circle_color 
        var circleColor = function(d) {
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

        //update topbar
        if (this.topbar) {
            this.topbar.attr("width", this.props.x.range()[1]);
            this.legendeBackground.attr("width", this.props.x.range()[1]);
			d3.select(".legendeCircleH").attr('cx', x.range()[1] - 20);
            d3.select(".legendeCircleN").attr('cx', x.range()[1] - 40);
            d3.select(".legendeCircleL").attr('cx', x.range()[1] - 60);
            d3.select(".legendeCircText").attr("x", x.range()[1] - 110);
            d3.select(".dashLineH_N").attr("x2", this.props.margin.left + x.range()[1]);
            d3.select(".dashLineN_L").attr("x2", this.props.margin.left + x.range()[1])
        }
    }
    componentWillReceiveProps(nextProps){
        console.log('DATA DEBUG')
        console.log(nextProps.data)
        this.drawChart(nextProps);
    }
    shouldComponentUpdate(){
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(DailyChart) : DailyChart;