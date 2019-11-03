import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

class ItemView extends Component {

    constructor(props) {
        super(props);
        // set Id here
        let id = parseInt(props.match.params.id);
        this.state = {
            ...props,
            id: id,
            item: [],
        };

        // load item here
        this.reloadItem(id);
    }

    reloadItem(id) {
        var i = 0;
      // after async load 
      //this.setState({item:o});
    }

    render() {
        return (
            <div>
                Item Id:{this.state.id}
            </div>
        );
    }
}

export default hot ? hot(module)(ItemView) : ItemView;