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
	async readDataFromURL(url) {
		let data = awiat (await fetch(url)).json();
		this.readData(data);
	}
	readData(data) {
		this.data = data.data;
		this.parseTime();

		//Get all glucose data
		this.glucoseData = this.data.filter(d => d.type == "GLUCOSE_CGM");
		
		//Compute all groups now
		this.glucoseData_min_10 = this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 10)));
		this.glucoseData_min_20 = this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 20)));
		this.glucoseData_hour = this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), (d.time.getHours() - d.time.getHours() % 6) / 6));
		this.glucoseData_day = this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate()));
		this.glucoseData_week = this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate() - d.time.getDay()));
		this.glucoseData_month = this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth()));

		//Update current domain to max domain from data
		this.updateDomain(d3.extent(this.data, d => d.time))

	}
	updateDomain(newDomain) {
		this.domain = newDomain;

		//Update Pre Filtered 
		//TODO Async
		//Wenn Buffer nicht aussreicht
		const timeDelta = this.domain[1] - this.domain[0];
		if (this.buffer[0] > this.domain[0] ||
			this.buffer[1] < this.domain[1] ||
			this.buffer[0] + timeDelta*(5/6) < this.domain[0] ||
			this.buffer[1] - timeDelta*(5/6) > this.domain[1]
			) {

			
			this.buffer = [this.domain[0] - timeDelta / 2, (+this.domain[1]) + timeDelta / 2];

			//Update Buffered Data
			this.glucoseData_f = this.glucoseData.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			this.glucoseData_min_10_f = this.glucoseData_min_10.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			this.glucoseData_min_20_f = this.glucoseData_min_20.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			this.glucoseData_hour_f = this.glucoseData_hour.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			this.glucoseData_day_f = this.glucoseData_day.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			this.glucoseData_week_f = this.glucoseData_week.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			this.glucoseData_month_f = this.glucoseData_month.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
		}
	}
	getData() {
		return this.data;
	}
	getGlucoseCGMData() {
		const timeDelta = this.domain[1] - this.domain[0];
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		//Wenn groesser als 12 Monate
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4 * 3 * 12) {
			let gd = this.glucoseData_month_f.filter(filterCurrentDomain);
			gd.type = 'monthly';
			return gd;
		}
		//Wenn groesser als 3 Monate
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4 * 3) {
			let gd = this.glucoseData_week_f.filter(filterCurrentDomain);
			gd.type = 'weekly';
			return gd;
		}
		//Wenn groesser als 4 Wochen
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 4) {
			let gd = this.glucoseData_day_f.filter(filterCurrentDomain);
			gd.type = 'daily';
			return gd;
		}
		//Wenn groesser als 2 Woche
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 7 * 2) {
			let gd = this.glucoseData_hour_f.filter(filterCurrentDomain);
			gd.type = 'hourly';
			return gd;
		}
		//Wenn groesser als 3 Tage
		if (this.milliSecondsToMinutes(timeDelta) > 60 * 24 * 3) {
			let gd = this.glucoseData_min_20_f.filter(filterCurrentDomain);
			gd.type = 'intraday';
			return gd;
		}

		//Wenn groesser als 10 std.
		if (this.milliSecondsToMinutes(timeDelta) > 600) {
			let gd = this.glucoseData_min_10_f.filter(filterCurrentDomain);
			gd.type = 'intraday';
			return gd;
		}
		let filteredGlucoseData = this.glucoseData_f.filter(filterCurrentDomain);
		filteredGlucoseData.type = 'intraday';
		return filteredGlucoseData;

	}
	compGlucoseCGMData(data, keyfunc){
		let glucose = d3.nest()
			.key(keyfunc)
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map( d => +d.value).sort((a,b) => (+a) - (+b)), 0.25),
					value_higher_perc: d3.quantile(v.map( d => +d.value).sort((a,b) => (+a) - (+b)), 0.75),
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