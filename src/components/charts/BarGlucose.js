import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class BarGlucose extends Component {
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
        d3.select(this.mainGroup).attr('transform', 'translate(0, 130)').append('rect').attr('x', 0).attr('y', 0).attr('height', '50px').attr('width', this.props.x.range()[1]).attr('fill', '#fff');
        d3.select(this.mainGroup).append('text').attr('x', 10).attr('y', 30).text('BLOOD GLUCOSE');
        this.y = d3.scaleLinear().domain([400, 0]).range([0, 400]);
        this.groupData = d3.select(this.mainGroup).append('g').attr('class', 'data').attr('transform', 'translate(0, 50)');
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
    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }
    drawChart(props){
        if (!this.groupData) return;
        let high = 180;
        let low = 80;
        //Add clip paths
        d3.select(this.mainGroup).select('rect').attr('width', this.props.x.range()[1]);
        this.groupData.selectAll('clipPath').remove();
        this.groupData.append('clipPath')
            .attr("id", "clipHigh")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y.range()[0])
            .attr('width', props.x(props.x.domain()[1]) - props.x(props.x.domain()[0]))
            .attr('height', this.y(high) - this.y.range()[0]);

        this.groupData.append('clipPath')
            .attr("id", "clipNormal")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y(high))
            .attr('width', props.x(props.x.domain()[1]) - props.x(props.x.domain()[0]))
            .attr('height', this.y(low) - this.y(high));

        this.groupData.append('clipPath')
            .attr("id", "clipLow")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y(low))
            .attr('width', props.x(props.x.domain()[1]) - props.x(props.x.domain()[0]))
            .attr('height', this.y(0) - this.y(high));

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
            //TEST
            const offset = 10;
            let point = svg.createSVGPoint();
            let bbox = target.getBBox();
            point.x = bbox.x + bbox.width + offset;
            point.y = bbox.y;
            let tpoint = point.matrixTransform(target.getScreenCTM())
            let timePrint = d3.timeFormat("%Y %B %d %I %p");
            tip.attr('style', 'opacity: 1; position: absolute; left: ' + tpoint.x + 'px ; top: ' + tpoint.y + 'px ;')
                .html('' + timePrint(data.time) + ' - ' + timePrint(data.timeEnd) + '</br>' +
                    '<table>' +
                    '<tr> <td> 90th percentile: </td><td>' + data.percentile[4] + ' mg/dl </td></tr>' +
                    '<tr> <td> 75th percentile: </td><td>' + data.percentile[3] + ' mg/dl </td></tr>' +
                    '<tr> <td> median: </td><td>' + data.percentile[2] + ' mg/dl </td></tr>' +
                    '<tr> <td> 25th percentile: </td><td>' + data.percentile[1] + ' mg/dl </td></tr>' +
                    '<tr> <td> 10th percentile: </td><td>' + data.percentile[0] + ' mg/dl </td></tr>' +
                    '</table>'

                )
                .style('pointer-events', 'all');
        }
        const tip_hide = function () {
            tip.style('opacity', 0).style('pointer-events', 'none');
        }
        this.groupData.selectAll('g').data(props.data).join(
            (enter) => {
                let group = enter.append('g').attr('class', 'glucose-percentile')
                //OUTER PERCENTILE
                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                    .attr('class', 'nhigh')
                    .attr("clip-path", "url(#clipHigh)")

                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                    .attr('class', 'nnormal')
                    .attr("clip-path", "url(#clipNormal)")

                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                    .attr('class', 'nlow')
                    .attr("clip-path", "url(#clipLow)")

                //INNTER PERCENTIL
                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                    .attr('class', 'high')
                    .attr("clip-path", "url(#clipHigh)");

                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                    .attr('class', 'normal')
                    .attr("clip-path", "url(#clipNormal)");

                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                    .attr('class', 'low')
                    .attr("clip-path", "url(#clipLow)");
                //Median Circle
                group.append('rect')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[2]) - 3)
                    .attr('height', 6)
                    .attr('class', 'median')
                    .attr("clip-path", "url(#clipAll)");
                group.on('mouseover', tip_show);
                group.on('mouseout', tip_hide)
                return enter;

            },
            (update) => {
                //OUTER PERCENTILE
                update.select('rect.nhigh').attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                update.select('rect.nnormal').attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                update.select('rect.nlow').attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2)
                //INNER PERCENTILE
                update.select('rect.high').attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2);
                update.select('rect.normal').attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2);
                update.select('rect.low').attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width / 2)
                    .attr('ry', width / 2);
                update.select('rect.median')
                    .attr('x', d => props.x(d.time) - width / 2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[2]) - 3)
                    .attr('height', 6)
            }
        )
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(BarGlucose) : BarGlucose;