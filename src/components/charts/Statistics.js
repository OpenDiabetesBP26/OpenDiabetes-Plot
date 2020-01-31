import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

class Statistics extends Component {
    constructor(props){
        super(props);
        this.state = {loading: true}
    }
    render(){
        if(this.state.stats == null){
            return(
                <div>
                    Loading...
                </div>
                );
        }
        return(
        
        <div className="container bg-light">
            <h2>Glucose distribution</h2>
            <div className="time-frame">
            <p>from {this.state.stats.timeFrame[0].toDateString()} {this.state.stats.timeFrame[0].getHours()}:{this.state.stats.timeFrame[0].getMinutes()} - {this.state.stats.timeFrame[1].toDateString()} {this.state.stats.timeFrame[1].getHours()}:{this.state.stats.timeFrame[1].getMinutes()}</p>
            </div>
            <div className="average-bg">
            <p>
                Avg. <span className='average-value'>{this.state.stats.glucose.average == 0 ? '-' : Math.round(this.state.stats.glucose.average)} </span> mg/dl
            </p>
            </div>
            <div className="stat-container hyper">
            <div className="stat-fill hyper" style={{width: Math.round(this.state.stats.glucose.hyper * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.state.stats.glucose.hyper * 100)}%</h2>
                <p>above {this.state.stats.glucoseLevels.hyper} mg/dl</p>
            </div>
            </div>

            <div className="stat-container high">
            <div className="stat-fill high" style={{width: Math.round(this.state.stats.glucose.high * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.state.stats.glucose.high * 100)}%</h2>
                <p>between {this.state.stats.glucoseLevels.high} - {this.state.stats.glucoseLevels.hyper} mg/dl</p>
            </div>
            </div>

            <div className="stat-container normal">
            <div className="stat-fill normal" style={{width: Math.round(this.state.stats.glucose.normal * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.state.stats.glucose.normal * 100)}%</h2>
                <p>between {this.state.stats.glucoseLevels.low} - {this.state.stats.glucoseLevels.high} mg/dl</p>
            </div>
            </div>

            <div className="stat-container low">
            <div className="stat-fill low" style={{width: Math.round(this.state.stats.glucose.low * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.state.stats.glucose.low * 100)}%</h2>
                <p>between {this.state.stats.glucoseLevels.hypo} - {this.state.stats.glucoseLevels.low} mg/dl</p>
            </div>
            </div>

            <div className="stat-container hypo">
            <div className="stat-fill hypo" style={{width: Math.round(this.state.stats.glucose.hypo * 100)+'%'}}></div>
            <div className="description">
                <h2>{Math.round(this.state.stats.glucose.hypo * 100)}%</h2>
                <p>under {this.state.stats.glucoseLevels.hypo} mg/dl</p>
            </div>
            </div>
        </div>
        );
    }
    componentDidUpdate(prevProps){
        if(this.props.domain !== prevProps.domain){
            //Loading Data
            if(this.props.dm != null){
                let stats = this.props.dm.getStatistics();
                this.setState({stats: stats, loading: false});
            }
        }
    }

}

export default hot ? hot(module)(Statistics) : Statistics;