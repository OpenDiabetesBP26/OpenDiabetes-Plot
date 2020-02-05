import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
import BackGround from '../../services/BackGround.js';

class IntradayChart extends Component {
    constructor(props) {
        super(props);
        this.state = { data: props.data, svg: props.svg, x: props.x }
    }
    render() {
        return (
            <g id='intraday' ref={g => this.g = g}></g>
        );
    }
    componentDidMount() {
        if (this.props.data != null) {
            let xAxis = d3.axisBottom(this.props.x)
            let yAxis = d3.axisLeft(this.props.y);
            this.yBasal = d3.scaleLinear().range([150, 0]).domain([0, 5]);
            let yBasalAxis = d3.axisRight(this.yBasal)
            let y = this.props.y;
            let x = this.props.x;
            let margin = this.props.margin;
            let width = 1000;


            let comp = d3.select("g#intraday");
            this.hLineX = 150;
            this.lLineX = 50;
            //svg graph für background
            this.background = comp.append("g")
            //add background für bar am top
            this.topbar = comp.append("rect")
                .attr("class", "topbar")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .attr("height", 25)
                .attr("width", this.props.x.range()[1])
            //Chart Legende
            this.legendeBackground = comp.append("rect")
                .attr("class", "legendeBackground")
                .attr("x", margin.left)
                .attr("y", margin.top + 26)
                .attr("height", 33)
                .attr("width", this.props.x.range()[1])
            //drei Kreise von Legende
            this.lengdeCircs =
                comp.append("circle")
                .attr("class", "legendeCircleH")
                .attr('cx', x.range()[1] - 20)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
            comp.append("circle")
                .attr("class", "legendeCircleN")
                .attr('cx', x.range()[1] - 40)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
            comp.append("circle")
                .attr("class", "legendeCircleL")
                .attr('cx', x.range()[1] - 60)
                .attr('cy', margin.top + 45)
                .attr('r', 6)
            //Text von Legende
            this.legendeText =
                comp.append("text")
                .attr("class", "legendeCircText")
                .text("low high")
                .attr("x", x.range()[1] - 110)
                .attr("y", margin.top + 50)
            comp.append("text")
                .text("BLOOD BLUCOSE")
                .attr("class", "legendeText1")
                .attr("x", margin.left + 5)
                .attr("y", margin.top + 50)
            comp.append("text")
                .text("mg/dL")
                .attr("class", "legendeText2")
                .attr("x", margin.left + 140)
                .attr("y", margin.top + 50)

            this.dashLine =
                comp.append("line")
                .attr("class", "dashLineH_N")
                .attr("x1", margin.left + x.range()[0])
                .attr("y1", margin.top + 60 + y(this.hLineX))
                .attr("x2", margin.left + x.range()[1])
                .attr("y2", margin.top + 60 + y(this.hLineX))
            comp.append("line")
                .attr("class", "dashLineN_L")
                .attr("x1", margin.left + x.range()[0])
                .attr("y1", margin.top + 60 + y(this.lLineX))
                .attr("x2", margin.left + x.range()[1])
                .attr("y2", margin.top + 60 + y(this.lLineX));

            //Bereich von Analystische Darstellung
            this.analysis = comp.append("g")


            //svg graph für x und y achse
            //init x und y achse
            this.xAxis_graph = comp.append("g")
                .attr("class", "xline")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 25) + ")")
                .call(xAxis);



            this.yAxis_graph = comp.append("g")
                .attr("class", "yline")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + 60) + ")")
                .call(yAxis);

            this.yAbdeckung = comp.append("line")
                .attr("class", "yAbdeckung")
                .attr("x1", margin.left)
                .attr("y1", margin.top + y(400))
                .attr("x2", margin.left)
                .attr("y2", margin.top + 60 + y(0))

            this.circs = comp.append('g');
            this.line = comp.append("g");

            //tooltips Text
            this.tooltipText =
                comp.append('text')
                .attr("class", "tooltipTextT")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .style("opacity", 0)
            comp.append('text')
                .attr("class", "tooltipTextV")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .style("opacity", 0)
            comp.append('text')
                .attr("class", "tooltipTextS")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .style("opacity", 0)

            this.drawChart(this.props);

            //erstelle ein neue Ebene, damit die focus-Elementen fliessend dargestellt werden.
            this.overlay = comp.append('rect')
                .attr("class", "overlay")
                .attr("x", margin.left + x.range()[0])
                .attr("y", margin.top + 60 + y(400))
                .attr("height", 400)

            //focus-Elementen
            let focusLineX = comp.append('line')
                .attr('id', 'focusLineX')
                .attr('class', 'focusLine');

            let focusLineY = comp.append('line')
                .attr('id', 'focusLineY')
                .attr('class', 'focusLine');

            let focusCircle = comp.append('circle')
                .attr('id', 'focusCircle')
                .attr('r', 8)
                .attr('class', 'focusCircle')
                .attr('display', 'none');
            let focusCircleInne = comp.append('circle')
                .attr('id', 'focusCircleInne')
                .attr('r', 5)
                .attr('class', 'focusCircleInne')
                .attr('display', 'none');
        }

    }
    drawChart(props) {
        let y = props.y;
        let x = props.x;
        let yb = this.yBasal;

        //wenn xAxis neue Scale bekommt, erneue Graph von xAxis und draw Background
        if (this.xAxis_graph) {
            //ebene und focus-Elementen werden dargestellt
            d3.select('.overlay').attr("width", x.range()[1] - x.range()[0]);
            this.mouseCatchMove(props, this.hLineX, this.lLineX);
            //neue xAxis Daten von props
            let newxAxis = d3.axisTop(x)
            this.xAxis_graph.call(newxAxis)
            let bg = new BackGround();
            let readTicks = bg.readTicks(x);
            let opacityArr = bg.creatOpacity();
            let xPos = bg.creatXpos(x);
            let wdArr = bg.getWds();

            let ticksGroup = this.background.selectAll('rect').data(xPos).join(
                    (enter) => enter.append('rect')
                    .attr('x', d => d)
                    .attr('y', y(400))
                    .attr('height', 400)
                    .attr('width', (d, i) => wdArr[i])
                    .style("fill", "lightgray")
                    .style("opacity", (d, i) => opacityArr[i]),
                    (update) => update
                    .attr('x', d => d)
                    .attr('width', (d, i) => wdArr[i])
                    .style("opacity", (d, i) => opacityArr[i])
                )
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top + 60) + ')');
        }



        if (this.circs != null) {
            let circles = this.circs.selectAll('circle').data(props.data.glucose).join(
                    (enter) => enter.append('circle')
                    .attr('r', 3)
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                    .attr('fill', d => this.circleColor(d.value)),
                    (update) => update
                    .attr('cy', d => y(+d.value))
                    .attr('cx', d => x(d.time))
                    .attr('fill', d => this.circleColor(d.value))
                )
                .attr('transform', 'translate(' + this.props.margin.left + ' ' + (this.props.margin.top + 60) + ')');
        }
        if (this.line != null) {
            var line = this.line.selectAll('line').data(props.data.basal).join(
                    (enter) => enter.append('line')
                    .attr('x1', d => x(+d.time_start) < 0 ? 0 : x(+d.time_start))
                    .attr('y1', d => yb(+d.value))
                    .attr('x2', d => x(d.time_end) > x.range()[1] ? x.range()[1] : x(d.time_end))
                    .attr('y2', d => yb(+d.value))
                    .attr('stroke', 'blue'),
                    (update) => update
                    .attr('x1', d => x(+d.time_start) < 0 ? 0 : x(+d.time_start))
                    .attr('y1', d => yb(+d.value))
                    .attr('x2', d => x(d.time_end) > x.range()[1] ? x.range()[1] : x(d.time_end))
                    .attr('y2', d => yb(+d.value)))

                .attr('transform', 'translate(' + this.props.margin.left + ' ' + ((this.props.margin.top + 60 + this.props.y.range()[0] - 150)) + ')');
        }

        //update topbar
        if (this.topbar) {
            this.topbar.attr("width", this.props.x.range()[1]);
            this.legendeBackground.attr("width", this.props.x.range()[1]);
            d3.select(".legendeCircleH").attr('cx', x.range()[1] - 20);
            d3.select(".legendeCircleN").attr('cx', x.range()[1] - 40);
            d3.select(".legendeCircleL").attr('cx', x.range()[1] - 60);
            d3.select(".legendeCircText").attr("x", x.range()[1] - 110);
            d3.select(".dashLineH_N").attr("x2", this.props.margin.left + x.range()[1]);
            d3.select(".dashLineN_L").attr("x2", this.props.margin.left + x.range()[1]);
        }
    }
    //circle_color 
    circleColor(d) {
        return d >= this.hLineX ? '#3498DB' : d >= this.lLineX ? '#58D68D' : '#DC7633';
    }
    //focus zeigt zuerst automatisch, wenn man mouse click halten, dann focus sich verbergt, 
    //nach dem verschieben oder zoomen, mit ein mal mouseclick wird focus wieder dargestellt.
    mouseCatchMove(props,hLineX,lLineX) {
        let data = props.data.glucose;
        let y = props.y;
        let x = props.x;
        d3.select(".overlay")
            .on('mouseover', function() {
                d3.select('#focusLineX').style('display', null);
                d3.select('#focusLineY').style('display', null);
                d3.select('#focusCircle').style('display', null);
                d3.select('#focusCircleInne').style('display', null)
                d3.select('.tooltipTextT').style('display', null)
                d3.select('.tooltipTextV').style('display', null)
                d3.select('.tooltipTextS').style('display', null);
            })
            .on('mouseout', function() {
                d3.select('#focusLineX').style('display', 'none');
                d3.select('#focusLineY').style('display', 'none');
                d3.select('#focusCircle').style('display', 'none');
                d3.select('#focusCircleInne').style('display', 'none')
                d3.select('.tooltipTextT').style('display', 'none')
                d3.select('.tooltipTextV').style('display', 'none')
                d3.select('.tooltipTextS').style('display', 'none');
            })
            .on('mousemove', function() {
                let mouse = d3.mouse(this);
                let mouseDate = x.invert(mouse[0] - props.margin.left <= x(data[data.length - 1].time) ? mouse[0] - props.margin.left : x(data[data.length - 1].time));
                let bisectDate = d3.bisector(function(d) { return d.time; }).left;
                let index = bisectDate(data, mouseDate);
                let dPre = data[index - 1]
                let dSuf = data[index];
                let d = mouseDate.getTime() - dPre.time.getTime() > dSuf.time.getTime() - mouseDate.getTime() ? dSuf : dPre;
                let xPos = x(d.time);
                let yPos = y(d.value);
                console.log("mouseX", xPos);

                d3.select('#focusCircle')
                    .transition()
                    .duration(10)
                    .attr('cx', xPos + props.margin.left)
                    .attr('cy', yPos + 60 + props.margin.top)
                    .attr('fill', d.value >= hLineX ? '#3498DB' : d.value >= lLineX ? '#58D68D' : '#DC7633')
                    .attr('display', 'block');
                d3.select('#focusCircleInne')
                    .transition()
                    .duration(10)
                    .attr('cx', xPos + props.margin.left)
                    .attr('cy', yPos + 60 + props.margin.top)
                    .attr('display', 'block');
                d3.select('#focusLineX')
                    .transition()
                    .duration(10)
                    .attr('x1', xPos + props.margin.left)
                    .attr('y1', props.margin.top + 60 + y(400))
                    .attr('x2', xPos + props.margin.left)
                    .attr('y2', props.margin.top + 60 + y(0));
                d3.select('#focusLineY')
                    .transition()
                    .duration(10)
                    .attr('x1', props.margin.left + x.range()[0])
                    .attr('y1', props.margin.top + 60 + y(400) + yPos)
                    .attr('x2', props.margin.left + x.range()[1])
                    .attr('y2', props.margin.top + 60 + y(400) + yPos);
                d3.select(".tooltipTextT")
                    .attr("x", xPos >= x.range()[1] * (3 / 4) - props.margin.left ? xPos - 400 : xPos + 60)
                    .attr("y", y(400) + 140 + props.margin.top - 60)
                    .text("time: " + d.time)
                    .style("opacity", 1)
                d3.select(".tooltipTextV")
                    .attr("x", xPos >= x.range()[1] * (3 / 4) - props.margin.left ? xPos - 400 : xPos + 60)
                    .attr("y", y(400) + 140 + props.margin.top - 30)
                    .text("value: " + d.value)
                    .style("opacity", 1)
                d3.select(".tooltipTextS")
                    .attr("x", xPos >= x.range()[1] * (3 / 4) - props.margin.left ? xPos - 400 : xPos + 60)
                    .attr("y", y(400) + 140 + props.margin.top)
                    .text("source: " + d.source)
                    .style("opacity", 1)

                d3.select('#focusLineX').style('display', 'block');
                d3.select('#focusLineY').style('display', 'block');
                d3.select('#focusCircle').style('display', 'block');
                d3.select('#focusCircleInne').style('display', 'block');
                d3.select('.tooltipTextT').style('display', 'block');
                d3.select('.tooltipTextV').style('display', 'block');
                d3.select('.tooltipTextS').style('display', 'block');
            })
            .on('wheel', function() {
                d3.select('#focusLineX').style('display', 'none');
                d3.select('#focusLineY').style('display', 'none');
                d3.select('#focusCircle').style('display', 'none');
                d3.select('#focusCircleInne').style('display', 'none')
                d3.select('.tooltipTextT').style('display', 'none')
                d3.select('.tooltipTextV').style('display', 'none')
                d3.select('.tooltipTextS').style('display', 'none');
            })
            .on('mousedown', function() {
                d3.select('#focusLineX').style('display', 'none');
                d3.select('#focusLineY').style('display', 'none');
                d3.select('#focusCircle').style('display', 'none');
                d3.select('#focusCircleInne').style('display', 'none')
                d3.select('.tooltipTextT').style('display', 'none')
                d3.select('.tooltipTextV').style('display', 'none')
                d3.select('.tooltipTextS').style('display', 'none');
            })

            //nur wenn automatische Darstellung ungültig ist!! 
            .on('click', function() {
                d3.select('#focusLineX').style('display', 'block');
                d3.select('#focusLineY').style('display', 'block');
                d3.select('#focusCircle').style('display', 'block');
                d3.select('#focusCircleInne').style('display', 'block');
                d3.select('.tooltipTextT').style('display', 'block');
                d3.select('.tooltipTextV').style('display', 'block');
                d3.select('.tooltipTextS').style('display', 'block');
            });
    }

    componentWillReceiveProps(nextProps) {
        //Wir können Daten hier neu rendern
        this.drawChart(nextProps);
        console.log(nextProps.data);
    }
    shouldComponentUpdate() {
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
    componentDidUpdate() {}
}

export default hot ? hot(module)(IntradayChart) : IntradayChart;