import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import Loading from '../common/Loading';
import * as d3 from 'd3';
import DataManager from '../services/DataManager';
import DailyChart from './charts/DailyChart';

class Chart extends Component {
    constructor(props){
        super(props);
        this.state = { loading: true, display: 'daily'}

    }
    render() {
        console.log('Render Chart');
        const display = this.getDisplay(this.state.display);

        return (
            <div>
            <Loading visible={this.state.loading} />
            <svg id="d3sample" width="1000" height="500" ref={(svg) => this.svg = svg}>
            {display}
            </svg>
        </div>
        );
    }
    getDisplay(display){
        switch(display){
            case 'daily':
                return <DailyChart data={this.data} svg={this.svg} x={this.state.x} />
            default:
                return null;
        }
    }
    load(loading) {
        this.setState({ loading: (loading ? true : false) });
    }
    //Wird einmalig aufgerufen, wenn es gemountet ist
    async componentDidMount() {
        try {
            //TODO Implement DataManager
            let data = await (await fetch("/data/2019-11-20-1349_export-data.json")).json()
            data = data.data.slice(0, 1000).filter(d => d.type == "GLUCOSE_CGM");
            console.log(data);
            this.data = data;
        }
        finally {
            this.setState({loading: false})
        }
        //Add d3 stuff
        let svg = d3.select("svg");
        let width = 1000,
        height = 400

        //Domains
        let xBase = d3.scaleTime().range([0, width]),
        x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);
        
        //TODO set base domain through data manager

        //Update State with domains
        this.setState({xBase: xBase, x: x, y: y})
        

        let zoom = d3.zoom()
        //Wie viel man unzoomen und zoomen kann
        //TODO vom DataManager berechnen lassen
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", () => this.zoomed());

        svg.call(zoom);

        

        
    }

    zoomed(){
      let x = d3.event.transform.rescaleX(this.state.xBase);
      this.setState({x: x});
      console.log(x.domain());

    }
    //Wird aufgerufen, sobald sich der state ändert
    componentDidUpdate(){
        console.log('Update Chart');
    }
}

export default hot ? hot(module)(Chart) : Chart;