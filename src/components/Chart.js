import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import Loading from '../common/Loading';
import * as d3 from 'd3';
import DataManager from '../services/DataManager';
import DailyChart from './charts/DailyChart';

class Chart extends Component {
    constructor(props){
        super(props);
        this.state = { loading: true, display: 'intraday'}

    }
    render() {
        console.log('Render Chart');
        let display = this.getDisplayComponent(this.state.display);
        console.log(display);
        return (
            <div>
            <Loading visible={this.state.loading} />
            <svg id="d3sample" width="1000" height="500" ref={(svg) => this.svg = svg}>
            {display}
            </svg>
        </div>
        );
    }
    getDisplayComponent(display){
        console.log('Get Display' + display)
        switch(display){
            case 'intraday':
                return <DailyChart data={this.state.data_manager != null ? this.state.data_manager.getDailyData() : null} svg={this.svg} x={this.state.x} y={this.state.y} margin={this.state.margin}/>
            case '3hourly':
                return <div>Platzhalter 3hourly</div>
            case '6hourlly':
                return <div>Platzhalter 6hourly</div>
            case 'daily':
                return <div>Platzhalter daily</div>
            case 'weekly':
                return <div>Platzhalter weekly</div>
            case 'monthly':
                return <div>Platzhalter monthly</div>
            default:
                return null;
        }
    }
    //Wird einmalig aufgerufen, wenn es gemountet ist
    async componentDidMount() {
        try {
            //TODO Implement DataManager
            let data = await (await fetch("/data/2019-11-20-1349_export-data.json")).json()
            data = data.data;
            this.data = data;
            
        }
        finally {
            this.setState({loading: false})
            let dm = new DataManager();
            dm.readData(this.data);
            this.setState({data_manager: dm})
        }
        //Add d3 stuff
        let svg = d3.select("svg");
        let width = 1000,
        height = 400,
        margin = { top: 20, right: 20, bottom: 110, left: 40 }

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
        this.setState({xBase: xBase, x: x, y: y, margin: margin})
        

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
      this.state.data_manager.updateDomain(x.domain());
      //Debug
      console.log(x.domain());

      //Update Display

      //time difference in hours
      let delta = (x.domain()[1] - x.domain()[0]) / (60000*60);
      let display = this.getDisplay(delta);
      if(this.state.display != display){
          this.state.data_manager.changeDisplay(display);
      }

      //Set State
      this.setState({
          x: x,
          display: display
        });

    }
    //Wird aufgerufen, sobald sich der state ändert
    componentDidUpdate(){
        console.log('Update Chart');
        console.log(this.state.display);
    }
    getDisplay(hours){
        if(hours > 24 * 30 * 12){
            return 'monthly';
        }
        if(hours > 24 * 7 * 4 * 3){
            return 'weekly'
        }
        if(hours > 24 * 7 * 3){
            return 'daily'
        }
        if(hours > 24 * 7){
            return '6hourly'
        }
        if(hours > 24*3){
            return '3hourly'
        }
        return 'intraday';
    }
}

export default hot ? hot(module)(Chart) : Chart;