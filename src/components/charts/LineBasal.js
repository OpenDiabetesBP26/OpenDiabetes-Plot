import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class LineBasal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <g id='barGlucose' ref={g => this.mainGroup = g}>
            </g>
        );
    }

    componentDidMount() {
        d3.select(this.mainGroup).attr('transform', 'translate(0, 580)').append('rect').attr('x', 0).attr('y', 0).attr('height', '50px').attr('width', this.props.x.range()[1]).attr('fill', '#fff');
        d3.select(this.mainGroup).append('text').attr('x', 10).attr('y', 30).text('BASAL');
        this.y = d3.scaleLinear().domain([5, 0]).range([0, 200]);
        this.groupData = d3.select(this.mainGroup).append('g').attr('class', 'data').attr('transform', 'translate(0, 50)');
        this.groupDataPath = this.groupData.append('g');
        this.groupDataRect = this.groupData.append('g');
        this.groupAxis = d3.select(this.mainGroup).append('g').attr('class', 'axis').attr('transform', 'translate(0, 50)');
        this.groupAxis.call(d3.axisLeft(this.y));
        this.tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0)
        this.svg = this.mainGroup.ownerSVGElement;
        this.drawChart(this.props);

    }
    componentWillUnmount() {
        this.tooltip.remove();
    }
    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }
    drawChart(props) {
        if (!this.groupData) return;
        console.log(props.data);
        let high = 180;
        let low = 80;
        //Add clip paths
        d3.select(this.mainGroup).select('rect').attr('width', this.props.x.range()[1]);
        this.groupData.selectAll('clipPath').remove();

        this.groupData.append('clipPath')
            .attr("id", "clipAll")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y.range()[0])
            .attr('width', props.x(props.x.domain()[1]) - props.x(props.x.domain()[0]))
            .attr('height', this.y.range()[1]);

        let width = 16;
        let svg = this.svg;
        let tip = this.tooltip;
        if (props.x.range()[1] < 800) width = 10;
        const tip_show = function () {
            let args = Array.prototype.slice.call(arguments);
            let data = args[0];
            let target = args[2][args[1]];
            console.log(args)
            console.log(data)
            //TEST
            const offset = 10;
            let point = svg.createSVGPoint();
            let bbox = target.getBBox();
            point.x = bbox.x + bbox.width + offset;
            point.y = bbox.y;
            let tpoint = point.matrixTransform(target.getScreenCTM())
            let timePrint = d3.timeFormat("%Y %B %d - %I:%M %p");
            tip.attr('style', 'opacity: 1; position: absolute; left: ' + tpoint.x + 'px ; top: ' + tpoint.y + 'px ;')
                .html('' + timePrint(data.time) + ' - ' + timePrint(data.timeEnd) + '</br>' +
                    '<table>' +
                    '<tr> <td> Basal per hour:  </td><td>' + data.value + ' mg/dl </td></tr>' +
                    '</table>'

                )
                .style('pointer-events', 'all');
        }
        const tip_hide = function () {
            tip.style('opacity', 0).style('pointer-events', 'none');
        }
        //Reset basal
        this.groupDataPath.selectAll('path').remove();
        if (props.data.length != 0) {
            //Basal to line points
            let x = props.x;
            let yb = this.y;
            const linegen = (data) => {
                let points = []
                points.push({ x: 0, y: yb(data[0].lastValue) });
                let lastEnd = undefined;
                for (let i = 0; i < data.length; i++) {
                    if (lastEnd && lastEnd.getTime() < data[i].time.getTime()) {
                        points.push({ x: x(lastEnd), y: yb(0) })
                        points.push({ x: x(data[i].time), y: yb(0) })
                    }
                    points.push({ x: x(data[i].time), y: yb(data[i].lastValue) })
                    points.push({ x: x(data[i].time), y: yb(data[i].value) })
                    points.push({ x: x.range()[1] > x(data[i].timeEnd) ? x(data[i].timeEnd) : x.range()[1], y: yb(data[i].value) })
                    lastEnd = data[i].timeEnd;
                }
                if (x(lastEnd) < x.range()[1]) {
                    points.push({ x: x(lastEnd), y: yb(0) })
                    points.push({ x: x.range()[1], y: yb(0) })
                }
                return points;
            }
            let basal_temp_points = linegen(props.data);

            let lines = d3.line().x(d => d.x).y(d => d.y);
            let area = d3.area().x(d => d.x).y0(yb(0)).y1(d => d.y);
            this.groupDataPath.append("path").attr("d", area(basal_temp_points)).attr("stroke", "lightblue").attr("style", "fill: lightblue; opacity:0.5").attr("stroke-width", 2).attr("fill", "none")
            if (props.dataProfile.length != 0) {
                let basal_profile_points = linegen(props.dataProfile);
                this.groupDataPath.append("path").attr("d", lines(basal_profile_points)).attr("stroke", "blue").attr("stroke-width", 2).attr("stroke-dasharray", "3,3,3").attr("fill", "none")
            }
            this.groupDataPath.append("path").attr("d", lines(basal_temp_points)).attr("stroke", "blue").attr("stroke-width", 2).attr("fill", "none")

            //Basal hover rects
            this.groupDataRect.selectAll('rect').data(props.data).join(
                (enter) => {
                    enter.append('rect')
                        .attr('x', d => props.x(d.time))
                        .attr('width', d => props.x(d.timeEnd) - props.x(d.time))
                        .attr('y', d => this.y(d.value))
                        .attr('height', d => this.y(0) - this.y(d.value))
                        .on('mouseover', tip_show)
                        .on('mouseout', tip_hide)
                        .attr('style', 'opacity: 0')
                },
                (update) => {
                    update
                        .attr('x', d => props.x(d.time))
                        .attr('width', d => props.x(d.timeEnd) - props.x(d.time))
                        .attr('y', d => this.y(d.value))
                        .attr('height', d => this.y(0) - this.y(d.value))
                }
            )

        }
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(LineBasal) : LineBasal;