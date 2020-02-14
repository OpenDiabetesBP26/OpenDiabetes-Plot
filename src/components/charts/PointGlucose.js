import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class PointGlucose extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <g id='pointGlucose' ref={g => this.mainGroup = g}>
            </g>
        );
    }

    componentDidMount() {
        d3.select(this.mainGroup).attr('transform', 'translate(0, 130)').append('rect').attr('x', 0).attr('y', 0).attr('height', '50px').attr('width', this.props.x.range()[1]).attr('fill', '#fff');
        d3.select(this.mainGroup).append('text').attr('x', 10).attr('y', 30).text('BLOOD GLUCOSE');
        this.y = d3.scaleLinear().domain([400, 0]).range([0, 400]);
        this.groupData = d3.select(this.mainGroup).append('g').attr('class', 'point-glucose').attr('transform', 'translate(0, 50)');
        this.groupAxis = d3.select(this.mainGroup).append('g').attr('class', 'axis').attr('transform', 'translate(0, 50)');
        this.groupAxis.call(d3.axisLeft(this.y));
        this.tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0)
        this.svg = this.mainGroup.ownerSVGElement;
        this.drawChart(this.props);
    }
    componentWillUnmount(){
        this.tooltip.remove();
    }
    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps)
    }
    drawChart(props){
        d3.select(this.mainGroup).attr('transform', 'translate(0, 130)').append('rect').attr('x', 0).attr('y', 0).attr('height', '50px').attr('width', this.props.x.range()[1]).attr('fill', '#fff');
        if (!this.groupData) return;
        this.groupData.selectAll('clipPath').remove();
        this.groupData.append('clipPath')
            .attr("id", "clipAll")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y.range()[0])
            .attr('width', props.x(props.x.domain()[1]) - props.x(props.x.domain()[0]))
            .attr('height', this.y.range()[1]);

            let high = 180;
        let low = 80;
        let width = 16;
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
            tip.attr('style', 'opacity: 1; position: absolute; left: ' + tpoint.x + 'px ; top: ' + tpoint.y + 'px ;')
                .html('' + timePrint(data.time) + '</br>' +
                    '<table>' +
                    '<tr> <td> Value </td><td>' + data.value + ' mg/dl </td></tr>' +
                    '<tr> <td> Origin </td><td>' + data.origin + '</td></tr>' +
                    '<tr> <td> Source </td><td>' + data.source + '</td></tr>' +
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
        const getBGCategory = (value) => {
            if(value > high) return 'high';
            if(value < low) return 'low';
            return 'normal';
        }
        this.groupData.selectAll('circle').data(props.data).join(
            (enter) => {
                enter.append('circle')
                    .attr('r', 3)
                    .attr('cy', d => this.y(d.value))
                    .attr('cx', d => props.x(d.time))
                    .attr('class', d => getBGCategory(d.value))
                    .on('mouseover', tip_show)
                    .on('mouseout', tip_hide)
            },
            (update) => {
                update
                    .attr('cy', d => this.y(d.value))
                    .attr('cx', d => props.x(d.time))
                    .attr('class', d => getBGCategory(d.value))
            }
        )
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(PointGlucose) : PointGlucose;