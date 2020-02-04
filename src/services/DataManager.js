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
			high: 150,
			hyper: 250
		}
		this.types = {
			basal_profile: 'BASAL_PROFILE',
			basal_temp: 'BASAL_TEMP',
			glucose: 'GLUCOSE_CGM',
			bolus: 'BOLUS_NORMAL',
			carbs: 'MEAL_MANUAL'
		}
	}

	parseData(data) {
		data.forEach(d => {
			d.time = new Date(d.epoch);
			delete d.isoTime;
			delete d.epoch;
			if(d.type == this.types.glucose){
				d.value = parseInt(d.value);
			}
			else if(d.type == this.types.basal_profile || d.type == this.types.basal_temp || d.type == this.types.bolus || d.type == this.types.carbs){
				d.value = parseFloat(d.value);
			}
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
		console.log(basal_combined);
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
	readData(data) {
		//DeepCopy Hack
		let then = new Date();
		data = JSON.parse(JSON.stringify(data));
		let now = new Date();
		console.log('DeepCopy hack took ' + (now - then) + ' ms');
		//Firstly, parse values to float
		this.parseData(data);
		//Values too low
		let low = data.filter(d => d.type == this.types.glucose && d.value < 40);
		low.filter(d => d.value > 30).forEach(d => d.value = 40.0);
		//Delete those under 40 now
		data = data.filter(d => (d.type == this.types.glucose && d.value >= 40) || d.type != this.types.glucose);

		//Cap highs to limit
		data.filter(d => d.type == this.types.glucose && d.value > 400).forEach(d => d.value = 400);

		this.maxDomain = d3.extent(data, d => d.time);
		let basal_profile = data.filter(d => d.type == this.types.basal_profile);
		let basal_temp = data.filter(d => d.type == this.types.basal_temp);
		//Remove those from data
		data = data.filter(d => d.type != this.types.basal_profile && d.type != this.types.basal_temp);
		let basal_combined = this.parseBasal(basal_profile, basal_temp);
		console.log(basal_combined);
		let types = this.types;
		//Add in crossfilter
		let data_crossfilter = crossfilter(data);
		data_crossfilter.add(basal_combined);

		//Create filter dimension
		let filter_dim = data_crossfilter.dimension(d => d.time);
		let group_dim = data_crossfilter.dimension(d => d.time);
		let groupThreeHour = group_dim.group(d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - d.getMinutes() % 10))).reduce(
			function reduceAdd(p, v, nf) {
				if (v.type == types.glucose) {
					p.glucose.sum += parseInt(v.value);
					p.glucose.count++;
					p.glucose.avg = p.glucose.sum / p.glucose.count;
					return p;
				}
				else if (v.type == types.basal_profile || v.type == types.basal_temp) {
					let weight = (v.time_end - v.time_start) / (60000 * 60.0);
					p.basal.sum += (weight * v.value);
					return p;
				} else if (v.type == types.bolus) {
					p.bolus.sum += v.value;
					return p;
				} else if (v.type == types.carbs) {
					p.carbs.sum += v.value;
					return p;
				}
				else {
					return p;
				}
			},
			function reduceRemove(p, v, nf) {
				if (v.type == types.glucose) {
					p.glucose.sum -= parseInt(v.value);
					p.glucose.count--;
					p.glucose.avg = p.glucose.sum / p.glucose.count;
					return p;
				}
				else if (v.type == types.basal_profile || v.type == types.basal_temp) {
					let weight = (v.time_end - v.time_start) / (60000 * 60);
					p.basal.sum -= (weight * v.value);
					return p;

				} else if (v.type == types.bolus) {
					p.bolus.sum -= v.value;
					return p;
				} else if (v.type == types.carbs) {
					p.carbs.sum -= v.value;
					return p;
				}
				else {
					return p;
				}
			},
			function reduceInitial() {
				return {
					glucose: {
						sum: 0,
						count: 0,
						avg: 0,
					},
					basal: {
						sum: 0,
					},
					bolus: {
						sum: 0,
					},
					carbs: {
						sum: 0,
					}
				}
			}
		);


		let groupSixHour = group_dim.group(d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - d.getMinutes() % 20))).reduce(
			function reduceAdd(p, v, nf) {
				if (v.type == types.glucose) {
					p.glucose.sum += parseInt(v.value);
					p.glucose.count++;
					p.glucose.avg = p.glucose.sum / p.glucose.count;
					return p;
				}
				else if (v.type == types.basal_profile || v.type == types.basal_temp) {
					let weight = (v.time_end - v.time_start) / (60000 * 60.0);
					p.basal.sum += (weight * v.value);
					return p;
				} else if (v.type == types.bolus) {
					p.bolus.sum += v.value;
					return p;
				} else if (v.type == types.carbs) {
					p.carbs.sum += v.value;
					return p;
				}
				else {
					return p;
				}
			},
			function reduceRemove(p, v, nf) {
				if (v.type == types.glucose) {
					p.glucose.sum -= parseInt(v.value);
					p.glucose.count--;
					p.glucose.avg = p.glucose.sum / p.glucose.count;
					return p;
				}
				else if (v.type == types.basal_profile || v.type == types.basal_temp) {
					let weight = (v.time_end - v.time_start) / (60000 * 60);
					p.basal.sum -= (weight * v.value);
					return p;

				} else if (v.type == types.bolus) {
					p.bolus.sum -= v.value;
					return p;
				} else if (v.type == types.carbs) {
					p.carbs.sum -= v.value;
					return p;
				}
				else {
					return p;
				}
			},
			function reduceInitial() {
				return {
					glucose: {
						sum: 0,
						count: 0,
						avg: 0,
					},
					basal: {
						sum: 0,
					},
					bolus: {
						sum: 0,
					},
					carbs: {
						sum: 0,
					}
				}
			}
		);
		let limit = 400;
		//Reduce function for percentile
		function reduceAddPercentile(p, v, nf){
			if (v.type == types.glucose) {
				let value = parseInt(v.value);
				if (value > limit) {
					value = limit;
				}
				p.glucose.median_arr[value] ? p.glucose.median_arr[value]++ : p.glucose.median_arr[value] = 1;

				p.glucose.sum += parseInt(v.value);
				p.glucose.count++;
				p.glucose.avg = p.glucose.sum / p.glucose.count;
				return p;
			}
			else if (v.type == types.basal_profile || v.type == types.basal_temp) {
				let weight = (v.time_end - v.time_start) / (60000 * 60.0);
				p.basal.sum += (weight * v.value);
				return p;
			} else if (v.type == types.bolus) {
				p.bolus.sum += v.value;
				return p;
			} else if (v.type == types.carbs) {
				p.carbs.sum += v.value;
				return p;
			}
			else {
				return p;
			}
		}
		function reduceRemovePercentile(p, v, nf) {
			if (v.type == types.glucose) {
				let value = parseInt(v.value);
				if (value > limit) {
					value = limit;
				}
				p.glucose.median_arr[value]--;
				p.glucose.sum -= parseInt(v.value);
				p.glucose.count--;
				p.glucose.avg = p.glucose.sum / p.glucose.count;
				return p;
			}
			else if (v.type == types.basal_profile || v.type == types.basal_temp) {
				let weight = (v.time_end - v.time_start) / (60000 * 60);
				p.basal.sum -= (weight * v.value);
				return p;

			} else if (v.type == types.bolus) {
				p.bolus.sum -= v.value;
				return p;
			} else if (v.type == types.carbs) {
				p.carbs.sum -= v.value;
				return p;
			}
			else {
				return p;
			}
		}
		function reduceInitialPercentile(){
			return {
				glucose: {
					sum: 0,
					count: 0,
					avg: 0,
					median_arr: new Array(limit + 1),
				},
				basal: {
					sum: 0,
				},
				bolus: {
					sum: 0,
				},
				carbs: {
					sum: 0,
				}
			}
		}
		let groupDaily = group_dim.group(d => new Date(d.getFullYear(), d.getMonth(), d.getDate())).reduce(
			reduceAddPercentile,
			reduceRemovePercentile,
			reduceInitialPercentile
		);

		let week = 60000 * 60 * 24 * 7;
		let groupWeekly = group_dim.group(d => new Date(Math.floor(d.getTime() / week) * week)).reduce(
			reduceAddPercentile,
			reduceRemovePercentile,
			reduceInitialPercentile
		);

		let groupMonthly = group_dim.group(d => new Date(d.getFullYear(), d.getMonth())).reduce(
			reduceAddPercentile,
			reduceRemovePercentile,
			reduceInitialPercentile
		);

		//Statistical groups

		let glucoseLevels = this.glucoseLevels;
		let group_stats_range = group_dim.groupAll().reduce(
			function reduceAdd(p, v, nf) {
				if (v.type == types.glucose) {
					//Compute hour
					let hour = v.time.getHours();
					let minute = Math.floor(v.time.getMinutes() / 10);
					let value = parseInt(v.value);
					p.stats[hour * 6 + minute][value] ? p.stats[hour * 6 + minute][value]++ : p.stats[hour * 6 + minute][value] = 1;
					p.count++;
					p.sum += value;
					if (value < glucoseLevels.hypo) {
						p.hypo++;
					} else if (value < glucoseLevels.low) {
						p.low++;
					} else if (value > glucoseLevels.hyper) {
						p.hyper++;
					} else if (value > glucoseLevels.high) {
						p.high++;
					} else {
						p.normal++;
					}
				}
				return p;
			},
			function reduceRemove(p, v, nf) {
				if (v.type == types.glucose) {
					//Compute hour
					let hour = v.time.getHours();
					let minute = Math.floor(v.time.getMinutes() / 10);
					let value = parseInt(v.value);
					p.stats[hour * 6 + minute][value]--;
					p.count--;
					p.sum -= value;
					if (value < glucoseLevels.hypo) {
						p.hypo--;
					} else if (value < glucoseLevels.low) {
						p.low--;
					} else if (value > glucoseLevels.hyper) {
						p.hyper--;
					} else if (value > glucoseLevels.high) {
						p.high--;
					} else {
						p.normal--;
					}
				}
				return p;
			},
			function reduceInitial() {
				//Init array for minutes
				let size = 24 * 6;
				let time = new Array(size);
				let i;
				for (i = 0; i < time.length; i++) {
					time[i] = new Array(limit + 1);
				}
				return {
					count: 0,
					sum: 0,
					hypo: 0,
					low: 0,
					normal: 0,
					high: 0,
					hyper: 0,
					stats: time,
				}
			}
		);

		//Group access
		this.data = {
			raw: data_crossfilter,
			three: groupThreeHour,
			six: groupSixHour,
			daily: groupDaily,
			weekly: groupWeekly,
			monthly: groupMonthly,
			stats_range: group_stats_range,
		}
		this.filter = filter_dim;
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
	getPercentile(data, count, percentile) {
		let percentile_index = [];
		percentile.forEach(d => percentile_index.push(Math.floor(d * count)));

		let results = new Array(percentile_index.length);
		let i;
		if (data) {
			for (i = 0; i < data.length; i++) {
				if (data[i]) {
					let j;
					for (j = 0; j < percentile_index.length; j++) {
						percentile_index[j] -= data[i];
						if (percentile_index[j] < 0) {
							results[j] = i;
							percentile_index[j] = Infinity;
						}
					}
				}
			}
		}
		return results;

	}
	updateDomain(newDomain) {
		this.domain = newDomain;
		this.filterData();
	}
	filterData() {
		switch (this.display) {
			case '3hourly':
				this.domain = this.domain.map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - d.getMinutes() % 10)));
				break;
			case '6hourly':
				this.domain = this.domain.map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - d.getMinutes() % 20)));
				break;
			case 'daily':
				this.domain = this.domain.map(d => new Date(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() + 60000 * 60 * 24));
				break;
			case 'weekly':
				let week = 60000 * 60 * 24 * 7;
				this.domain = this.domain.map(d => new Date((Math.floor(d.getTime() / week) + 1) * week));
				break;
			case 'monthly':
				this.domain = this.domain.map(d => new Date(d.getFullYear(), d.getMonth() + 1));
				break;
			default:
		}
		this.filter.filterRange(this.domain);
	}
	changeDisplay(display) {
		this.display = display;
		this.filterData();
	}
	getData() {
		return this.data;
	}
	getIntradayData() {
		let data = this.data.raw.allFiltered();
		let results = {
			glucose: data.filter(d => d.type == this.types.glucose),
			bolus: data.filter(d => d.type == this.types.bolus),
			basal: data.filter(d => d.type == this.types.basal_temp || d.type == this.types.basal_profile),
			carbs: data.filter(d => d.type == this.types.carbs)
		}
		console.log(results);
		return results;
	}
	getThreeHourlyData() {
		let data_raw = this.data.three.all();
		let glucose = [];
		let basal = [];
		let bolus = [];
		let carbs = [];
		data_raw.forEach(d => {
			if (d.value.glucose.count != 0) {
				let item = {
					time: d.key,
					value: d.value.glucose.sum / d.value.glucose.count,
				}
				glucose.push(item);
			}
			if (d.value.basal.sum != 0) {
				let item = {
					time: d.key,
					value: d.value.basal.sum,
				}
				basal.push(item);
			}
			if (d.value.bolus.sum != 0) {
				let item = {
					time: d.key,
					value: d.value.bolus.sum,
				}
				bolus.push(item);
			}
			if (d.value.carbs.sum != 0) {
				let item = {
					time: d.key,
					value: d.value.carbs.sum,
				}
				carbs.push(item);
			}
		})
		return {
			glucose: glucose,
			basal: basal,
			bolus: bolus,
			carbs: carbs
		};
	}
	getSixHourlyData() {
		let data_raw = this.data.six.all();
		let glucose = [];
		let basal = [];
		let bolus = [];
		let carbs = [];
		data_raw.forEach(d => {
			if (d.value.glucose.count != 0) {
				let item = {
					time: d.key,
					value: d.value.glucose.sum / d.value.glucose.count,
				}
				glucose.push(item);
			}
			if (d.value.basal.sum != 0) {
				let item = {
					time: d.key,
					value: d.value.basal.sum,
				}
				basal.push(item);
			}
			if (d.value.bolus.sum != 0) {
				let item = {
					time: d.key,
					value: d.value.bolus.sum,
				}
				bolus.push(item);
			}
			if (d.value.carbs.sum != 0) {
				let item = {
					time: d.key,
					value: d.value.carbs.sum,
				}
				carbs.push(item);
			}
		})
		return {
			glucose: glucose,
			basal: basal,
			bolus: bolus,
			carbs: carbs
		};;
	}
	getDailyData() {
		let data_raw = this.data.daily.all();
		let glucose = [];
		data_raw.forEach(d => {
			if (d.value.glucose.count != 0) {
				let percentile = this.getPercentile(d.value.glucose.median_arr, d.value.glucose.count, [0.25, 0.5, 0.75]);
				let item = {
					time: d.key,
					value: percentile[1],
					value_avg: d.value.glucose.sum / d.value.glucose.count,
					value_lower_perc: percentile[0],
					value_higher_perc: percentile[2],
					percentile: percentile
				}
				glucose.push(item);
			}
		})
		return {
			glucose: glucose
		};
	}
	getWeeklyData() {
		let data_raw = this.data.weekly.all();
		let glucose = [];
		data_raw.forEach(d => {
			if (d.value.glucose.count != 0) {
				let percentile = this.getPercentile(d.value.glucose.median_arr, d.value.glucose.count, [0.25, 0.5, 0.75]);
				let item = {
					time: d.key,
					value: percentile[1],
					value_avg: d.value.glucose.sum / d.value.glucose.count,
					value_lower_perc: percentile[0],
					value_higher_perc: percentile[2],
					percentile: percentile
				}
				glucose.push(item);
			}
		})
		return {
			glucose: glucose
		};
	}
	getMonthlyData() {
		let data_raw = this.data.monthly.all();
		let glucose = [];
		data_raw.forEach(d => {
			if (d.value.glucose.count != 0) {
				let percentile = this.getPercentile(d.value.glucose.median_arr, d.value.glucose.count, [0.25, 0.5, 0.75]);
				let item = {
					time: d.key,
					value: percentile[1],
					value_avg: d.value.glucose.sum / d.value.glucose.count,
					value_lower_perc: percentile[0],
					value_higher_perc: percentile[2],
					percentile: percentile
				}
				glucose.push(item);
			}
		})
		return {
			glucose: glucose
		};
	}
	getStatistics() {
		let stats_raw = this.data.stats_range.value();
		let stats = {
			timeFrame: this.domain,
			glucose: {
				hypo: stats_raw.hypo / stats_raw.count,
				low: stats_raw.low / stats_raw.count,
				normal: stats_raw.normal / stats_raw.count,
				high: stats_raw.high / stats_raw.count,
				hyper: stats_raw.hyper / stats_raw.count,
				average: stats_raw.sum / stats_raw.count
			},
			glucoseLevels: this.glucoseLevels
		}
		return stats;
	}
	getPercentileDay() {
		let day = this.data.stats_range.value().stats;
		let result = [];
		let i;
		for (i = 0; i < day.length; i++) {
			let item = {
				time: new Date(1970, 1, 2, Math.floor(i / 6), (i % 6) * 10),
				value: this.getPercentile(day[i], day[i].reduce((p, c) => p + c), [0.10, 0.25, 0.5, 0.75, 0.90])
			}
			result.push(item);
		}
		return result;
	}

}
export default DataManager