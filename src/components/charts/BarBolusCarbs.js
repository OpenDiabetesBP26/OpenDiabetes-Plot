import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class BarBolusCarbs extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <g id='barBolusCarbs' ref={g => this.mainGroup = g}>
            </g>
        );
    }

    componentDidMount() {
        d3.select(this.mainGroup).attr('transform', 'translate(0, 650)').append('rect').attr('x', 0).attr('y', 0).attr('height', '50px').attr('width', this.props.x.range()[1]).attr('fill', '#fff');
        d3.select(this.mainGroup).append('text').attr('x', 10).attr('y', 30).text('Bolus Carbs');
        this.y = d3.scaleLinear().domain([500, 0]).range([0, 500]);

        this.groupBolus = d3.select(this.mainGroup).append('g').attr('class', 'bolus');
        this.groupCarbs = d3.select(this.mainGroup).append('g').attr('class', 'carbs');

        this.groupDataBolus = this.groupBolus.append('g').attr('class', 'data').attr('transform', 'translate(0, 50)');
        this.groupDataCarbs = this.groupCarbs.append('g').attr('class', 'data').attr('transform', 'translate(0, 50)');
        this.groupAxis = d3.select(this.mainGroup).append('g').attr('class', 'axis').attr('transform', 'translate(0, 50)');
        
        this.groupAxis.call(d3.axisLeft(this.y));
        this.tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0)
        this.svg = this.mainGroup.ownerSVGElement;
        console.log(this.svg)
        this.drawChart(this.props);

    }
    componentWillUnmount(){
        this.tooltip.remove();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }
    drawChart(props){
        if (!this.groupDataBolus || !this.groupDataCarbs) return;

        let width = 20;
        let height = 500;
        //let svg = this.svg;
        if (props.x.range()[1] < 800) width = 10;

        this.groupDataBolus.selectAll('g').data(props.data.bolus).join(
            (enter) => {
                let group = enter.append('g').attr('class', 'bar-bolus')
                //OUTER PERCENTILE
                group.append('rect')
                    .attr('x', d => props.x(d.time))
                    .attr('width', width / 2)
                    .attr('y', d => height - (d.value > height ? height : d.value))
                    .attr('height', d=> d.value > height ? height : d.value);
                return enter;

            },
            (update) => {
                update.select('rect').attr('x', d => props.x(d.time))
                .attr('width', width / 2)
                .attr('y', d=> height - (d.value > height ? height : d.value))
                .attr('height', d=> d.value > height ? height : d.value);
            }
        );
        
        this.groupDataCarbs.selectAll('g').data(props.data.carbs).join(
            (enter) => {
                let group = enter.append('g').attr('class', 'bar-carbs')
                //OUTER PERCENTILE
                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width / 2)
                    .attr('y', d=> height - (d.value > height ? height : d.value))
                    .attr('height', d=> (d.value > height ? height : d.value));
                return enter;

            },
            (update) => {
                update.select('rect').attr('x', d => props.x(d.time) - width / 2)
                .attr('width', width / 2)
                .attr('y', d=> height - (d.value > height ? height : d.value))
                .attr('height', d=> d.value > height ? height : d.value);
            }
        )
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(BarBolusCarbs) : BarBolusCarbs;