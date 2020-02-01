import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone'
import Loading from '../common/Loading';
import Chart from './Chart';

const ChartContainer = (props) => {
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState('/data/2019-11-20-1349_export-data.json');
    const [data, setData]= useState(null);

    useEffect(()=> {
        console.log("use effect called");
        if (!data) {
            fetch(file).then(res=>res.json().then(data=> {
                console.log(data.data);
                setData(data.data);
                setLoading(false);
            }));
        }
    }, [data]);

    const fileDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            if (file.name.split('.').pop() == 'json') {
                const reader = new FileReader();
                // reader.onabort = () => console.log('file reading was aborted');
                // reader.onerror = () => console.log('file reading has failed');
                reader.onload = () => {
                // Do whatever you want with the file contents
                  const content = JSON.parse(reader.result);
                  if (content && content.titel && content.data && content.exportDate) {
                      setFile(file.name);
                      setData(content.data);
                  }
                }
                reader.readAsText(file);
            }
          });
    }

    return (<div>
            <Loading visible={loading} />
            <div className="row">
                <Dropzone onDrop={fileDrop}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    </section>
                )}
                </Dropzone>
            </div>
            <div className="row">
                {file}
            </div>
            {data ? <Chart props={props} data={data} /> : ''}
        </div>);
}

export default ChartContainer;