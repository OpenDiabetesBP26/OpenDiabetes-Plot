import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
class NotFound extends Component {
    render() {
        return (
            <div>
                <h2>404 Not found</h2>
            </div>
         );
    }
}

export default hot ? hot(module)(NotFound) : NotFound;