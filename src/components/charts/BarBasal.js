import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class BarBasal extends Component {

    static minChartValue = 1;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <g id='barBasal' ref={g => this.mainGroup = g}>
            </g>
        );
    }

    getMaxValue(data) {
        let max = Math.ceil(Math.max.apply(Math, data.map(function(o) { return o.value; })));
        max = max + max * 0.25;
        max = (max && max > BarBasal.minChartValue) ? max : BarBasal.minChartValue;
        return max;
    }

    getNewYAxis(max) {
        return d3.scaleLinear().domain([max, 0]).range([0, this.props.height]);
    }

    componentDidMount() {

        d3.select(this.mainGroup).attr('transform', 'translate(0, 580)').append('rect').attr('x', 0).attr('y', 0).attr('height', '50px').attr('width', this.props.x.range()[1]).attr('fill', '#fff');
        d3.select(this.mainGroup).append('text').attr('x', 10).attr('y', 30).text('BASAL');
        let max = this.getMaxValue(this.props.data);
        let y = this.getNewYAxis(max);  
        //d3.scaleLinear().domain([m.max, 0]).range([0, 200]);
        this.groupData = d3.select(this.mainGroup).append('g').attr('class', 'data').attr('transform', 'translate(0, 50)');
        
        this.groupAxis = d3.select(this.mainGroup).append('g').attr('class', 'axis').attr('transform', 'translate(0, 50)');
        this.groupAxis.call(d3.axisLeft(y));
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
        let max = this.getMaxValue(props.data);
        let y = this.getNewYAxis(max);  
        this.groupAxis.call(d3.axisLeft(y));

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
            tip.attr('style', 'opacity: 1; position: absolute; left: ' + (tpoint.y + window.pageYOffset) + 'px ; top: ' + tpoint.y + 'px ;')
                .html('' + timePrint(data.time) + '</br>' +
                    '<table>' +
                    '<tr> <td> Basal per hour:  </td><td>' + Math.round(data.value*100)/100 + ' mg/dl </td></tr>' +
                    '</table>'

                )
                .style('pointer-events', 'all');
        }
        const tip_hide = function () {
            tip.style('opacity', 0).style('pointer-events', 'none');
        }
        //Reset basal
        //this.groupDataPath.selectAll('path').remove();
        if (props.data.length > 0) {
            //this.rewriteY();
            //Basal to bar points
            let width = props.basalBarWidth;
            let height = max;
            let scale = props.height / height;
            
            //Basal hover rects
            this.groupData.selectAll('rect').data(props.data).join(
                (enter) => {
                    let group = enter.append('g').attr('class', 'bar-basal')
                    group.append('rect')
                    .attr('x', d => props.x(d.time))
                    .attr('width', width / 2)
                    .attr('y', d => scale * (height - (d.value > height ? height : d.value)))
                    .attr('height',  d=> scale * ((d.value > height) ? height :  (d.value < 0 ? 0 : d.value)))                    
                    .on('mouseover', tip_show)
                    //.attr('height', d=> scale * height)    
                    .on('mouseover', tip_show)
                    .on('mouseout', tip_hide);
                }
                ,(update) => {
                    // update
                    update
                    .attr('x', d => props.x(d.time))
                    .attr('width', width / 2)
                    .attr('y', d => scale * (height - (d.value > height ? height : d.value)))
                    .attr('height',  d=> scale * ((d.value > height) ? height :  (d.value < 0 ? 0 : d.value)))         
                }
            )
        }
    }

    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(BarBasal) : BarBasal;