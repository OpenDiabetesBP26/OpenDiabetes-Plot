import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

//import { geoMercator, geoPath } from 'd3-geo'

class D3Sample extends Component {
    render() {
        return <div>D3 Sample</div>;
    }
    // render() {
    //     const projection = geoMercator()
    //     const pathGenerator = geoPath().projection(projection)
    //     const countries = worlddata.features
    //        .map((d,i) => <path
    //        key={'path' + i}
    //        d={pathGenerator(d)}
    //        className='countries'
    //        />)
    //  return <svg width={500} height={500}>
    //         {countries}
    //         </svg>
    //  }
}

export default hot ? hot(module)(D3Sample) : D3Sample;