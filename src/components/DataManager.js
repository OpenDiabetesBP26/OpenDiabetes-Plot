import * as d3 from 'd3';

class DataManager {
	constructor(){
		this.domain = [0,0];
		this.dataDomain = [];
	}
	parseTime(){
		this.data.forEach( d => d.time = new Date(d.epoch));
	}
	readDataFromURL(url){
		fetch(url).then(response=>{
			response.json().then(data=> {
				this.data = data.data;
				this.parseTime();
				this.updateDomain(d3.extent(this.data, function(d) { return d.time}));
			});
		});
	}
	readData(data){
		this.data = data.data;
		this.parseTime();
		this.updateDomain(d3.extent(this.data, function(d) { return d.time}))
	}
	updateDomain(newDomain){
		this.domain = newDomain;
		this.dataDomain = this.data.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
	}
	getData(){
		return this.data;
	}
	getGlucoseCGMData(){
		var filteredGlucoseData = this.dataDomain.filter(d => d.type == "GLUCOSE_CGM")
		  if(this.milliSecondsToMinutes(this.domain[1] - this.domain[0]) > 60*24){
			return this.getGlucoseCGMData_min(filteredGlucoseData, 20);
		  }
			  
		  //Wenn groeßer als 10 std.
		  if(this.milliSecondsToMinutes(this.domain[1] - this.domain[0]) > 600){
			return this.getGlucoseCGMData_min(filteredGlucoseData, 10);
		  }
		  return filteredGlucoseData;
	  
	}
	getGlucoseCGMData_day(data){
		var glucose = d3.nest()
					.key(function(d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours())})
					.rollup(function(v) { return {
						value: d3.mean(v, function(d) { return d.value;}),
						time: new Date(d3.mean(v, function(d) { return d.time;}))
					};})
					.entries(data); 
		return glucose.map(d => d.value);
	}
	getGlucoseCGMData_min(data, min){
		var glucose = d3.nest()
					.key(function(d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes()%min))})
					.rollup(function(v) { return {
						value: d3.mean(v, function(d) { return d.value;}),
						time: new Date(d3.mean(v, function(d) { return d.time;}))
					};})
					.entries(data); 
		return glucose.map(d => d.value);
	}
	milliSecondsToMinutes(ms){
		return ms/60000
	}
	

}
export default DataManager