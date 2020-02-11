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
        this.tooltip = d3.select("body").append("div").attr("class","test").style("opacity", 0)


    }
    componentWillReceiveProps(nextProps) {
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
            .attr('width', nextProps.x(nextProps.x.domain()[1]) - nextProps.x(nextProps.x.domain()[0]))
            .attr('height', this.y(high) - this.y.range()[0]);

        this.groupData.append('clipPath')
            .attr("id", "clipNormal")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y(high))
            .attr('width', nextProps.x(nextProps.x.domain()[1]) - nextProps.x(nextProps.x.domain()[0]))
            .attr('height', this.y(low) - this.y(high));

        this.groupData.append('clipPath')
            .attr("id", "clipLow")
            .append('rect')
            .attr('x', 0)
            .attr('y', this.y(low))
            .attr('width', nextProps.x(nextProps.x.domain()[1]) - nextProps.x(nextProps.x.domain()[0]))
            .attr('height', this.y(0) - this.y(high));

        let width = 16;
        let pos = this.groupData.node().getBoundingClientRect();
        if(nextProps.x.range()[1] < 800) width = 10;
        this.groupData.selectAll('g').data(nextProps.data).join(
            (enter) => {
                let group = enter.append('g').attr('class', 'glucose-percentile')
                //OUTER PERCENTILE
                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                    .attr('class', 'nhigh')
                    .attr("clip-path", "url(#clipHigh)")

                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                    .attr('class', 'nnormal')
                    .attr("clip-path", "url(#clipNormal)")

                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                    .attr('class', 'nlow')
                    .attr("clip-path", "url(#clipLow)")

                //INNTER PERCENTIL
                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                    .attr('class', 'high')
                    .attr("clip-path", "url(#clipHigh)");

                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                    .attr('class', 'normal')
                    .attr("clip-path", "url(#clipNormal)");

                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                    .attr('class', 'low')
                    .attr("clip-path", "url(#clipLow)");
                //Median Circle
                group.append('rect')
                    .attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[2]) - 3)
                    .attr('height', 6)
                    .attr('class', 'median')
                group.on("mouseover", d => {
                    this.tooltip.transition()		
                    .duration(200)		
                    .style("opacity", .9);
                    this.tooltip.html(d.time + "<br/>")	
                    .style("left", (pos.x + nextProps.x(d.time)) + "px")		
                    .style("top", (pos.y + this.y(d.percentile[2])) + "px")
                    .style("position", 'absolute')
                    .style("z-index", -9999)

                                        //.style("left", (d3.event.pageX) + "px")		
                    //.style("top", (d3.event.pageY - 28) + "px")

                    console.log(pos);
                })
                group.on("mouseout", d => {
                    this.tooltip.transition()		
                    .duration(200)		
                    .style("opacity", .0)
                    .style("z-index", 0)

                                        //.style("left", (d3.event.pageX) + "px")		
                    //.style("top", (d3.event.pageY - 28) + "px")

                    console.log(pos);
                })
            },
            (update) => {
                //OUTER PERCENTILE
                update.select('rect.nhigh').attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                update.select('rect.nnormal').attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                update.select('rect.nlow').attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[4]))
                    .attr('height', d => this.y(d.percentile[0]) - this.y(d.percentile[4]))
                    .attr('rx', width/2)
                    .attr('ry', width/2)
                //INNER PERCENTILE
                update.select('rect.high').attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width/2)
                    .attr('ry', width/2);
                update.select('rect.normal').attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width/2)
                    .attr('ry', width/2);
                update.select('rect.low').attr('x', d => nextProps.x(d.time) - width/2)
                    .attr('width', width)
                    .attr('y', d => this.y(d.percentile[3]))
                    .attr('height', d => this.y(d.percentile[1]) - this.y(d.percentile[3]))
                    .attr('rx', width/2)
                    .attr('ry', width/2);
                update.select('rect.median')
                    .attr('x', d => nextProps.x(d.time) - width/2)
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