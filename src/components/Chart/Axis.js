import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import * as d3 from 'd3';

class Axis extends Component {
    render() {
        return (
            <div>
                <h2>Axis Component</h2>
            </div>
         );
    }
}

export default hot ? hot(module)(Axis) : Axis;