import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
import { matcher } from 'd3';

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
        d3.select(this.mainGroup).attr('transform', 'translate(0, 830)').append('rect').attr('x', 0).attr('y', 0).attr('height', '50px').attr('width', this.props.x.range()[1]).attr('fill', '#fff');
        d3.select(this.mainGroup).append('text').attr('x', 10).attr('y', 30).text('Bolus Carbs');
        //let dataDomain = d3.extent(this.props.data.carbs);
        this.max = 500;// this.props.data.carbs.map(o=>o.value).concat(this.props.data.bolus.map(o=>o.value)).reduce((a,b)=> Math.max(a,b));

        this.y = d3.scaleLinear().domain([0, 500]).range([300, 0]);

        this.groupBolus = d3.select(this.mainGroup).append('g').attr('class', 'bolus');
        this.groupCarbs = d3.select(this.mainGroup).append('g').attr('class', 'carbs');

        this.groupDataBolus = this.groupBolus.append('g').attr('class', 'data').attr('transform', 'translate(0, 50)');
        this.groupDataCarbs = this.groupCarbs.append('g').attr('class', 'data').attr('transform', 'translate(0, 50)');
        this.groupAxis = d3.select(this.mainGroup).append('g').attr('class', 'axis').attr('transform', 'translate(0, 50)');

        this.groupAxis.call(d3.axisLeft(this.y));
        this.tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0)
        this.svg = this.mainGroup.ownerSVGElement;
        this.drawChart(this.props);

    }
    componentWillUnmount() {
        this.tooltip.remove();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }
    drawChart(props) {
        if (!this.groupDataBolus || !this.groupDataCarbs) return;
        //update y axis
        d3.select(this.mainGroup).select('rect').attr('width', props.x.range()[1]);
        let maxCarbs = d3.extent(props.data.carbs, d => d.value);
        let currentMax = maxCarbs[1] > 20 ? maxCarbs[1] : 20;
        this.y.domain([0, currentMax]);
        this.groupAxis.call(d3.axisLeft(this.y));

        let width = 15;
        let height = this.max;
        //let svg = this.svg;
        if (props.x.range()[1] < 800) width = 10;
        let svg = this.svg;
        let tip = this.tooltip;
        const tip_show = function () {
            let args = Array.prototype.slice.call(arguments);
            let data = args[0];
            let target = args[2][args[1]];
            d3.select(target).attr('r', 6);
            //TEST
            const offset = 10;
            let point = svg.createSVGPoint();
            let bbox = target.getBBox();
            point.x = bbox.x + bbox.width + offset;
            point.y = bbox.y;
            let tpoint = point.matrixTransform(target.getScreenCTM())
            let timePrint = d3.timeFormat("%Y %B %d. %I:%M %p");
            tip.attr('style', 'opacity: 1; position: absolute; left: ' + tpoint.x + 'px ; top: ' + (tpoint.y + window.pageYOffset) + 'px ;')
                .html('' + timePrint(data.time) + '</br>' +
                    '<table>' +
                    '<tr> <td> Value </td><td>' + data.value + '</td></tr>' +
                    // '<tr> <td> Origin </td><td>' + data.origin + '</td></tr>' +
                    // '<tr> <td> Source </td><td>' + data.source + '</td></tr>' +
                    '</table>'

                )
                .style('pointer-events', 'all');
        }
        const tip_hide = function () {
            let args = Array.prototype.slice.call(arguments);
            let target = args[2][args[1]];
            tip.style('opacity', 0).style('pointer-events', 'none');
            d3.select(target).attr('r', 3);
        }

        this.groupDataBolus.selectAll('rect').data(props.data.bolus).join(
            (enter) => {
                enter.append('rect')
                    .attr('class', 'bar-bolus')
                    .attr('x', d => props.x(d.time))
                    .attr('width', width / 2)
                    .attr('y', d => this.y(d.value))
                    .attr('height', d => this.y(0) - this.y(d.value) > 0 ? this.y(0) - this.y(d.value) : 0)
                    .on('mouseover', tip_show)
                    .on('mouseout', tip_hide);

            },
            (update) => {
                update.attr('x', d => props.x(d.time))
                    .attr('width', width / 2)
                    .attr('y', d => this.y(d.value))
                    .attr('height', d => this.y(0) - this.y(d.value) > 0 ? this.y(0) - this.y(d.value) : 0)
            }
        );

        this.groupDataCarbs.selectAll('rect').data(props.data.carbs).join(
            (enter) => {
                enter.append('rect')
                     .attr('class', 'bar-carbs')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width / 2)
                    .attr('y', d => this.y(d.value))
                    .attr('height', d => this.y(0) - this.y(d.value) > 0 ? this.y(0) - this.y(d.value) : 0)
                    .on('mouseover', tip_show)
                    .on('mouseout', tip_hide);

            },
            (update) => {
                update
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width / 2)
                    .attr('y', d => this.y(d.value))
                    .attr('height', d => this.y(0) - this.y(d.value) > 0 ? this.y(0) - this.y(d.value) : 0)
            }
        )
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(BarBolusCarbs) : BarBolusCarbs;