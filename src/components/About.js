import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
class About extends Component {
    render() {
        return (
            <div>
                <h2>About</h2>
            </div>
         );
    }
}

export default hot ? hot(module)(About) : About;