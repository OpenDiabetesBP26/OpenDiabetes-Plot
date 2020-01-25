import * as d3 from 'd3';
import crossfilter from 'crossfilter2';

class DataManager {
	constructor() {
		this.domain = [new Date(0), new Date(0)];
		this.buffer = [new Date(0), new Date(0)];
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

	parseBasal(basal, basal_temp) {
		let basal_profile_offset = 60000 * 60;
		//Assumption -> basal and basal_temp are sorted on time

		//Add offset to basal
		basal = basal.map(d => {
			d.time_start = d.time;
			d.value = parseFloat(d.value);
			d.time_end = new Date(d.time.getTime() + basal_profile_offset);
			return d;
		})
		//For temp, parse value to float, calculate start and end time
		basal_temp = basal_temp.map(d => {
			d.value = parseFloat(d.value);
			d.time_start = d.time;
			d.time_end = new Date(d.time.getTime() + (d.valueExtension * 60000));
			return d;
		})
		//Remove overlapping by overwriting
		let i;
		for (i = 0; i < basal_temp.length - 1; i++) {
			if (basal_temp[i].time_end.getTime() > basal_temp[i + 1].time_start.getTime()) {
				basal_temp[i].time_end = new Date(basal_temp[i + 1].time_start.getTime());
			}
		}
		//Create arry containing results
		let basal_combined = [];
		//filter 0.0 values, as they seem to only reset basal
		//not needed as end time was calculated
		//Reverse lists for pop()
		basal_temp = basal_temp.filter(d => d.valueExtension != 0).reverse();
		basal = basal.reverse();
		//Get first elements
		let last_basal = basal.pop();
		let last_temp = basal_temp.pop();
		//Iterate until all are used
		while (last_basal != null || last_temp != null) {
			//If there are no basal temp anymore, add every profile
			if (last_temp == null) {
				while (last_basal != null) {
					basal_combined.push(last_basal);
					last_basal = basal.pop();
				}
			}
			//If last basal profile is null, temp cannot be computed anymore
			if (last_basal == null) {
				break;
			}
			//If temp is not in time range for profile, append profile until then
			while (last_temp.time_start > last_basal.time_end) {
				basal_combined.push(last_basal);
				last_basal = basal.pop();
			}
			//Assumption: last_basal.time_end >= last_temp.time_start --> last_temp.time_start >= last_basal.time_start
			//If start times do not equal, there must be a first part only containing basal profile
			if (last_basal.time_start.getTime() != last_temp.time_start.getTime()) {
				let b = {
					origin: last_basal.origin,
					source: last_basal.source,
					type: last_basal.type,
					value: last_basal.value,
					time_start: new Date(last_basal.time_start.getTime()),
					time_end: new Date(last_temp.time_start.getTime())
				}
				basal_combined.push(b);
			}
			if (last_basal.time_end.getTime() == last_temp.time_end.getTime()) {
				last_temp.value_inc = last_temp.value;
				last_temp.value = last_basal.value + last_temp.value;
				if (basal_combined.length > 0 &&
					basal_combined[basal_combined.length - 1].type == 'BASAL_TEMP' &&
					basal_combined[basal_combined.length - 1].value == last_temp.value &&
					basal_combined[basal_combined.length - 1].value_inc == last_temp.value_inc) {

					basal_combined[basal_combined.length - 1].time_end = new Date(last_temp.time_end.getTime());

				} else {

					basal_combined.push(last_temp);
				}
				last_basal = basal.pop();
				last_temp = basal_temp.pop();
			}
			else if (last_basal.time_end.getTime() < last_temp.time_end.getTime()) {
				let temp_end = {
					origin: last_temp.origin,
					source: last_temp.source,
					type: last_temp.type,
					value: last_basal.value + last_temp.value,
					value_inc: last_temp.value,
					time_start: new Date(last_temp.time_start.getTime()),
					time_end: new Date(last_basal.time_end.getTime())
				}
				last_temp.time_start = new Date(last_basal.time_end.getTime());
				//Check if last entry is the same
				if (basal_combined.length > 0 &&
					basal_combined[basal_combined.length - 1].type == 'BASAL_TEMP' &&
					basal_combined[basal_combined.length - 1].value == temp_end.value &&
					basal_combined[basal_combined.length - 1].value_inc == temp_end.value_inc) {

					basal_combined[basal_combined.length - 1].time_end = new Date(temp_end.time_end.getTime());

				} else {

					basal_combined.push(temp_end);
				}
				last_basal = basal.pop();
			} else {
				last_temp.value_inc = last_temp.value;
				last_temp.value = last_basal.value + last_temp.value;

				let b_end = {
					origin: last_basal.origin,
					source: last_basal.source,
					type: last_basal.type,
					value: last_basal.value,
					time_start: new Date(last_temp.time_end.getTime()),
					time_end: new Date(last_basal.time_end.getTime())
				}
				if (basal_combined.length > 0 &&
					basal_combined[basal_combined.length - 1].type == 'BASAL_TEMP' &&
					basal_combined[basal_combined.length - 1].value == last_temp.value &&
					basal_combined[basal_combined.length - 1].value_inc == last_temp.value_inc) {

					basal_combined[basal_combined.length - 1].time_end = new Date(last_temp.time_end.getTime());

				} else {

					basal_combined.push(last_temp);
				}
				last_temp = basal_temp.pop();
				last_basal = b_end;

			}
		}
		if (basal_combined.length != 0) {
			basal_combined[0].value_prev = 0;
			basal_combined[0].time = new Date(basal_combined[0].time_start.getTime());
			for (i = 1; i < basal_combined.length; i++) {
				//Stunden offset 
				basal_combined[i].value_prev = basal_combined[i - 1].value;
				basal_combined[i].time = new Date(basal_combined[i].time_start.getTime());
			}
		}
		return basal_combined;
	}
	parsePrediction(predictions) {
		let refined = d3.nest()
			.key(d => d.time)
			.entries(predictions);
		refined = refined.map(key => {
			//Get time object from item
			let time = new Date(key);
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
		return refined;
	}
	async readDataFromURL(url) {
		let data = await (await fetch(url)).json();
		this.readData(data);
	}
	readData(data) {


		//Parse time from delta
		this.parseTime(data);
		//Set max domain
		this.maxDomain = d3.extent(data, d => d.time);
		//Create crossfilter
		this.data_crossfilter = crossfilter(data);
		this.data_crossfilter_timeDim = this.data_crossfilter.dimension(d => d.time);
		this.data_crossfilter_typeDim = this.data_crossfilter.dimension(d => d.type);


		//Parse Basal
		this.data_crossfilter_typeDim.filterAll();
		this.data_crossfilter_typeDim.filterExact('BASAL_PROFILE');
		this.basal = this.data_crossfilter.allFiltered();
		this.data_crossfilter.remove(this.basal);
		this.data_crossfilter_typeDim.filterAll();

		this.data_crossfilter_typeDim.filterExact('BASAL_TEMP');
		this.basal_temp = this.data_crossfilter.allFiltered();
		this.data_crossfilter.remove(this.basal_temp);
		this.data_crossfilter_typeDim.filterAll();

		let basal_combined = this.parseBasal(this.basal, this.basal_temp);

		this.data_crossfilter.add(basal_combined);

		//Parse Predicitons
		this.data_crossfilter_typeDim.filterExact('REFINED_VAULT_ENTRY');
		let refined_vault = this.data_crossfilter.allFiltered();
		this.data_crossfilter.remove(refined_vault);
		this.data_crossfilter_typeDim.filterAll();
		let predictions = this.parsePrediction(refined_vault);
		this.data_crossfilter.add(predictions);

		//Recompute dimension after adding data
		this.data_crossfilter_timeDim = this.data_crossfilter.dimension(d => d.time);
		this.data_crossfilter_typeDim = this.data_crossfilter.dimension(d => d.type);

		let week = 60000 * 60 * 24 * 7;
		this.raw_data = {
			intraday: this.data_crossfilter,
			threehourly: crossfilter(this.computeData(this.data_crossfilter.all(), d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 10)))),
			sixhourly: crossfilter(this.computeData(this.data_crossfilter.all(), d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate(), d.time.getHours(), (d.time.getMinutes() - d.time.getMinutes() % 20)))),
			daily: crossfilter(this.computeData(this.data_crossfilter.all(), d => new Date(d.time.getFullYear(), d.time.getMonth(), d.time.getDate()))),
			weekly: crossfilter(this.computeData(this.data_crossfilter.all(), d => Math.floor(d.time.getTime() / week))),
			monthly: crossfilter(this.computeData(this.data_crossfilter.all(), d => new Date(d.time.getFullYear(), d.time.getMonth())))
		}
		this.raw_data_dims = {
			intraday: {
				time: this.raw_data.intraday.dimension(d => d.time),
				type: this.raw_data.intraday.dimension(d => d.type)
			},
			threehourly: {
				time: this.raw_data.threehourly.dimension(d => d.time),
				type: this.raw_data.threehourly.dimension(d => d.type)
			},
			sixhourly: {
				time: this.raw_data.sixhourly.dimension(d => d.time),
				type: this.raw_data.sixhourly.dimension(d => d.type)
			},
			daily: {
				time: this.raw_data.daily.dimension(d => d.time),
				type: this.raw_data.daily.dimension(d => d.type)
			},
			weekly: {
				time: this.raw_data.weekly.dimension(d => d.time),
				type: this.raw_data.weekly.dimension(d => d.type)
			},
			monthly: {
				time: this.raw_data.monthly.dimension(d => d.time),
				type: this.raw_data.monthly.dimension(d => d.type)
			}
		}
		this.buffer_data = {
			intraday: [],
			threehourly: [],
			sixhoruly: [],
			daily: [],
			weekly: [],
			monthly: []
		}
		let stats = crossfilter(data.filter(d => d.type == 'GLUCOSE_CGM'));
		let stats_timeDim = stats.dimension(d => d.time);
		let stats_dim = stats.dimension(d => d.time.getHours()*60 + (d.time.getMinutes() - d.time.getMinutes() % 5));
		let stats_group = stats_dim.group().reduce(
			(p,v,nf) => {
				v = parseInt(v.value);
				p[v] = p[v]+1 || 1;
				return p;
			},
			(p, v, nf) => {
				v = parseInt(v.value);
				p[v] = p[v]-1 || 0;
				return p;
			},
			() => {
				return new Array(401);
			}
		)
		.order(p => p.length);

		this.statsDaily = {
			stats: stats,
			stats_timeDim: stats_timeDim,
			stats_dim: stats_dim,
			stats_group: stats_group
		}

		console.log(data.filter(d => d.type == 'GLUCOSE_CGM'));
		console.log(stats.all());
		console.log(stats_group.all())

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
		const timeDelta = this.domain[1].getTime() - this.domain[0].getTime();
		if (
			//Buffer too small -> zoom out
			this.buffer[0].getTime() + timeDelta * (1 / 6) > this.domain[0].getTime() ||
			this.buffer[1].getTime() - timeDelta * (1 / 6) < this.domain[1].getTime() ||
			//Buffer too large -> zoom in
			this.buffer[0].getTime() + timeDelta * (5 / 6) < this.domain[0].getTime() ||
			this.buffer[1].getTime() - timeDelta * (5 / 6) > this.domain[1].getTime()
		) {
			this.buffer = [new Date(this.domain[0].getTime() - timeDelta / 2), new Date(this.domain[1].getTime() + timeDelta / 2)];
			this.bufferData()
		}

		//Stats
		let timeRange = this.domain;
		this.statsDaily.stats_timeDim.filterRange(timeRange);
		console.log(this.statsDaily.stats_group.all());
		this.getPercentileDay();
	}
	bufferData() {
		//Update only the buffer for the current display
		let buffer = this.buffer;
		buffer[1] = new Date(buffer[1].getTime() + 1);

		//always update intraday for stats
		this.raw_data_dims.intraday.time.filterRange(buffer);
		this.buffer_data.intraday = this.raw_data.intraday.allFiltered();
		switch (this.display) {
			case '3hourly':
				this.raw_data_dims.threehourly.time.filterRange(buffer);
				this.buffer_data.threehourly = this.raw_data.threehourly.allFiltered();
				break;
			case '6hourly':
				this.raw_data_dims.sixhourly.time.filterRange(buffer);
				this.buffer_data.sixhourly = this.raw_data.sixhourly.allFiltered();
				break;
			case 'daily':
				this.raw_data_dims.daily.time.filterRange(buffer);
				this.buffer_data.daily = this.raw_data.daily.allFiltered();
				break;
			case 'weekly':
				this.raw_data_dims.weekly.time.filterRange(buffer);
				this.buffer_data.weekly = this.raw_data.weekly.allFiltered();
				break;
			case 'monthly':
				this.raw_data_dims.monthly.time.filterRange(buffer);
				this.buffer_data.monthly = this.raw_data.monthly.allFiltered();
				break;
			default:
				break;
		}
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
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1] && d.type == 'GLUCOSE_CGM';
		let glucose = this.buffer_data.intraday.filter(filterCurrentDomain);
		const filterBasal = (d) => (d.type == 'BASAL_PROFILE' || d.type == 'BASAL_TEMP') && (d.time_start < this.domain[1] && d.time_end > this.domain[0]);
		let bolus = this.buffer_data.intraday.filter(d => d.type == 'BOLUS_NORMAL' && this.domain[0] <= d.time && d.time <= this.domain[1]);
		let basal = this.buffer_data.intraday.filter(filterBasal);
		let data = {
			glucose: glucose,
			bolus: bolus,
			basal: basal,
			// basal_temp: this.buffer_data.intraday.basal_temp.filter(filterCurrentDomain),
			// predictions: this.buffer_data.intraday.predictions.filter(filterCurrentDomain)
		}
		console.log(data);
		return data;
	}
	getThreeHourlyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.threehourly.filter(filterCurrentDomain),
		}
		return data;
	}
	getSixHourlyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.sixhourly.filter(filterCurrentDomain),
		}
		return data;
	}
	getDailyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.daily.filter(filterCurrentDomain),
		}
		return data;
	}
	getWeeklyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.weekly.filter(filterCurrentDomain),
		}
		return data;
	}
	getMonthlyData() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1];
		let data = {
			glucose: this.buffer_data.monthly.filter(filterCurrentDomain),
		}
		return data;
	}
	getStatistics() {
		const filterCurrentDomain = (d) => this.domain[0] <= d.time && d.time <= this.domain[1] && d.type == 'GLUCOSE_CGM';
		let glucoseSize = 0;
		let timeFrame = this.domain;
		let hypo = 0,
			low = 0,
			normal = 0,
			high = 0,
			hyper = 0,
			average = 0;

		if (this.display == 'intraday') {
			let glucose = this.buffer_data.intraday.filter(filterCurrentDomain);
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
		} else {
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
			if (glucose != null) {
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
		}

		let stats = {
			timeFrame: timeFrame,
			glucose: {
				hypo: hypo / glucoseSize || 0,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value < this.glucoseLevels.hypo).length / glucoseSize,
				low: low / glucoseSize || 0,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.hypo && d.value < this.glucoseLevels.low).length / glucoseSize,
				normal: normal / glucoseSize || 0,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.low && d.value < this.glucoseLevels.normal).length / glucoseSize,
				high: high / glucoseSize || 0,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.normal && d.value < this.glucoseLevels.high).length /glucoseSize,
				hyper: hyper / glucoseSize || 0,//glucoseSize == 0 ? 0 : glucose.filter(d => d.value > this.glucoseLevels.high && d.value < this.glucoseLevels.hyper).length / glucoseSize,
				average: average / glucoseSize || 0//glucoseSize == 0 ? 0 : d3.mean(glucose.map(d => d.value)),
			},
			glucoseLevels: this.glucoseLevels

		}
		return stats;
	}
	getPercentileDay(){
		let data = this.statsDaily.stats_group.all();
		data.forEach(d => {
			d.time = new Date(d.key * 60000);
			let count = 0;
			d.value.forEach(d => count = count+d);
			d.count = count;
			let median_index = Math.floor(d.count*0.5);
			let result;
			let remaining = median_index;
			let i;
			for(i = 0; i<401; i++){
				let current = d.value[i] || 0;
				remaining = remaining-current;
				if(remaining <= 0){
					result = i;
					break;
				}
			}
			d.median = result;
		})
		console.log(data);
	}


	computeData(data, keyfunc) {
		let glucoseLevels = this.glucoseLevels;
		let data_out = d3.nest()
			.key(keyfunc)
			.rollup(function (v) {
				let glucose = v.filter(d => d.type == 'GLUCOSE_CGM');
				let output =
				{
					value: d3.median(glucose, function (d) { return +d.value; }),
					value_min: +d3.min(glucose, function (d) { return +d.value; }),
					value_max: +d3.max(glucose, function (d) { return +d.value; }),
					value_lower_perc: d3.quantile(glucose.map(d => +d.value).sort((a, b) => (+a) - (+b)), 0.25),
					value_higher_perc: d3.quantile(glucose.map(d => +d.value).sort((a, b) => (+a) - (+b)), 0.75),
					value_sum: d3.sum(glucose, function (d) { return +d.value; }),
					value_count: glucose.length,
					value_count_hypo: glucose.filter(d => d.value < glucoseLevels.hypo).length,
					value_count_low: glucose.filter(d => d.value > glucoseLevels.hypo && d.value < glucoseLevels.low).length,
					value_count_normal: glucose.filter(d => d.value > glucoseLevels.low && d.value < glucoseLevels.normal).length,
					value_count_high: glucose.filter(d => d.value > glucoseLevels.normal && d.value < glucoseLevels.high).length,
					value_count_hyper: glucose.filter(d => d.value > glucoseLevels.high && d.value < glucoseLevels.hyper).length,
					time: new Date(d3.mean(glucose, function (d) { return d.time; })),
					time_start: new Date(d3.min(glucose, function (d) { return d.time; })),
					time_end: new Date(d3.max(glucose, function (d) { return d.time; })),
					type: 'GLUCOSE_CGM'
				}
				return output

			})
			.entries(data);
		data_out = data_out.map(d => d.value);
		console.log(data_out);
		return data_out;
	}
	milliSecondsToMinutes(ms) {
		return ms / 60000
	}
}
export default DataManager