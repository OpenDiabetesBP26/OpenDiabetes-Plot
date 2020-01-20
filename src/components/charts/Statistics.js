import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

class Statistics extends Component {
    constructor(props){
        super(props);
    }
    render(){
        if(this.props.stats == null){
            return(
                <div>
                    Loading...
                </div>
                );
        }
        console.log(this.props.stats);
        return(
        <div className="bg-light">
            <h2>Glucose distribution</h2>
            <div className="time-frame">
            <p>from {this.props.stats.timeFrame[0].toDateString()} - {this.props.stats.timeFrame[1].toDateString()}</p>
            </div>
            <div className="average-bg">
            <p>
                {this.props.stats.glucose.average == 0 ? '-' : Math.round(this.props.stats.glucose.average)}
            </p>
            </div>
            <div className="stat-container hyper">
            <div className="stat-fill hyper" style={{width: Math.round(this.props.stats.glucose.hyper * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.hyper * 100)}%</h2>
                <p>above {this.props.stats.glucoseLevels.high} mg/dl</p>
            </div>
            </div>

            <div className="stat-container high">
            <div className="stat-fill high" style={{width: Math.round(this.props.stats.glucose.high * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.high * 100)}%</h2>
                <p>between {this.props.stats.glucoseLevels.normal} - {this.props.stats.glucoseLevels.high} mg/dl</p>
            </div>
            </div>

            <div className="stat-container normal">
            <div className="stat-fill normal" style={{width: Math.round(this.props.stats.glucose.normal * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.normal * 100)}%</h2>
                <p>between {this.props.stats.glucoseLevels.low} - {this.props.stats.glucoseLevels.normal} mg/dl</p>
            </div>
            </div>

            <div className="stat-container low">
            <div className="stat-fill low" style={{width: Math.round(this.props.stats.glucose.low * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.low * 100)}%</h2>
                <p>between {this.props.stats.glucoseLevels.hypo} - {this.props.stats.glucoseLevels.low} mg/dl</p>
            </div>
            </div>

            <div className="stat-container hypo">
            <div className="stat-fill hypo" style={{width: Math.round(this.props.stats.glucose.hypo * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.hypo * 100)}%</h2>
                <p>under {this.props.stats.glucoseLevels.hypo} mg/dl</p>
            </div>
            </div>
        </div>
        );
    }
}

export default hot ? hot(module)(Statistics) : Statistics;