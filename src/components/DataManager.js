import * as d3 from 'd3';

class DataManager {
	constructor() {
		this.domain = [0, 0];
		this.buffer = [0, 0];
		this.dataDomain = [];
	}
	parseTime() {
		this.data.forEach(d => d.time = new Date(d.epoch));
	}
	readDataFromURL(url) {
		fetch(url).then(response => {
			response.json().then(data => {
				this.readData(data);
			});
		});
	}
	readData(data) {
		this.data = data.data;
		this.parseTime();

		//Speicher Glukose Daten
		this.glucoseData = this.data.filter(d => d.type == "GLUCOSE_CGM");
		//Gruppiere jetzt damit nicht gefiltert werden muss
		this.glucoseData_min_10 = this.getGlucoseCGMData_min(this.glucoseData, 10);
		this.glucoseData_min_20 = this.getGlucoseCGMData_min(this.glucoseData, 20);
		this.glucoseData_hour = this.getGlucoseCGMData_hours(this.glucoseData);
		this.glucoseData_day = this.getGlucoseCGMData_day(this.glucoseData);
		this.glucoseData_week = this.getGlucoseCGMData_week(this.glucoseData);
		this.glucoseData_month = this.ggetGlucoseCGMData_month(this.glucoseData);


		this.updateDomain(d3.extent(this.data, function (d) { return d.time }))

	}
	updateDomain(newDomain) {
		this.domain = newDomain;

		//Update Pre Filtered 
		//TODO Async
		//Wenn Buffer nicht aussreicht
		var timeDelta = this.domain[1] - this.domain[0];
		console.log('updateDomain');
		if (this.buffer[0] > this.domain[0] ||
			this.buffer[1] < this.domain[1] ||
			this.buffer[0] + timeDelta*(5/6) < this.domain[0] ||
			this.buffer[1] - timeDelta*(5/6) > this.domain[1]
			) {

			
			this.buffer = [this.domain[0] - timeDelta / 2, (+this.domain[1]) + timeDelta / 2];
			console.log('updateBuffer');
			//Needs to change
			//1. init
			//then only update when needed
			if (+this.milliSecondsToMinutes(timeDelta) <= 600) this.glucoseData_f = this.glucoseData.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			if (this.milliSecondsToMinutes(timeDelta) > 600) this.glucoseData_min_10_f = this.glucoseData_min_10.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			if (this.milliSecondsToMinutes(timeDelta) > 60 * 24) this.glucoseData_min_20_f = this.glucoseData_min_20.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7) this.glucoseData_hour_f = this.glucoseData_hour.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4) this.glucoseData_day_f = this.glucoseData_day.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4 * 3) this.glucoseData_week_f = this.glucoseData_week.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4 * 3 * 12) this.glucoseData_month_f = this.glucoseData_month.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
		}
	}
	getData() {
		return this.data;
	}
	getGlucoseCGMData() {
		var timeDelta = this.domain[1] - this.domain[0];
		//Wenn groesser als 12 Monate
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4 * 3 * 12) {
			var gd = this.glucoseData_month_f.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
			gd.type = 'monthly';
			return gd;
		}
		//Wenn groesser als 3 Monate
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4 * 3) {
			var gd = this.glucoseData_week_f.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
			gd.type = 'weekly';
			return gd;
		}
		//Wenn groesser als 4 Wochen
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4) {
			var gd = this.glucoseData_day_f.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
			gd.type = 'daily';
			return gd;
		}
		//Wenn groesser als eine Woche
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7) {
			var gd = this.glucoseData_hour_f.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
			gd.type = 'hourly';
			return gd;
		}
		//Wenn groesser als 24 std.
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24) {
			var gd = this.glucoseData_min_20_f.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
			gd.type = 'intraday';
			return gd;
		}

		//Wenn groesser als 10 std.
		if (this.milliSecondsToMinutes(timeDelta) > 600) {
			var gd = this.glucoseData_min_10_f.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
			gd.type = 'intraday';
			return gd;
		}
		var filteredGlucoseData = this.glucoseData_f.filter((d) => this.domain[0] <= d.time && d.time <= this.domain[1]);
		filteredGlucoseData.type = 'intraday';
		return filteredGlucoseData;

	}
	ggetGlucoseCGMData_month(data) {
		var glucose = d3.nest()
			.key(function (d) { return new Date(d.time.getFullYear(), d.time.getMonth()) })
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.25),
					value_higher_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.75),
					time: new Date(d3.mean(v, function (d) { return d.time; }))
				};
			})
			.entries(data);
		return glucose.map(d => d.value);
	}
	getGlucoseCGMData_week(data) {
		var glucose = d3.nest()
			.key(function (d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate() - d.time.getDay()) })
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.25),
					value_higher_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.75),
					time: new Date(d3.mean(v, function (d) { return d.time; }))
				};
			})
			.entries(data);
		return glucose.map(d => d.value);
	}
	getGlucoseCGMData_day(data) {
		var glucose = d3.nest()
			.key(function (d) { return new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate()) })
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.25),
					value_higher_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.75),
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
					value_lower_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.25),
					value_higher_perc: d3.quantile(v.map(function (d) { return +d.value; }).sort(function (a, b) { return (+a) - (+b) }), 0.75),
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