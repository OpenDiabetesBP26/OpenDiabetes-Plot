import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';
import Axis from './Axis';

class Timeline extends Component {
    render() {
        return (
            <div>
                <h2>Timeline Component</h2>
				<Axis/>
            </div>
         );
    }
}

export default hot ? hot(module)(Timeline) : Timeline;