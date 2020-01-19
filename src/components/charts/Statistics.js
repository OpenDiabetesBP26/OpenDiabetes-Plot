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
            <div className="stat-container hyper">
            <div className="stat-fill hyper" style={{width: Math.round(this.props.stats.glucose.reallyHigh * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.reallyHigh * 100)}%</h2>
                <p>above {this.props.stats.glucoseLevels.high} mg/dl</p>
            </div>
            </div>

            <div className="stat-container high">
            <div className="stat-fill high" style={{width: Math.round(this.props.stats.glucose.high * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.high * 100)}%</h2>
                <p>between {this.props.stats.glucoseLevels.ok} - {this.props.stats.glucoseLevels.high} mg/dl</p>
            </div>
            </div>

            <div className="stat-container normal">
            <div className="stat-fill normal" style={{width: Math.round(this.props.stats.glucose.ok * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.ok * 100)}%</h2>
                <p>between {this.props.stats.glucoseLevels.low} - {this.props.stats.glucoseLevels.ok} mg/dl</p>
            </div>
            </div>

            <div className="stat-container low">
            <div className="stat-fill low" style={{width: Math.round(this.props.stats.glucose.low * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.low * 100)}%</h2>
                <p>between {this.props.stats.glucoseLevels.reallyLow} - {this.props.stats.glucoseLevels.low} mg/dl</p>
            </div>
            </div>

            <div className="stat-container hypo">
            <div className="stat-fill hypo" style={{width: Math.round(this.props.stats.glucose.reallyLow * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.props.stats.glucose.reallyLow * 100)}%</h2>
                <p>under {this.props.stats.glucoseLevels.reallyLow} mg/dl</p>
            </div>
            </div>
        </div>
        );
    }
}

export default hot ? hot(module)(Statistics) : Statistics;