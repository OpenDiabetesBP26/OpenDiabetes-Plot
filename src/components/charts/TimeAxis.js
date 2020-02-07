import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class TimeAxis extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <g>
                <g id='upperTimeAxis' ref={g => this.upperTime = g} />
                <g id='lowerTimeAxis' ref={g => this.lowerTime = g} />
                <g id='background' ref={g => this.background = g} />
            </g>
        );
    }

    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (!this.upperTime || !this.lowerTime || !nextProps.x || !this.background) return;
        let upper = d3.select('g#upperTimeAxis');
        let lower = d3.select('g#lowerTimeAxis');
        let background = d3.select('g#background');
        upper.selectAll().remove();
        lower.selectAll().remove();
        let upperAxis = d3.axisTop(nextProps.x);
        let lowerAxis = d3.axisTop(nextProps.x);
        const domain = nextProps.x.domain();
        const hours = Math.floor((domain[1] - domain[0]) / (60000 * 60));
        if (hours > 24 * 30 * 12) {
            //Create dummy with extra tick last month
            let dummyScale = d3.axisTop(d3.scaleTime().domain([d3.timeMonth.offset(nextProps.x.domain()[0], -3), nextProps.x.domain()[1]]).range(nextProps.x.range())).ticks(d3.timeMonth.every(3));
            console.log(dummyScale.scale().ticks());
            lowerAxis.tickValues((dummyScale.scale().ticks()));
            lowerAxis.tickFormat(d3.timeFormat("%B"));
            upperAxis.ticks(d3.timeYear);
            upperAxis.tickSize(20);
            lowerAxis.tickSize(15);
            upper.call(upperAxis);
            upper.selectAll('path').remove();
            upper.attr('transform', 'translate(0,60)');

            lower.call(lowerAxis);
            lower.selectAll('text')
                .attr("y", -3)
                .attr("x", 8)
                .style("text-anchor", "start");

            upper.selectAll('text')
                .attr("y", -9)
                .attr("x", 8)
                .style("text-anchor", "start");
            lower.attr('transform', 'translate(0,75)');
        }
        else if (hours > 24 * 7 * 4 * 3) {
            //Create dummy with extra tick last month
            let dummyScale = d3.axisTop(d3.scaleTime().domain([d3.timeMonth.offset(nextProps.x.domain()[0], -3), nextProps.x.domain()[1]]).range(nextProps.x.range()));
            lowerAxis.tickValues((dummyScale.scale().ticks(d3.timeMonth)));
            lowerAxis.tickFormat(d3.timeFormat("%B"));

            let dummyScaleUpper = d3.axisTop(d3.scaleTime().domain([d3.timeMonth.offset(nextProps.x.domain()[0], -11), nextProps.x.domain()[1]]).range(nextProps.x.range()));
            upperAxis.tickValues((dummyScaleUpper.scale().ticks(d3.timeYear)));
            upperAxis.tickSize(20);
            lowerAxis.tickSize(15);
            upper.call(upperAxis);
            upper.selectAll('path').remove();
            upper.attr('transform', 'translate(0,60)');

            lower.call(lowerAxis);
            lower.selectAll('text')
                .attr("y", -3)
                .attr("x", 8)
                .style("text-anchor", "start");

            upper.selectAll('text')
                .attr("y", -9)
                .attr("x", 8)
                .style("text-anchor", "start");

            let firstYear = upper.select('g.tick');
            if (firstYear.node()) {
                if (firstYear.node().getBoundingClientRect().x < 0) {
                    console.log(firstYear.node().getBoundingClientRect().x)
                    firstYear.attr('transform', 'translate(0,0)');
                    console.log(firstYear.node().getBoundingClientRect().x)
                }
            }
            lower.attr('transform', 'translate(0,75)');

            let bgTicks = dummyScale.scale().ticks(d3.timeMonth);
            let background = d3.select('g#background')
            background.selectAll('rect').data(bgTicks).join(
                (enter) => {
                    enter.append('rect')
                        .attr('x', d => nextProps.x(d))
                        .attr('y', 0)
                        .attr('width', '10px')
                        .attr('height', '100px')
                        .attr('fill', 'lightgray')
                        .attr('style', d => {
                            console.log((d.getMonth() > 6 ? 1 - (6 - d.getMonth()) / 6.0 : d.getMonth() / 6.0))
                            return 'opacity: ' + (d.getMonth() > 6 ? 1 - (6 - d.getMonth()) / 6.0 : d.getMonth() / 6.0)
                        })
                },
                (update) => {
                    update
                        .attr('x', d => nextProps.x(d))
                        .attr('y', 0)
                        .attr('style', d => {
                            let a = d.getMonth() / 6.0;
                            a = a > 1 ? 2 - a : a;
                            console.log(a);
                            return 'opacity: ' + a;
                        })
                }

            )
        }
        else if (hours > 24 * 7 * 3) {
        }
        else if (hours > 24 * 7) {
        }
        else if (hours > 24 * 3) {
        }



    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(TimeAxis) : TimeAxis;