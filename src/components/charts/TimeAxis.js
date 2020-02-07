import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class TimeAxis extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <g id='timeAxis'>
                <g className='background' ref={g => this.background = g} />
                <g className='upperTimeAxis' ref={g => this.upperTime = g} />
                <g className='lowerTimeAxis' ref={g => this.lowerTime = g} />

            </g>
        );
    }

    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (!this.upperTime || !this.lowerTime || !nextProps.x || !this.background) return;
        const stickFirstTick = (caller) => {
            let firstYear = caller.select('g.tick');
            if (firstYear.node()) {
                let string = firstYear.attr('transform');
                if (!string) return;
                let translate = string.substring(string.indexOf("(") + 1, string.indexOf(")")).split(",");
                console.log(translate[0])
                if (translate[0] < 0) {
                    firstYear.attr('transform', 'translate(0,0)');
                }
            }
        }
        let upper = d3.select(this.upperTime);
        let lower = d3.select(this.lowerTime);
        let background = d3.select(this.background);
        upper.selectAll().remove();
        lower.selectAll().remove();
        let upperAxis = d3.axisTop(nextProps.x);
        let lowerAxis = d3.axisTop(nextProps.x);
        const domain = nextProps.x.domain();
        const hours = Math.floor((domain[1] - domain[0]) / (60000 * 60));

        let upperOffset, lowerOffset, upperTicks, lowerTicks, upperTickFormat, lowerTickFormat;
        if (hours > 24 * 30 * 12) {
            console.log('State 1')
            //Create dummy with extra tick last month
            upperOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -9);
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -3);
            upperTicks = d3.timeYear;
            lowerTicks = d3.timeMonth.every(3);
            upperTickFormat = d3.timeFormat("%Y");
            lowerTickFormat = nextProps.x.range()[1] > 1000 ? d3.timeFormat("%B") : d3.timeFormat("%b");
        }
        else if (hours > 24 * 7 * 4 * 3) {
            upperOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -11);
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -3);
            upperTicks = d3.timeYear;
            lowerTicks = d3.timeMonth;
            upperTickFormat = d3.timeFormat("%Y");
            lowerTickFormat = nextProps.x.range()[1] > 1000 ? d3.timeFormat("%B") : d3.timeFormat("%b");


        }
        else if (hours > 24 * 7 * 3) {
            upperOffset = nextProps.x.range()[1] > 1000 ? d3.timeMonth.offset(nextProps.x.domain()[0], -11) : d3.timeWeek.offset(nextProps.x.domain()[0], -2);
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -1);
            upperTicks = nextProps.x.range()[1] > 1000 ? d3.timeYear : d3.timeWeek.every(4);
            lowerTicks = d3.timeWeek;
            upperTickFormat = nextProps.x.range()[1] > 1000 ? d3.timeFormat("%Y") : d3.timeFormat("%Y %B");
            lowerTickFormat = nextProps.x.range()[1] > 1000 ? d3.timeFormat("%b %d") : d3.timeFormat("%d");

        }
        else if (hours > 24 * 7) {
            upperOffset = d3.timeDay.offset(nextProps.x.domain()[0], -25);
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeMonth;
            lowerTicks = d3.timeDay;
            upperTickFormat = d3.timeFormat("%Y %B");
            lowerTickFormat = d3.timeFormat("%d");

        }
        else if (hours > 24 * 3) {
            upperOffset = d3.timeDay.offset(nextProps.x.domain()[0], -4);
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeWeek;
            lowerTicks = d3.timeDay;
            upperTickFormat = d3.timeFormat("%Y %B Week %W");
            lowerTickFormat = d3.timeFormat("%d");

        } else if (hours > 24) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -6)
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeHour.every(6);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I %p");

        } else if (hours > 12) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -16)
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeHour.every(3);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I %p");

        } else if (hours > 6) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -20)
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeHour;
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I %p");

        } else if (hours > 2) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -20)
            lowerOffset = d3.timeHour.offset(nextProps.x.domain()[0], -1)
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeMinute.every(30);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I:%M %p");

        } else {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -20)
            lowerOffset = d3.timeHour.offset(nextProps.x.domain()[0], -1)
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeMinute.every(15);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I:%M %p");

        }

        let dummyScaleUpper = d3.axisTop(d3.scaleTime().domain([upperOffset, nextProps.x.domain()[1]]).range(nextProps.x.range()));
        let dummyScaleLower = d3.axisTop(d3.scaleTime().domain([lowerOffset, nextProps.x.domain()[1]]).range(nextProps.x.range()));
        lowerAxis.tickValues((dummyScaleLower.scale().ticks(lowerTicks)));
        upperAxis.tickValues((dummyScaleUpper.scale().ticks(upperTicks)));
        lowerAxis.tickFormat(lowerTickFormat);
        upperAxis.tickFormat(upperTickFormat);
        let bgTicks = dummyScaleLower.scale().ticks(lowerTicks);

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
        upper.call(stickFirstTick)
        lower.attr('transform', 'translate(0,75)');
        lower.select('path').remove();
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(TimeAxis) : TimeAxis;