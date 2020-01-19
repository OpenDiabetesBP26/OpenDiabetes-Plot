import * as d3 from 'd3';

class DataManager {
	constructor() {
		this.domain = [0, 0];
		this.buffer = [0, 0];
		this.dataDomain = [];
		this.display = 'yearly'
		this.glucoseLevels = {
			reallyLow: 50,
			low: 80,
			ok: 150,
			high: 250,
			reallyHigh: 400
		}
	}
	parseTime(data) {
		data.forEach(d => d.time = new Date(d.epoch));
	}
	async readDataFromURL(url) {
		let data = await(await fetch(url)).json();
		this.readData(data);
	}
	readData(data) {
		this.parseTime(data);
		this.data = data;

		//Set max domain
		this.maxDomain = d3.extent(this.data, d => d.time);

		//Get all glucose data
		this.glucoseData = this.data.filter(d => d.type == 'GLUCOSE_CGM');
		this.bolus_normal = this.data.filter(d => d.type == 'BOLUS_NORMAL');
		this.bolus_square = this.data.filter(d => d.type == 'BOLUS_SQUARE');
		this.basal_profile = this.data.filter(d =>d.type == 'BASAL_PROFILE');
		this.basal_temp = this.data.filter(d =>d.type == 'BASAL_TEMP');
		this.refined_vault = this.data.filter(d =>d.type == 'REFINED_VAULT_ENTRY');

		//DEBUG OUTPRINT
		console.log(this.glucoseData);
		console.log(this.bolus_normal);
		console.log(this.bolus_square);
		console.log(this.basal_profile);
		console.log(this.basal_temp);
		console.log(this.refined_vault);

		//Use ungrouped data for intraday viz
		this.glucoseData_grouped = {
			intraday: {
				glucose: this.glucoseData
			},
			hourly3: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 10))),
			hourly6: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 20))),
			daily: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours())),
			weekly: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), (d.time.getHours() - d.time.getHours() % 6) / 6)),
			monthly: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate()))
		}
		//Init buffered data
		//Create copies with slice()
		this.glucoseData_grouped_buffered = {
			intraday: {
				glucose: this.glucoseData_grouped.intraday.glucose.slice()
			},
			hourly3: this.glucoseData_grouped.hourly3.slice(),
			hourly6: this.glucoseData_grouped.hourly6.slice(),
			daily: this.glucoseData_grouped.daily.slice(),
			weekly: this.glucoseData_grouped.weekly.slice(),
			monthly: this.glucoseData_grouped.monthly.slice()
		}



		//Update current domain to max domain from data
		this.updateDomain(d3.extent(this.data, d => d.time))

	}
	getMaxDomain(){
		return this.maxDomain;
	}
	getMaxZoom(){
		//Max Zoom -> 1 hour
		let hour = 60*60000;
		let domain_delta = this.maxDomain[1] - this.maxDomain[0];
		let zoom = domain_delta / hour;
		return zoom;
		
	}
	async updateDomain(newDomain) {
		this.domain = newDomain;
		const timeDelta = this.domain[1] - this.domain[0];
		if (
			//Buffer too small -> zoom out
			this.buffer[0] + timeDelta * (1/6) > this.domain[0] ||
			this.buffer[1] - timeDelta * (1/6) < this.domain[1] ||
			//Buffer too large -> zoom in
			this.buffer[0] + timeDelta * (5 / 6) < this.domain[0] ||
			this.buffer[1] - timeDelta * (5 / 6) > this.domain[1]
		) {

			//Generate new bufer
			this.buffer = [this.domain[0] - timeDelta / 2, (+this.domain[1]) + timeDelta / 2];
			await this.bufferData();
		}
	}
	bufferData(){
		//Update only the buffer for the current display
		return new Promise(resolve => {
			let bufferfilter = data => data.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			switch(this.display){
				case 'intraday': this.glucoseData_grouped_buffered.intraday.glucose =  bufferfilter(this.glucoseData_grouped.intraday.glucose);
				case '3hourly': this.glucoseData_grouped_buffered.hourly3 =  bufferfilter(this.glucoseData_grouped.hourly3);
				case '6hourly': this.glucoseData_grouped_buffered.hourly6 =  bufferfilter(this.glucoseData_grouped.hourly6);
				case 'daily': this.glucoseData_grouped_buffered.daily =  bufferfilter(this.glucoseData_grouped.daily);
				case 'weekly': this.glucoseData_grouped_buffered.weekly =  bufferfilter(this.glucoseData_grouped.weekly);
				case 'monthly': this.glucoseData_grouped_buffered.monthly =  bufferfilter(this.glucoseData_grouped.monthly);
				default:
				resolve()
			}
		})
	}
	changeDisplay(display){
		this.display = display;
		//Rebuffer Display for new Data
		this.bufferData();
	}
	getData() {
		return this.data;
	}
	getIntradayData(){
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		//Filter Buffered Data
		let glucose = this.glucoseData_grouped_buffered.intraday.glucose.filter(filterCurrentDomain);

		let stats = {
			reallyLow: glucose.filter(d => d.value < this.glucoseLevels.reallyLow).length / glucose.length,
			low: glucose.filter(d => d.value > this.glucoseLevels.reallyLow && d.value < this.glucoseLevels.low).length / glucose.length,
			ok: glucose.filter(d => d.value > this.glucoseLevels.low && d.value < this.glucoseLevels.ok).length / glucose.length,
			high: glucose.filter(d => d.value > this.glucoseLevels.ok && d.value < this.glucoseLevels.high).length / glucose.length,
			reallyHigh: glucose.filter(d => d.value > this.glucoseLevels.high && d.value < this.glucoseLevels.reallyHigh).length / glucose.length
		}

		//Pack all data into one object
		let data = {
			glucose: glucose,
			stats: stats
		}
		return data;
	}
	compGlucoseCGMData(data, keyfunc) {
		let glucose = d3.nest()
			.key(keyfunc)
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(d => +d.value).sort((a, b) => (+a) - (+b)), 0.25),
					value_higher_perc: d3.quantile(v.map(d => +d.value).sort((a, b) => (+a) - (+b)), 0.75),
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