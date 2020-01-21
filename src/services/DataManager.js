import * as d3 from 'd3';

class DataManager {
	constructor() {
		this.domain = [0, 0];
		this.buffer = [0, 0];
		this.dataDomain = [];
		this.display = 'yearly'
		this.glucoseLevels = {
			hypo: 60,
			low: 80,
			normal: 150,
			high: 250,
			hyper: 400
		}
	}
	parseTime(data) {
		data.forEach(d => {
			d.time = new Date(d.epoch);
			delete d.isoTime;
			delete d.epoch;
		});
	}
	async readDataFromURL(url) {
		let data = await (await fetch(url)).json();
		this.readData(data);
	}
	readData(data) {
		this.parseTime(data);
		this.data = data;

		//Set max domain
		this.maxDomain = d3.extent(this.data, d => d.time);

		//Week in ms
		let week = 60000 * 60 * 24 * 7;
		//Get all glucose data
		this.glucoseData = this.data.filter(d => d.type == 'GLUCOSE_CGM');
		this.bolus_normal = this.data.filter(d => d.type == 'BOLUS_NORMAL');
		this.bolus_square = this.data.filter(d => d.type == 'BOLUS_SQUARE');
		this.basal_profile = this.data.filter(d => d.type == 'BASAL_PROFILE');
		this.basal_temp = this.data.filter(d => d.type == 'BASAL_TEMP');
		this.refined_vault = this.data.filter(d => d.type == 'REFINED_VAULT_ENTRY');

		let refined = d3.nest()
			.key(d => d.time)
			.entries(this.refined_vault);
		refined = refined.map(key => {
			//Get time object from item
			let time = key.values[0].time;
			key.time = time;
			key.predictions = key.values.map(item => {
				//Rename a few
				item.values = item.valueExtension;
				//Delete unnecessary items to save space
				//delete item.epoch;
				delete item.time;
				delete item.valueExtension;
				delete item.refinedType;
				delete item.type;
				//delete item.isoTime;
				return item;
			});
			delete key.key;
			delete key.values;
			return key;
		});
		this.predictions = refined;
		//DEBUG OUTPRINT
		//
		//console.log(this.glucoseData);
		//console.log(this.bolus_normal);
		//console.log(this.bolus_square);
		//console.log(this.basal_profile);
		//console.log(this.basal_temp);
		//console.log(this.refined_vault);
		//console.log(refined);

		//Use ungrouped data for intraday viz
		this.raw_data = {
			intraday: {
				glucose: this.glucoseData,
				bolus: this.bolus_normal,
				basal_profile: this.basal_profile,
				basal_temp: this.basal_temp,
				predictions: this.predictions
			},
			hourly3: {
				glucose: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 10))),
			},
			hourly6: {
				glucose: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 20))),
			},
			daily: {
				glucose: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate())),
			},
			weekly: {
				glucose: this.compGlucoseCGMData(this.glucoseData, d => Math.floor(d.time.getTime() / week)),
			},
			monthly: {
				glucose: this.compGlucoseCGMData(this.glucoseData, d => new Date(d.time.getFullYear(), d.time.getMonth()))
			}
		}
		//Init buffered data
		//Create copies with slice()
		this.buffer_data = {
			intraday: {
				glucose: this.raw_data.intraday.glucose.slice(),
				bolus: this.raw_data.intraday.bolus.slice(),
				basal_profile: this.raw_data.intraday.basal_profile.slice(),
				basal_temp: this.raw_data.intraday.basal_temp.slice(),
				predictions: this.raw_data.intraday.predictions.slice()
			},
			hourly3: {
				glucose: this.raw_data.hourly3.glucose.slice(),
			},
			hourly6: {
				glucose: this.raw_data.hourly6.glucose.slice(),
			},
			daily: {
				glucose: this.raw_data.daily.glucose.slice(),
			},
			weekly: {
				glucose: this.raw_data.weekly.glucose.slice(),
			},
			monthly: {
				glucose: this.raw_data.monthly.glucose.slice()
			}
		}

		//Stats buffer
		this.buffer_stats = {
			glucose: this.raw_data.intraday.glucose,
			bolus: this.raw_data.intraday.bolus,
			basal_profile: this.basal_profile,
			basal_temp: this.basal_temp
		}



		//Update current domain to max domain from data
		this.updateDomain(d3.extent(this.data, d => d.time))

	}
	getDomain() {
		return this.domain;
	}
	getMaxDomain() {
		return this.maxDomain;
	}
	getMaxZoom() {
		//Max Zoom -> 1 hour
		let hour = 60 * 60000;
		let domain_delta = this.maxDomain[1] - this.maxDomain[0];
		let zoom = domain_delta / hour;
		return zoom;

	}
	updateDomain(newDomain) {
		this.domain = newDomain;
		const timeDelta = this.domain[1] - this.domain[0];
		if (
			//Buffer too small -> zoom out
			this.buffer[0] + timeDelta * (1 / 6) > this.domain[0] ||
			this.buffer[1] - timeDelta * (1 / 6) < this.domain[1] ||
			//Buffer too large -> zoom in
			this.buffer[0] + timeDelta * (5 / 6) < this.domain[0] ||
			this.buffer[1] - timeDelta * (5 / 6) > this.domain[1]
		) {
			this.buffer = [this.domain[0] - timeDelta / 2, (+this.domain[1]) + timeDelta / 2];
			this.bufferData()
			let now = new Date;
		}
	}
	bufferData() {
		//Update only the buffer for the current display
			let bufferfilter = data => data.filter((d) => this.buffer[0] <= d.time && d.time <= this.buffer[1]);
			switch (this.display) {
				case 'intraday':
					this.buffer_data.intraday.glucose = bufferfilter(this.raw_data.intraday.glucose);
					this.buffer_data.intraday.bolus = bufferfilter(this.raw_data.intraday.bolus);
					this.buffer_data.intraday.basal_profile = bufferfilter(this.raw_data.intraday.basal_profile);
					this.buffer_data.intraday.basal_temp = bufferfilter(this.raw_data.intraday.basal_temp);
					this.buffer_data.intraday.predictions = bufferfilter(this.raw_data.intraday.predictions);
					break;
				case '3hourly':
					this.buffer_data.hourly3.glucose = bufferfilter(this.raw_data.hourly3.glucose);
					break;
				case '6hourly':
					this.buffer_data.hourly6.glucose = bufferfilter(this.raw_data.hourly6.glucose);
					break;
				case 'daily':
					this.buffer_data.daily.glucose = bufferfilter(this.raw_data.daily.glucose);
					break;
				case 'weekly':
					this.buffer_data.weekly.glucose = bufferfilter(this.raw_data.weekly.glucose);
					break;
				case 'monthly':
					this.buffer_data.monthly.glucose = bufferfilter(this.raw_data.monthly.glucose);
					break;
				default:
					break;
			}
			//Update stats buffer
			this.buffer_stats.glucose = bufferfilter(this.raw_data.intraday.glucose);
			this.buffer_stats.bolus = bufferfilter(this.raw_data.intraday.bolus);
			this.buffer_stats.basal_profile = bufferfilter(this.raw_data.intraday.basal_profile);
			this.buffer_stats.basal_temp = bufferfilter(this.raw_data.intraday.basal_temp);
	}
	changeDisplay(display) {
		this.display = display;
		//Rebuffer Display for new Data
		this.bufferData();
	}
	getData() {
		return this.data;
	}
	getIntradayData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.intraday.glucose.filter(filterCurrentDomain),
			bolus: this.buffer_data.intraday.bolus.filter(filterCurrentDomain),
			basal_profile: this.buffer_data.intraday.basal_profile.filter(filterCurrentDomain),
			basal_temp: this.buffer_data.intraday.basal_temp.filter(filterCurrentDomain),
			predictions: this.buffer_data.intraday.predictions.filter(filterCurrentDomain)
		}

		return data;
	}
	getThreeHourlyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.hourly3.glucose.filter(filterCurrentDomain),
		}
		return data;
	}
	getSixHourlyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.hourly6.glucose.filter(filterCurrentDomain),
		}
		return data;
	}
	getDailyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.daily.glucose.filter(filterCurrentDomain),
		}
		return data;
	}
	getWeeklyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.weekly.glucose.filter(filterCurrentDomain),
		}
		return data;
	}
	getMonthlyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.monthly.glucose.filter(filterCurrentDomain),
		}
		return data;
	}
	getStatistics() {
			const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
			let glucoseSize = 0;
			let timeFrame = this.domain;
			let hypo = 0,
				low = 0,
				normal = 0,
				high = 0,
				hyper = 0,
				average = 0;

			if(this.display == 'intraday'){
				let glucose = this.buffer_stats.glucose.filter(filterCurrentDomain);
				glucoseSize = glucose.length;
				glucose.forEach(d => {
					average = parseFloat(average) + parseFloat(d.value);
					if (d.value < this.glucoseLevels.hypo) {
						hypo++;
					} else if (d.value < this.glucoseLevels.low) {
						low++;
					} else if (d.value < this.glucoseLevels.normal) {
						normal++;
					} else if (d.value < this.glucoseLevels.high) {
						high++;
					} else {
						hyper++;
					}
				})
			}else{
				//Return data from buffer
				//Outfactor!!!
				let glucose;
				switch (this.display) {
					case '3hourly':
						glucose = this.getThreeHourlyData();
						break;
					case '6hourly':
						glucose = this.getSixHourlyData();
						break;
					case 'daily':
						glucose = this.getDailyData();
						break;
					case 'weekly':
						glucose = this.getWeeklyData();
						break;
					case 'monthly':
						glucose = this.getMonthlyData();
						break;
					default:
						break;
				}
				glucose.glucose.forEach(d => {
					hypo = hypo + parseFloat(d.value_count_hypo);
					low = low + parseFloat(d.value_count_low);
					normal = normal + parseFloat(d.value_count_normal);
					high = high + parseFloat(d.value_count_high);
					hyper = hyper + parseFloat(d.value_count_hyper);
					average = average + parseFloat(d.value_sum);
					glucoseSize = glucoseSize + parseFloat(d.value_count);
				})
			}

			let stats = {
				timeFrame: timeFrame,
				glucose: {
					hypo: hypo / glucoseSize,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value < this.glucoseLevels.hypo).length / glucoseSize,
					low: low / glucoseSize,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.hypo && d.value < this.glucoseLevels.low).length / glucoseSize,
					normal: normal / glucoseSize,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.low && d.value < this.glucoseLevels.normal).length / glucoseSize,
					high: high / glucoseSize,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.normal && d.value < this.glucoseLevels.high).length /glucoseSize,
					hyper: hyper / glucoseSize,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.high && d.value < this.glucoseLevels.hyper).length / glucoseSize,
					average: average / glucoseSize//glucoseSize == 0 ? 0 : d3.mean(glucose.map(d => d.value)),
				},
				glucoseLevels: this.glucoseLevels

			}
			return stats;
	}


	compGlucoseCGMData(data, keyfunc) {
		let glucoseLevels = this.glucoseLevels;
		let glucose = d3.nest()
			.key(keyfunc)
			.rollup(function (v) {
				return {
					value: d3.median(v, function (d) { return +d.value; }),
					value_min: +d3.min(v, function (d) { return +d.value; }),
					value_max: +d3.max(v, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(v.map(d => +d.value).sort((a, b) => (+a) - (+b)), 0.25),
					value_higher_perc: d3.quantile(v.map(d => +d.value).sort((a, b) => (+a) - (+b)), 0.75),
					value_sum: d3.sum(v, function (d) { return +d.value; }),
					value_count: v.length,
					value_count_hypo: v.filter(d => d.value < glucoseLevels.hypo).length,
					value_count_low: v.filter(d => d.value > glucoseLevels.hypo && d.value < glucoseLevels.low).length,
					value_count_normal: v.filter(d => d.value > glucoseLevels.low && d.value < glucoseLevels.normal).length,
					value_count_high: v.filter(d => d.value > glucoseLevels.normal && d.value < glucoseLevels.high).length,
					value_count_hyper: v.filter(d => d.value > glucoseLevels.high && d.value < glucoseLevels.hyper).length,
					time: new Date(d3.mean(v, function (d) { return d.time; })),
					time_start: new Date(d3.min(v, function (d) { return d.time; })),
					time_end: new Date(d3.max(v, function (d) { return d.time; }))
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