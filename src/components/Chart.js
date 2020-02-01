import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Loading from '../common/Loading';
import * as d3 from 'd3';
import DataManager from '../services/DataManager';
import IntradayChart from './charts/IntradayChart';
import ThreeHourlyChart from './charts/ThreeHourlyChart';
import SixHourlyChart from './charts/SixHourlyChart';
import DailyChart from './charts/DailyChart';
import WeeklyChart from './charts/WeeklyChart';
import MonthlyChart from './charts/MonthlyChart';

import Statistics from './charts/Statistics';
import PercentileDay from './charts/PercentileDay';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = { display: 'intraday' }
        this.svg = React.createRef()

    }
    render() {
        let display = this.getDisplayComponent(this.state.display);
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <svg id="d3sample" width="100%" height="500" ref={(svg) => this.svg = svg}>
                            {display}
                        </svg>
                        { this.state.display == 'daily' || this.state.display == 'weekly' || this.state.display == 'monthly' ? <PercentileDay x={this.state.x} data={this.state.data_manager != null ? this.state.data_manager.getPercentileDay() : null} margin={this.state.margin} /> : '' }
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <Statistics domain={this.state.x != null ? this.state.x.domain() : null} dm={this.state.data_manager != null ? this.state.data_manager : null} />
                    </div>
                </div>
            </div>
        );
    }
    getDisplayComponent(display) {
        switch (display) {
            case 'intraday':
                return <IntradayChart data={this.state.data_manager != null ? this.state.data_manager.getIntradayData() : null} svg={this.svg} x={this.state.x} y={this.state.y} margin={this.state.margin} />
            case '3hourly':
                return <ThreeHourlyChart data={this.state.data_manager != null ? this.state.data_manager.getThreeHourlyData() : null} svg={this.svg} x={this.state.x} y={this.state.y} margin={this.state.margin} />
            case '6hourly':
                return <SixHourlyChart data={this.state.data_manager != null ? this.state.data_manager.getSixHourlyData() : null} svg={this.svg} x={this.state.x} y={this.state.y} margin={this.state.margin} />
            case 'daily':
                return <DailyChart data={this.state.data_manager != null ? this.state.data_manager.getDailyData() : null} svg={this.svg} x={this.state.x} y={this.state.y} margin={this.state.margin} />
            case 'weekly':
                return <WeeklyChart data={this.state.data_manager != null ? this.state.data_manager.getWeeklyData() : null} svg={this.svg} x={this.state.x} y={this.state.y} margin={this.state.margin} />
            case 'monthly':
                return <MonthlyChart data={this.state.data_manager != null ? this.state.data_manager.getMonthlyData() : null} svg={this.svg} x={this.state.x} y={this.state.y} margin={this.state.margin} />
            default:
                return null;
        }
    }

    componentDidUpdate() {
        if (!this.props.data) { return; }; 
        //TODO Implement DataManager
        // let data = await (await fetch("/data/2019-11-20-1349_export-data.json")).json()
        // console.log(data);
        // data = data.data;
        // this.data = data;
        let dm = new DataManager();
        this.setState({ data_manager: dm });
        
        this.state.data_manager.readData(this.props.data);
        this.maxZoom = this.state.data_manager.getMaxZoom();
        this.setState({ maxZoom: this.maxZoom });

        //Add d3 stuff
        let svg = d3.select("svg");
        let width = 1000,
            height = 400,
            margin = { top: 20, right: 40, bottom: 110, left: 40 }

        //Domains
        let xBase = d3.scaleTime().range([0, width]),
            x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]);

        //Set max domains
        x.domain(this.state.data_manager.getMaxDomain());
        y.domain([0, 400])
        xBase.domain(x.domain());

        //TODO set base domain through data manager

        //Update State with domains
        this.setState({ xBase: xBase, x: x, y: y, margin: margin })


        this.zoom = d3.zoom()
            //Wie viel man unzoomen und zoomen kann
            //TODO vom DataManager berechnen lassen
            .scaleExtent([1, this.maxZoom])
            .translateExtent([[0, 0], [width, 0]])
            .on("zoom", () => this.zoomed());

        svg.call(this.zoom);
        this.d3svg = svg;

        //Append resize listener
        
        //Call resize to set first state
        this.updateDimensions();
    }
    //Wird einmalig aufgerufen, wenn es gemountet ist
    componentDidMount() {
        let dm = new DataManager();
        this.setState({ data_manager: dm });
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }
    updateDimensions() {
        if (this.svg) {
            let newWidth = this.svg.getBoundingClientRect().width - this.state.margin.left - this.state.margin.right;
            //Update Base and x range
            let xBase = this.state.xBase.range([0, newWidth]);
            let x = this.state.x.range([0, newWidth]);

            //Update Zoom
            //Fix, as d3.event.transform is null in webpack
            let oldRange = this.state.xBase.range()[1] - this.state.xBase.range()[0];
            let s = this.state.x.domain().map(x => xBase(x));
            let k = oldRange / (s[1] - s[0]);

            let newXOffset = -xBase(x.domain()[0]);
            console.log(this.zoom.translateExtent());
            this.fixExtent();
            d3.select("svg").call(this.zoom.transform, d3.zoomIdentity.scale(k).translate(newXOffset, 0));

            //Update State
            this.setState({ xBase: xBase, x: x });

        }
    }
    /** translateExtent locks panning after specific point.
     *  However, it seems buggy while zooming and resizing
     *  Code below needs to be applied to fix it
     * 
     */
    fixExtent() {
        //Get current svg size
        let width = this.svg.getBoundingClientRect().width - this.state.margin.left - this.state.margin.right;
        //Get currrent zoom
        let k = (d3.event != null ? d3.event.transform.k : 1);
        //From https://stackoverflow.com/questions/44120372/d3-v4-how-to-limit-left-right-panning-on-an-x-zoom-line-graph
        this.zoom.translateExtent([[0, 0], [width + ((this.state.margin.left + this.state.margin.right) / k), 0]])
    }

    zoomed() {
        //this.fixExtent();

        let x = d3.event.transform.rescaleX(this.state.xBase);
        //Update Domain in sync
        //Update Display

        //time difference in hours
        let delta = (x.domain()[1] - x.domain()[0]) / (60000 * 60);
        let display = this.getDisplay(delta);
        if (this.state.display != display) {
            this.state.data_manager.changeDisplay(display);
        }
        this.state.data_manager.updateDomain(x.domain());


        //Set State
        this.setState({
            x: x,
            display: display
        });

    }
    getDisplay(hours) {
        if (hours > 24 * 30 * 12) {
            return 'monthly';
        }
        if (hours > 24 * 7 * 4 * 3) {
            return 'weekly'
        }
        if (hours > 24 * 7 * 3) {
            return 'daily'
        }
        if (hours > 24 * 7) {
            return '6hourly'
        }
        if (hours > 24 * 3) {
            return '3hourly'
        }
        return 'intraday';
    }
}

export default hot ? hot(module)(Chart) : Chart;