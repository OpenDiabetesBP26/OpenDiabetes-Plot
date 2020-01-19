import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
class ThreeHourlyChart extends Component {
    constructor(props) {
        super(props);
        this.state = { data: props.data, svg: props.svg, x: props.x }
    }
    render() {
        return (
            <g id='threehourly' ref={g => this.g = g}></g>
        );
    }
    drawChart(props) {
        /** Hier werden die Objekte von d3 eingefügt, die geupdatet werden
         *  Glukosedaten können z.B mit props.data.glucose geholt werden
         */
        let y = props.y;
        let x = props.x;
        if (this.circs != null) {
            var circles = this.circs.selectAll('circle').data(props.data.glucose).join(
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
    componentDidMount() {
        /**
         * Hier können einmalige Objekte eingeügt und erstellt werden
         */
        console.log('Threehour mount');
        let xAxis = d3.axisBottom(this.props.x);
        let yAxis = d3.axisLeft(this.props.y);
        let y = this.props.y;
        let margin = this.props.margin;
        let width = 1000;

        let comp = d3.select("g#threehourly");
        console.log(comp);
        this.gcHigh = comp.append("rect")
            .attr("class", "gcHigh")
            .attr("y", y(400) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(185) - y(400))
            .attr("width", width)
            .attr("fill", "#f5f0b8")
        this.gcNormal = comp.append("rect")
            .attr("class", "gcNormal")
            .attr("y", y(180) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(70) - y(180))
            .attr("width", width)
            .attr("fill", "#e0e0e0")
        this.gcLow = comp.append("rect")
            .attr("class", "gcLow")
            .attr("y", y(65) + margin.top)
            .attr("x", margin.left)
            .attr("height", y(0) - y(65))
            .attr("width", width)
            .attr("fill", "#faafaa")

        this.circs = comp.append('g');
        this.drawChart(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(ThreeHourlyChart) : ThreeHourlyChart;