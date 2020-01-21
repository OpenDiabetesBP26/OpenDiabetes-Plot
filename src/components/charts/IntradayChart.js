import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
import BackGround from '../../services/BackGround.js';
import '../../style.scss';

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





            //svg graph für background
            this.background = comp.append("g")
            //add background für bar am top
            this.topbar = comp.append("rect")
                .attr("class", "topbar")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .attr("height", 25)
                .attr("width", this.props.x.range()[1])
            //Chart Legende
            this.legendeBackground = comp.append("rect")
                .attr("class", "legendeBackground")
                .attr("x", margin.left)
                .attr("y", margin.top + 26)
                .attr("height", 33)
                .attr("width", this.props.x.range()[1])
            //drei Kreise von Legende
            this.lengdeCircs =
                comp.append("circle")
                .attr("class", "legendeCircleH")
                .attr('cx', x.range()[1] - 20)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
            comp.append("circle")
                .attr("class", "legendeCircleN")
                .attr('cx', x.range()[1] - 40)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
            comp.append("circle")
                .attr("class", "legendeCircleL")
                .attr('cx', x.range()[1] - 60)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
            //Text von Legende
            this.legendeText =
                comp.append("text")
                .attr("class", "legendeCircText")
                .text("low high")
                .attr("x", x.range()[1] - 110)
                .attr("y", margin.top + 50)
            comp.append("text")
                .text("BLOOD BLUCOSE")
                .attr("class", "legendeText1")
                .attr("x", margin.left + 5)
                .attr("y", margin.top + 50)
            comp.append("text")
                .text("mg/dL")
                .attr("class", "legendeText2")
                .attr("x", margin.left + 140)
                .attr("y", margin.top + 50)

            this.dashLine =
                comp.append("line")
                .attr("class", "dashLineH_N")
                .attr("x1", margin.left + x.range()[0])
                .attr("y1", margin.top + 60 + y(185))
                .attr("x2", margin.left + x.range()[1])
                .attr("y2", margin.top + 60 + y(185))
            comp.append("line")
                .attr("class", "dashLineN_L")
                .attr("x1", margin.left + x.range()[0])
                .attr("y1", margin.top + 60 + y(65))
                .attr("x2", margin.left + x.range()[1])
                .attr("y2", margin.top + 60 + y(65))



            //Bereich von Analystische Darstellung
            this.analysis = comp.append("g")


            //svg graph für x und y achse
            //init x und y achse
            this.xAxis_graph = comp.append("g")
                .attr("class", "xline")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 25) + ")")
                .call(xAxis);



            this.yAxis_graph = comp.append("g")
                .attr("class", "yline")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 60) + ")")
                .call(yAxis);
            this.yAbdeckung = comp.append("line")
                .attr("class", "yAbdeckung")
                .attr("x1", margin.left)
                .attr("y1", margin.top + y(400))
                .attr("x2", margin.left)
                .attr("y2", margin.top + 60 + y(0))




            this.circs = comp.append('g');

            //tooltips background
            this.tooltipbg = comp.append('rect')
                .attr("class", "tooltipbg")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .attr('rx', "3px")
                .attr('ry', "3px")
                .attr("width", 440)
                .attr("height", 100)
                .style("opacity", 0);
            //tooltips Text
            this.tooltipText =
                comp.append('text')
                .attr("class", "tooltipTextT")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .style("opacity", 0)
            comp.append('text')
                .attr("class", "tooltipTextV")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .style("opacity", 0)
            comp.append('text')
                .attr("class", "tooltipTextS")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .style("opacity", 0)
            /*
                        this.rectH = comp.append('rect')
                        .attr('x', margin.left +100)
                        .attr('y',y(200))
                        .attr('width', "5px")
                        .attr('height', "20px")
                        .attr('rx', "5px")
                        .attr('ry', "5px")
            */




            this.drawChart(this.props);


        }

    }
    drawChart(props) {
        let y = props.y;
        let x = props.x;

        //wenn xAxis neue Scale bekommt, erneue Graph von xAxis und draw Background
        if (this.xAxis_graph) {
            //neue xAxis Daten von props
            let newxAxis = d3.axisTop(x)
            this.xAxis_graph.call(newxAxis)
            let bg = new BackGround();
            let readTicks = bg.readTicks(x);
            let opacityArr = bg.creatOpacity();
            let xPos = bg.creatXpos(x);
            let wdArr = bg.getWds();
            let ticksGroup = this.background.selectAll('rect').data(xPos).join(
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
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top + 60) + ')');
        }



        if (this.circs != null) {
            console.log("props.data.glucose", props.data.glucose)
            let circles = this.circs.selectAll('circle').data(props.data.glucose).join(
                    (enter) => enter.append('circle')
                    .attr('r', 3)
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                    .attr('fill', d => this.circleColor(d.value))
                    .on("mouseover", this.mouseover_tp)
                    .on("mouseout", this.mouseout_tp),
                    (update) => update
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                    .attr('fill', d => this.circleColor(d.value))
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
            d3.select(".dashLineN_L").attr("x2", this.props.margin.left + x.range()[1]);
        }
    }
    //circle_color 
    circleColor(d) {
        return d >= 185 ? '#3498DB' : d >= 65 ? '#58D68D' : '#DC7633';
    }

    mouseover_tp(d) {
        d3.select(this)
            .transition()
            .duration(300)
            .attr('r', 3 * 3)
        d3.select(".tooltipbg")
            .attr("x", d3.event.pageX + 30)
            .attr("y", d3.event.pageY - 105)
            .style("opacity", 0.6)
        d3.select(".tooltipTextT")
            .attr("x", d3.event.pageX + 40)
            .attr("y", d3.event.pageY - 80)
            .text("time: " + d.time)
            .style("opacity", 1)
        d3.select(".tooltipTextV")
            .attr("x", d3.event.pageX + 40)
            .attr("y", d3.event.pageY - 50)
            .text("value: " + d.value)
            .style("opacity", 1)
        d3.select(".tooltipTextS")
            .attr("x", d3.event.pageX + 40)
            .attr("y", d3.event.pageY - 20)
            .text("source: " + d.source)
            .style("opacity", 1)
    }



    mouseout_tp() {
        d3.select(this)
            .transition()
            .duration(300)
            .attr('r', 3)
        d3.select(".tooltipbg")
            .style("opacity", 0)
        d3.select(".tooltipTextS")
            .style("opacity", 0)
        d3.select(".tooltipTextT")
            .style("opacity", 0)
        d3.select(".tooltipTextV")
            .style("opacity", 0)
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