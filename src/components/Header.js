import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

class Header extends Component {
    render() {
        return (
           <h1>Header 2</h1>
        );
    }
}

export default hot ? hot(module)(Header) : Header;