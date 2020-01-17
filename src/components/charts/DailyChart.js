import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';
class DailyChart extends Component {
    render() {
        return (
            <g id='daily' ref={g => this.g = g}></g>
         );
    }
    drawChart(props){
        /** Hier werden die Objekte von d3 eingefügt, die geupdatet werden
         *  Glukosedaten können z.B mit props.data.glucose geholt werden
         */
    }
    componentDiDMount(){
        /**
         * Hier können einmalige Objekte eingeügt und erstellt werden
         */
    }
    componentWillReceiveProps(nextProps){
        this.drawChart(nextProps);
    }
    shouldComponentUpdate(){
        //Update ausgeschaltet -> wird nicht neu gerendert
        return false;
    }
}
export default hot ? hot(module)(DailyChart) : DailyChart;