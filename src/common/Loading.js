import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return this.props.visible ? <div style={{
            zIndex: 9998,
            overflow: 'show',
            content: '',
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(rgba(20, 20, 20,0.6), rgba(0, 0, 0, 0.6))',
            background: '-webkit-radial-gradient(rgba(20, 20, 20,0.6), rgba(0, 0, 0,0.6))'
        }}> <div className="spinner-border" style={{
            zIndex: 9999,
            width: '3rem', 
            height: '3rem',
            margin: '45% 45%'
        }} role="status"><span className="sr-only">Loading...</span></div></div> : '';
    }
}

export default hot ? hot(module)(Loading) : Loading;