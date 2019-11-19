const data = [
      {date: new Date(2019, 11, 5, 8, 0), value: 102},
      {date: new Date(2019, 11, 5, 12, 30), value: 115},
      {date: new Date(2019, 11, 5, 15, 0), value: 152},
      {date: new Date(2019, 11, 5, 17, 30), value: 132},
      {date: new Date(2019, 11, 5, 21, 0), value: 92},
    ];

var x = data.map(x => x.data);
var y = data.map(x => x.value);
window.onload = function() {
	var width = 1200, height = 600;
	var padding = {top:30, right:30, bottom:30, left:30};
	var main = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr('height', height)
			.attr('style', "border: 1px solid black")
	var main = d3.select("svg").append("g")
		.attr('transform', "translate(" + padding.top + ',' + padding.left + ')');
	var xScale = d3.scaleTime()
		.domain([new Date(2019, 11, 5, 0, 0), new Date(2019, 11, 6, 0, 0)])
		.range([0, width - padding.left - padding.right]);

	var yScale = d3.scaleLinear()
		.domain([d3.max(y), 0])
		.range([0, height - padding.top - padding.bottom]);

	var xAxis = d3.axisBottom()
			.scale(xScale);

	var yAxis = d3.axisLeft()
			.scale(yScale);
			
	main.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(15,' +  (height - padding.bottom - padding.top) + ')')
		.call(xAxis)

	main.append('g')
		.attr('class', 'axis')
		.attr('transform', `translate(15,0)`)
		.call(yAxis)
	
	const test = function(d){
      console.log(xScale(d))
    };
		
	var rectMargin = 15;

	main.selectAll('.bar')
			.data(data)
			.join((enter) => enter.append('rect')
								.attr('x', function(d, i) {return xScale(d.date);})
								.attr('y', function(d, i) {return yScale(d.value);})
								.attr('width', 2*rectMargin)
								.attr('height', function(d, i) {return height - padding.top - padding.bottom - yScale(d.value);})
								.attr('fill', 'steelblue')
	//							.transition()
	//							.duration(1000)
	//							.delay((d, i) => 2000 * i)
	//							.attr('fill', 'red')
								);
								
	main.selectAll('.text')
			.data(data)
			.join((enter) => enter.append('text')
								.attr('x', function(d, i) {return xScale(d.date)-30;})
								.attr('y', function(d, i) {return yScale(d.value)-15;})
								.attr('dx', 2*rectMargin)
								.attr('dy', function(d, i) {return 15;})
								.text((d) => d.value)
			)
}

