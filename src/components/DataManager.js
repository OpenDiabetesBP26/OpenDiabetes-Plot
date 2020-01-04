import * as d3 from 'd3';

class DataManager {
	constructor() {
		this.domain = [0, 0];
		this.dataDomain = [];
	}
	parseTime() {
		this.data.forEach(d => d.time = new Date(d.epoch));
	}
	readDataFromURL(url) {
		fetch(url).then(response => {
			response.json().then(data => {
				this.data = data.data;
				this.parseTime();
				this.updateDomain(d3.extent(this.data, function (d) { return d.time }));
			});
		});
	}
	readData(data) {
		this.data = data.data;
		this.parseTime();
		this.updateDomain(d3.extent(this.data, function (d) { return d.time }))
	}
	updateDomain(newDomain) {
		this.domain = newDomain;
		this.dataDomain = this.data.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
	}
	getData() {
		return this.data;
	}
	getGlucoseCGMData() {
		var timeDelta = this.domain[1] - this.domain[0];
		var filteredGlucoseData = this.dataDomain.filter(d => d.type == "GLUCOSE_CGM")
		//Wenn groesser als 3 Monate
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4 * 3) {
			var gd = this.getGlucoseCGMData_week(filteredGlucoseData);
			gd.type = 'weekly';
			return gd;
		}
		//Wenn groesser als 4 Wochen
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4) {
			var gd = this.getGlucoseCGMData_day(filteredGlucoseData);
			gd.type = 'daily';
			return gd;
		}
		//Wenn groesser als eine Woche
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7) {
			var gd = this.getGlucoseCGMData_hours(filteredGlucoseData);
			gd.type = 'hourly';
			return gd;
		}
		//Wenn groesser als 24 std.
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24) {
			var gd = this.getGlucoseCGMData_min(filteredGlucoseData, 20);
			gd.type = 'intraday';
			return gd;
		}

		//Wenn groesser als 10 std.
		if (this.milliSecondsToMinutes(timeDelta) > 600) {
			var gd = this.getGlucoseCGMData_min(filteredGlucoseData, 10);
			gd.type = 'intraday';
			return gd;
		}
		filteredGlucoseData.type = 'intraday';
		return filteredGlucoseData;

	}
	getGlucoseCGMData_week(data){
		var glucose = d3.nest()
			.key(function (d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate() - d.time.getDay()) })
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function(a,b){ return (+a) - (+b) }), 0.25),
					value_higher_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function(a,b){ return (+a) - (+b) }), 0.75),
					time: new Date(d3.mean(v, function (d) { return d.time; }))
				};
			})
			.entries(data);
		return glucose.map(d => d.value);
	}
	getGlucoseCGMData_day(data){
		var glucose = d3.nest()
			.key(function (d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate()) })
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function(a,b){ return (+a) - (+b) }), 0.25),
					value_higher_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function(a,b){ return (+a) - (+b) }), 0.75),
					time: new Date(d3.mean(v, function (d) { return d.time; }))
				};
			})
			.entries(data);
		return glucose.map(d => d.value);
	}
	getGlucoseCGMData_hours(data) {
		var glucose = d3.nest()
			.key(function (d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours()) })
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function(a,b){ return (+a) - (+b) }), 0.25),
					value_higher_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function(a,b){ return (+a) - (+b) }), 0.75),
					time: new Date(d3.mean(v, function (d) { return d.time; }))
				};
			})
			.entries(data);
		return glucose.map(d => d.value);
	}
	getGlucoseCGMData_min(data, min) {
		var glucose = d3.nest()
			.key(function (d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % min)) })
			.rollup(function (v) {
				return {
					value: d3.mean(v, function (d) { return d.value; }),
					time: new Date(d3.mean(v, function (d) { return d.time; }))
				};
			})
			.entries(data);
		return glucose.map(d => d.value);
	}
	milliSecondsToMinutes(ms) {
		return ms / 60000
	}
}
export default DataManager