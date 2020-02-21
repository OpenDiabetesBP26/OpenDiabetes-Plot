import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import * as d3 from 'd3';
import DataManager from '../services/DataManager';
import TimeAxis from './charts/TimeAxis';
import BarGlucose from './charts/BarGlucose';
import PointGlucose from './charts/PointGlucose';
import LineBasal from './charts/LineBasal';
import Statistics from './charts/Statistics';
import PercentileDay from './charts/PercentileDay';
import BarBolusCarbs from './charts/BarBolusCarbs';

const margin = { top: 20, right: 40, bottom: 110, left: 40 };
class Chart extends Component {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.renderData = undefined;
        this.x = d3.scaleTime();
        this.xBase = d3.scaleTime();
        this.state = { x: this.x }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        {!this.props.data && <div> No data loaded </div>}
                        <svg id="d3sample" width="100%" height="1180" ref={(svg) => this.svg = svg}>
                        <g id="mainGroup">
                        <TimeAxis x={this.state.x} />
                        {this.renderData && this.renderData.dataDisplay.glucoseDisplay == 'percentile' && <BarGlucose data={this.renderData.dataDisplay.glucose} x={this.state.x}/>}
                        {this.renderData && this.renderData.dataDisplay.glucoseDisplay == 'point' && <PointGlucose data={this.renderData.dataDisplay.glucose} x={this.state.x}/>}
                        {this.renderData && this.renderData.dataDisplay.basalDisplay == 'line' && <LineBasal data={this.renderData.dataDisplay.basal} dataProfile={this.renderData.dataDisplay.basal_profile} x={this.state.x}/>}
                        {this.renderData && <BarBolusCarbs data={{bolus:this.renderData.dataDisplay.bolus, carbs:this.renderData.dataDisplay.carbs}} x={this.state.x}/>}
                        </g>
                        </svg>
                    </div>
                    <div className="col-lg-4 col-md-12">
                    {this.renderData && <Statistics domain={this.state.x != null ? this.state.x.domain() : null} data={this.renderData.timeInRange} />}
                    </div>
                </div>
                <div className="row">
                    {this.renderData && this.renderData.percentileDay && <PercentileDay data={this.renderData.percentileDay} x={this.state.x}/>}
                </div>
            </div>
        );
    }

    componentDidUpdate(nextProps) {
        if(this.props.data !== nextProps.data) {
            console.log("update data", this.props.data)
            this.loadData();
        }
    }

    componentDidMount() {
        //Append resize listener
        window.addEventListener("resize", this.updateDimensions.bind(this));
        d3.select('g#mainGroup').attr('transform', 'translate(50, 0)');
        // //Call resize to set first state
    }
    componentWillUnmount(){
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    loadData() {
        //this.data = data;
        if (this.props.data) {
            this.dataManager.readData(this.props.data); 
        

            this.maxZoom = this.dataManager.getMaxZoom();
            //Add d3 stuff
            let svg = d3.select(this.svg);

            //Creating new domains
            this.x.domain(this.dataManager.getMaxDomain());
            this.xBase.domain(this.x.domain());
            //Creating new zoom
            this.zoom = d3.zoom()
                .scaleExtent([1, this.maxZoom])
                .translateExtent([[0, 0], [0, 0]])
                .on("zoom", () => this.zoomed());
            //Calling zoom on svg
            svg.call(this.zoom);
            //updateDimensions to fix zoom
            this.updateDimensions();
        }

    }
    updateDimensions() {
        if (this.svg && this.zoom) {
            let newWidth = this.svg.getBoundingClientRect().width - margin.left - margin.right;
            //Update Base and x range
            let xBase = this.xBase.range([0, newWidth]);
            let x = this.x.range([0, newWidth]);

            //Update Zoom
            //Fix, as d3.event.transform is null in webpack
            let oldRange = this.xBase.range()[1] - this.xBase.range()[0];
            let s = this.x.domain().map(x => xBase(x));
            let k = oldRange / (s[1] - s[0]);

            let newXOffset = -xBase(x.domain()[0]);
            //Get current svg size
            let width = this.svg.getBoundingClientRect().width - margin.left - margin.right;
            //Get currrent zoom
            let kFix = (d3.event != null ? d3.event.transform.k : 1);
            //From https://stackoverflow.com/questions/44120372/d3-v4-how-to-limit-left-right-panning-on-an-x-zoom-line-graph
            this.zoom.translateExtent([[0, 0], [width + ((margin.left + margin.right) / kFix), 0]])
            d3.select(this.svg).call(this.zoom.transform, d3.zoomIdentity.scale(k).translate(newXOffset, 0));

            //Update State
            this.setState({ xBase: xBase, x: x });

        }
    }
    zoomed() {
        this.x = d3.event.transform.rescaleX(this.xBase);
        this.renderData = this.dataManager.getRenderData(this.x.domain());
        console.log(this.renderData);
        //Set State
        this.setState({
            x: this.x,
        });

    }
}

export default hot ? hot(module)(Chart) : Chart;