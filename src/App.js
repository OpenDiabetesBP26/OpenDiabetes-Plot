import React, { Component } from 'react';
import Chart from './components/Chart';
import Loading from './components/Loading';
import {hot} from 'react-hot-loader';
import ReactDropzone from 'react-dropzone';

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
                <ReactDropzone onDrop={this.fileDrop.bind(this)}>
                 {({getRootProps, getInputProps}) => (
                    <section>
                    <div class="fileDrop" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drop File here</p>
                    </div>
                    </section>
                )}
                </ReactDropzone>
                <Chart data={this.state.data} />
            </React.Fragment>
        );
    }

    fileDrop(acceptedFiles) {
        acceptedFiles.forEach((file) => {
            if (file.name.split('.').pop() == 'json') {
                this.setState({loading:true});
                const reader = new FileReader();
                reader.onload = () => {
                // Do whatever you want with the file contents
                  const content = JSON.parse(reader.result);
                  if (content && content.titel && content.data && content.exportDate) {
                      //setFile(file.name);
                      this.setState({data:content.data});
                      this.setState({loading:false});
                      //setData(content.data);
                  }
                }
                reader.onerror = () => {
                    this.setState({loading:false});
                }
                reader.readAsText(file);
            }
          });
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