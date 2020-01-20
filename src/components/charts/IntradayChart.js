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
            let xAxis = d3.axisBottom(this.props.x)

            let yAxis = d3.axisLeft(this.props.y);
            let y = this.props.y;
            let x = this.props.x;
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
                .attr("transform", "translate(" + 0 + "," + 60 + ")")

            this.gcNormal = comp.append("rect")
                .attr("class", "gcNormal")
                .attr("y", y(180) + margin.top)
                .attr("x", margin.left)
                .attr("height", y(70) - y(180))
                .attr("width", width)
                .attr("fill", "#e0e0e0")
                .attr("transform", "translate(" + 0 + "," + 60 + ")")

            this.gcLow = comp.append("rect")
                .attr("class", "gcLow")
                .attr("y", y(65) + margin.top)
                .attr("x", margin.left)
                .attr("height", y(0) - y(65))
                .attr("width", width)
                .attr("fill", "#faafaa")
                .attr("transform", "translate(" + 0 + "," + 60 + ")")




            //alle css Teilen muessen nacharbeitet werden.
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
                .style("fill", "#F8F9F9")
                //drei Kreise von Legende
            this.lengdeCircH = comp.append("circle")
                .attr("class", "legendeCircleH")
                .attr('cx', x.range()[1] - 20)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
                .attr('fill', '#3498DB')
            this.lengdeCircN = comp.append("circle")
                .attr("class", "legendeCircleN")
                .attr('cx', x.range()[1] - 40)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
                .attr('fill', '#58D68D')
            this.lengdeCircL = comp.append("circle")
                .attr("class", "legendeCircleL")
                .attr('cx', x.range()[1] - 60)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
                .attr('fill', '#DC7633')
                //Text1 von Legende
            this.legendeCircTextL = comp.append("text")
                .attr("class", "legendeCircTextL")
                .text("low")
                .attr("x", x.range()[1] - 105)
                .attr("y", margin.top + 50)
                .style("font", "sans-serif")
                .attr("fill", "gray")
            this.legendeCircTextH = comp.append("text")
                .attr("class", "legendeCircTextH")
                .text("high")
                .attr("x", x.range()[1])
                .attr("y", margin.top + 50)
                .style("font", "sans-serif")
                .attr("fill", "gray")
                //Text2 von Legende
            this.legendeText = comp.append("text")
                .text("BLOOD BLUCOSE     mg/dL")
                .attr("class", "legendeText")
                .attr("x", margin.left + 5)
                .attr("y", margin.top + 50)
                .style("font", "sans-serif")
                .attr("fill", "black")

                //Bereich von Analystische Darstellung
            this.analysis = comp.append("g")


            //svg graph für x und y achse
            //init x und y achse
            this.xAxis_graph = comp.append("g")
                .attr("class", "xline")
                .style("color", "white")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 25) + ")")
                .call(xAxis);



            this.yAxis_graph = comp.append("g")
                .attr("class", "yline")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 60) + ")")
                .call(yAxis);

            this.circs = comp.append('g');



            this.drawChart(this.props);


        }

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
                    .style("fill", "gray")
                    .style("opacity", (d, i) => opacityArr[i]),
                    (update) => update
                    .attr('x', d => d)
                    .attr('width', (d, i) => wdArr[i])
                    .style("opacity", (d, i) => opacityArr[i])
                )
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top + 60) + ')');
        }

        //circle_color 
        var circleColor = function(d) {
            return d.value >= 185 ? '#3498DB' : d.value >= 65 ? '#58D68D' : '#DC7633';
        }

        if (this.circs != null) {
            console.log(props.data.glucose)
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
            this.lengdeCircH.attr('cx', x.range()[1] - 20);
            this.lengdeCircN.attr('cx', x.range()[1] - 40);
            this.lengdeCircL.attr('cx', x.range()[1] - 60);
            this.legendeCircTextH.attr("x", x.range()[1]);
            this.legendeCircTextL.attr("x", x.range()[1]-105);
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