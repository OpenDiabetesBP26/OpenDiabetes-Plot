import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';

class TimeAxis extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <g id='timeAxis' ref={g => this.timeAxis = g}>
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
        let timeAxis = d3.select(this.timeAxis);
        //Add clip path
        timeAxis.selectAll('clipPath').remove();
        timeAxis.append('clipPath')
            .attr("id", "clipTimeAxis")
            .append('rect')
            .attr('x', nextProps.x(nextProps.x.domain()[0]))
            .attr('y', 0)
            .attr('width', nextProps.x(nextProps.x.domain()[1]) - nextProps.x(nextProps.x.domain()[0]))
            .attr('height', '100%')
        let upper = d3.select(this.upperTime);
        timeAxis.attr("clip-path", "url(#clipTimeAxis)")
        let lower = d3.select(this.lowerTime);
        let background = d3.select(this.background);
        upper.selectAll().remove();
        lower.selectAll().remove();
        let upperAxis = d3.axisTop(nextProps.x);
        let lowerAxis = d3.axisTop(nextProps.x);
        const domain = nextProps.x.domain();
        const hours = Math.floor((domain[1] - domain[0]) / (60000 * 60));
        let alphaFunc = d => 1;

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
            alphaFunc = d => {
                let month = d.getMonth() / 3;
                if (month >= 2) month = 4 - month;
                month = month / 2;
                return month;
            };
        }
        else if (hours > 24 * 7 * 4 * 3) {
            upperOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -11);
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -3);
            upperTicks = d3.timeYear;
            lowerTicks = d3.timeMonth;
            upperTickFormat = d3.timeFormat("%Y");
            lowerTickFormat = nextProps.x.range()[1] > 1000 ? d3.timeFormat("%B") : d3.timeFormat("%b");
            alphaFunc = d => {
                let month = d.getMonth();
                if (month >= 6) month = 12 - month;
                return month / 6;
            };

        }
        else if (hours > 24 * 7 * 3) {
            upperOffset = nextProps.x.range()[1] > 1000 ? d3.timeMonth.offset(nextProps.x.domain()[0], -11) : d3.timeWeek.offset(nextProps.x.domain()[0], -2);
            lowerOffset = d3.timeMonth.offset(nextProps.x.domain()[0], -1);
            upperTicks = nextProps.x.range()[1] > 1000 ? d3.timeYear : d3.timeWeek.every(4);
            lowerTicks = d3.timeWeek;
            upperTickFormat = nextProps.x.range()[1] > 1000 ? d3.timeFormat("%Y") : d3.timeFormat("%Y %B");
            lowerTickFormat = nextProps.x.range()[1] > 1000 ? d3.timeFormat("%b %d") : d3.timeFormat("%d");
            alphaFunc = d => {
                let format = d3.timeFormat("%U");
                let week = format(d) % 10;
                if (week >= 5) week = 10 - week;
                return week / 10;
            };

        }
        else if (hours > 24 * 7) {
            upperOffset = d3.timeDay.offset(nextProps.x.domain()[0], -25);
            lowerOffset = d3.timeDay.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeMonth;
            lowerTicks = d3.timeDay;
            upperTickFormat = d3.timeFormat("%Y %B");
            lowerTickFormat = d3.timeFormat("%d");

            alphaFunc = d => {
                let day = d.getDate();
                if (day >= 16) day = 31 - day;
                return day / 16.0;
            };
        }
        else if (hours > 24 * 3) {
            upperOffset = d3.timeDay.offset(nextProps.x.domain()[0], -4);
            lowerOffset = d3.timeDay.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeWeek;
            lowerTicks = d3.timeDay;
            upperTickFormat = d3.timeFormat("%Y %B Week %W");
            lowerTickFormat = d3.timeFormat("%d");

            alphaFunc = d => {
                let day = d.getDate();
                if (day >= 16) day = 31 - day;
                return day / 16.0;
            };

        } else if (hours > 24) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -18)
            lowerOffset = d3.timeHour.offset(nextProps.x.domain()[0], -6);
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeHour.every(6);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I %p");

            alphaFunc = d => {
                let day = d.getHours() / 6;
                if (day >= 3) day = 4 - day;
                return day / 3.0;
            };

        } else if (hours > 12) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -16)
            lowerOffset = d3.timeHour.offset(nextProps.x.domain()[0], -3);
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeHour.every(3);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I %p");
            alphaFunc = d => {
                let day = d.getHours() / 3;
                if (day >= 6) day = 8 - day;
                return day / 6.0;
            };

        } else if (hours > 4) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -20)
            lowerOffset = d3.timeHour.offset(nextProps.x.domain()[0], -1);
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeHour;
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I %p");
            alphaFunc = d => {
                let day = d.getHours();
                if (day >= 12) day = 24 - day;
                return day / 12.0;
            };

        } else if (hours > 2) {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -20)
            lowerOffset = d3.timeMinute.offset(nextProps.x.domain()[0], -30)
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeMinute.every(30);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I:%M %p");
            alphaFunc = d => {
                let day = (d.getHours() + (d.getMinutes() / 60)) * 2;
                if (day >= 24) day = 48 - day;
                return day / 24.0;
            };

        } else {
            upperOffset = d3.timeHour.offset(nextProps.x.domain()[0], -20)
            lowerOffset = d3.timeMinute.offset(nextProps.x.domain()[0], -15)
            upperTicks = d3.timeDay;
            lowerTicks = d3.timeMinute.every(15);
            upperTickFormat = d3.timeFormat("%Y %B %d %A");
            lowerTickFormat = d3.timeFormat("%I:%M %p");
            alphaFunc = d => {
                let day = (d.getHours() + (d.getMinutes() / 60)) * 4;
                if (day >= 48) day = 96 - day;
                return day / 48.0;
            };
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

        console.log(bgTicks);
        //Background
        let bgArray = []
        for (let i = 0; i < bgTicks.length - 1; i++) {
            alphaFunc(bgTicks[i]);
            bgArray.push({
                from: nextProps.x(bgTicks[i]),
                fromData: bgTicks[i],
                to: nextProps.x(bgTicks[i + 1])
            })
        }
        //Push last
        bgArray.push({
            from: nextProps.x(bgTicks[bgTicks.length - 1]),
            fromData: bgTicks[bgTicks.length - 1],
            to: nextProps.x.range()[1]
        })
        console.log(bgArray);
        const maxAlpha = 1;
        const minAlpha = 0.5;
        const deltaAlpha = maxAlpha - minAlpha;
        const bgMargin = 1;
        background.selectAll('rect').data(bgArray).join(
            (enter) => {
                enter.append('rect')
                    .attr('x', d => d.from + bgMargin)
                    .attr('width', d => (d.to - d.from - bgMargin) < 0 ? 0 : d.to - d.from - bgMargin)
                    .attr('y', 80)
                    .attr('height', '100%')
                    .attr('opacity', d => maxAlpha - (alphaFunc(d.fromData) * deltaAlpha))
            },
            (update) => {
                update
                    .attr('x', d => d.from - bgMargin)
                    .attr('width', d => (d.to - d.from - bgMargin) < 0 ? 0 : d.to - d.from - bgMargin)
                    .attr('y', 80)
                    .attr('height', '100%')
                    .attr('opacity', d => maxAlpha - (alphaFunc(d.fromData) * deltaAlpha))
            }
        )
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(TimeAxis) : TimeAxis;