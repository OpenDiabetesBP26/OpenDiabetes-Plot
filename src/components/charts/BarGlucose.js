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


    }
    componentWillReceiveProps(nextProps) {
        if (!this.groupData) return;

        //Add clip paths
        d3.select(this.mainGroup).select('rect').attr('width', this.props.x.range()[1]);
        this.groupData.selectAll('clipPath').remove();
        this.groupData.append('clipPath')
            .attr("id", "clipHigh")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y.range()[0])
            .attr('width', nextProps.x(nextProps.x.domain()[1]) - nextProps.x(nextProps.x.domain()[0]))
            .attr('height', this.y(180) - this.y.range()[0]);

        this.groupData.append('clipPath')
            .attr("id", "clipNormal")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y(180))
            .attr('width', nextProps.x(nextProps.x.domain()[1]) - nextProps.x(nextProps.x.domain()[0]))
            .attr('height', this.y(80) - this.y(180));

        this.groupData.append('clipPath')
            .attr("id", "clipLow")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y(80))
            .attr('width', nextProps.x(nextProps.x.domain()[1]) - nextProps.x(nextProps.x.domain()[0]))
            .attr('height', this.y(0) - this.y(180));

        this.groupData.selectAll('g').data(nextProps.data).join(
            (enter) => {
                let group = enter.append('g')
                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - 8)
                    .attr('width', 16)
                    .attr('y', d => this.y(d.percentile[2]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[2]))
                    .attr('fill', 'red')
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('class', 'high')
                    .attr("clip-path", "url(#clipHigh)");

                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - 8)
                    .attr('width', 16)
                    .attr('y', d => this.y(d.percentile[2]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[2]))
                    .attr('fill', 'green')
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('class', 'normal')
                    .attr("clip-path", "url(#clipNormal)");

                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - 8)
                    .attr('width', 16)
                    .attr('y', d => this.y(d.percentile[2]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[2]))
                    .attr('fill', 'blue')
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('class', 'low')
                    .attr("clip-path", "url(#clipLow)");
            },
            (update) => {
                update.select('rect.high').attr('x', d => nextProps.x(d.time) - 8)
                    .attr('width', 16)
                    .attr('y', d => this.y(d.percentile[2]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[2]))
                    .attr('fill', 'red')
                    .attr('rx', 5)
                    .attr('ry', 5);
                update.select('rect.normal').attr('x', d => nextProps.x(d.time) - 8)
                    .attr('width', 16)
                    .attr('y', d => this.y(d.percentile[2]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[2]))
                    .attr('fill', 'green')
                    .attr('rx', 5)
                    .attr('ry', 5);
                update.select('rect.low').attr('x', d => nextProps.x(d.time) - 8)
                    .attr('width', 16)
                    .attr('y', d => this.y(d.percentile[2]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[2]))
                    .attr('fill', 'blue')
                    .attr('rx', 5)
                    .attr('ry', 5);
            }
        )
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(BarGlucose) : BarGlucose;