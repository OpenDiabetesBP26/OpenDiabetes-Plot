import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Loading from '../common/Loading';
import * as d3 from 'd3';
import DataManager from '../services/DataManager';


class Chart extends Component {
    constructor(props) {
        super(props);
        this.dataManager = new DataManager();
        this.renderData = undefined;
        this.x = d3.scaleTime();
        this.xBase = d3.scaleTime();
        this.state = { loading: false, x: this.x }
        this.margin = { top: 20, right: 40, bottom: 110, left: 40 }

        this.loadTestData = this.loadTestData.bind(this);

    }
    render() {
        return (
            <div className="container-fluid">
                <Loading visible={this.state.loading} />
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        {!this.data && <div> No data loaded </div>}
                        <svg id="d3sample" width="100%" height="500" ref={(svg) => this.svg = svg}>
                        
                        </svg>
                    </div>
                    <div className="col-lg-4 col-md-12">
                    <button onClick={this.loadTestData}>
                        Load test data
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    componentDidMount() {
        //this.loadData();

        //Append resize listener
        window.addEventListener("resize", this.updateDimensions.bind(this));
        // //Call resize to set first state
    }
    componentWillUnmount(){
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }
    async loadTestData(){
        try {
            //TODO Implement DataManager
            let data = await (await fetch("/data/2019-11-20-1349_export-data.json")).json()
            console.log(data);
            data = data.data;
            this.loadData(data);

        }
        finally {
            this.setState({ loading: false });

        }
        

    }
    loadData(data) {
        this.data = data;
        this.dataManager.readData(data);
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
    updateDimensions() {
        if (this.svg && this.zoom) {
            let newWidth = this.svg.getBoundingClientRect().width - this.margin.left - this.margin.right;
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
            let width = this.svg.getBoundingClientRect().width - this.margin.left - this.margin.right;
            //Get currrent zoom
            let kFix = (d3.event != null ? d3.event.transform.k : 1);
            //From https://stackoverflow.com/questions/44120372/d3-v4-how-to-limit-left-right-panning-on-an-x-zoom-line-graph
            this.zoom.translateExtent([[0, 0], [width + ((this.margin.left + this.margin.right) / kFix), 0]])
            d3.select(this.svg).call(this.zoom.transform, d3.zoomIdentity.scale(k).translate(newXOffset, 0));

            //Update State
            this.setState({ xBase: xBase, x: x });

        }
    }
    zoomed() {
        this.x = d3.event.transform.rescaleX(this.xBase);
        this.renderData = this.dataManager.getRenderData(this.x.domain());
        //Set State
        this.setState({
            x: this.x,
        });

    }
}

export default hot ? hot(module)(Chart) : Chart;