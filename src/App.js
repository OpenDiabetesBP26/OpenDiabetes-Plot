import React, { Component } from 'react';
import Chart from './components/Chart';
import {hot} from 'react-hot-loader';

export class App extends Component {
    render() {
        return (
            <Chart />
        );
    }

}

export default hot ? hot(module)(App) : App;