import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import IntradayChart from './IntradayChart';
import ThreeHourlyChart from './ThreeHourlyChart';
import SixHourlyChart from './SixHourlyChart';
import DailyChart from './DailyChart';
import WeeklyChart from './WeeklyChart';
import MonthlyChart from './MonthlyChart';
import Statistics from './Statistics';
import PercentileDay from './PercentileDay';
import DataManager from '../../services/DataManager';

const MainChart = (props) => {
    const [display, setDisplay] = useState('intraday');
    const [margin, setMargin] = useState({ top: 20, right: 40, bottom: 110, left: 40 });
    let x = d3.scaleTime().range([0, 1000]);
    let y = d3.scaleLinear().range([400, 0]);
    let svg = React.createRef();
    let dm = new DataManager();
    //const [x, setX] = useState(0);
    //const [y, setY] = useState(0);

    if (props.data) {

        
        dm.readData(props.data);
        x.domain(dm.getMaxDomain());
        let xBase = null; Object.assign({}, x);

        //Set max domains
        y.domain([0, 400]);
        // setX(xN);
        // setY(yN);

        

        //Add d3 stuff
        //let d3svg = d3.select("svg");

        //Domains
        let zoom = d3.zoom()
            .scaleExtent([1, dm.getMaxZoom()])
            .translateExtent([[0, 0], [1000, 0]])
            .on("zoom", () => () => {
                const getDisplay = (hours) => {
                    if (hours > 24 * 30 * 12) { return 'monthly'; }
                    else if (hours > 24 * 7 * 4 * 3) {  return 'weekly'  }
                    else if (hours > 24 * 7 * 3) {  return 'daily' }
                    else if (hours > 24 * 7) {  return '6hourly'  }
                    else if (hours > 24 * 3) {  return '3hourly'  }
                    return 'intraday';
                }
        
                //this.fixExtent();
        
                let xR = d3.event.transform.rescaleX(xBase);
        
                //time difference in hours
                let delta = (x.domain()[1] - x.domain()[0]) / (60000 * 60);
                let displayN = getDisplay(delta);
                if (display != displayN) {
                    dm.changeDisplay(displayN);
                }
        
                dm.updateDomain(x.domain());
        
                setX(xR);
                setDisplay(displayN);
            });

        //d3svg.call(zoom);

        let updateDimensions = () => {
            let newWidth = (svg.current ? svg.current.getBoundingClientRect().width : window.innerWidth) - margin.left - margin.right;
            //Update Base and x range
            let xBaseR = xBase.range([0, newWidth]);
            let xR = x.range([0, newWidth]);

            //Update Zoom
            //Fix, as d3.event.transform is null in webpack
            let oldRange = xBase.range()[1] - xBase.range()[0];
            let s = x.domain().map(x => xBaseR(xR));
            let k = oldRange / (s[1] - s[0]);

            let newXOffset = -xBase(x.domain()[0]);
            console.log(zoom.translateExtent());
            //this.fixExtent();
            d3.select("svg").call(zoom.transform, d3.zoomIdentity.scale(k).translate(newXOffset, 0));
            setX(xR);
            xBase = xBaseR;
        };

        //Append resize listener
        //window.addEventListener("resize", updateDimensions);
        //Call resize to set first state
        //updateDimensions();
    }

    return (
        !(props.data) ? <div>Empty</div> 
        :
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-8 col-md-12">
                    <svg id="d3sample" width="100%" height="500" ref={svg}>
                        {
                            ( function() { switch (display) {
                                case 'intraday':
                                    return <IntradayChart data={dm.getIntradayData()} svg={svg} x={x} y={y} margin={margin} />
                                case '3hourly':
                                    return <ThreeHourlyChart data={dm.getThreeHourlyData()} svg={svg} x={x} y={y} margin={margin} />
                                case '6hourly':
                                    return <SixHourlyChart data={dm.getSixHourlyData()} svg={svg.current} x={x} y={y} margin={margin} />
                                case 'daily':
                                    return <DailyChart data={dm.getDailyData()} svg={svg.current} x={x} y={y} margin={margin} />
                                case 'weekly':
                                    return <WeeklyChart data={dm.getWeeklyData()} svg={svg.current} x={x} y={y} margin={margin} />
                                case 'monthly':
                                    return <MonthlyChart data={dm.getMonthlyData()} svg={svg.current} x={x} y={y} margin={margin} />
                                default:
                                    return null;
                            }; } ())
                        }
                    </svg>
                    { display == 'daily' || display == 'weekly' || display == 'monthly' ? <PercentileDay x={x} data={dm.getPercentileDay()} margin={margin} /> : '' }
                </div>
                <div className="col-lg-4 col-md-12">
                    <Statistics domain={x ? x.domain() : null} dm={dm} />
                </div>
            </div>
        </div>
    );
}

export default MainChart;