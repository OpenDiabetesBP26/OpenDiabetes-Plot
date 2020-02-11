import React, { Component } from 'react';
import Chart from './components/Chart';
import Loading from './components/Loading';
import {hot} from 'react-hot-loader';

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = { loading:true, data:null }
        this.loadTestData();
    }

    render() {
        return (
            <React.Fragment>
                <Loading visible={this.state.loading} />
                <Chart data={this.state.data} />
            </React.Fragment>
        );
    }

    async componentDidMount() {
        await this.loadTestData();
    }
    
    async loadTestData(){
        try {
            //TODO Implement DataManager
            let data = await (await fetch("2019-11-20-1349_export-data.json")).json()
            //console.log(data);
            this.setState({data:data.data});
        }
        finally {
            this.setState({ loading: false });
        }
    }

}

export default hot ? hot(module)(App) : App;