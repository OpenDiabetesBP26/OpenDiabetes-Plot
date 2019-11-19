
var width = 970;
var height = 600;

var padding = { top: 50, right: 50, bottom: 50, left: 50 };

//initialisiere ein Array mit zufälligen Zahlen mit 3 Stelligen Nachkommenzahlen
var dataset1 = Array.apply(0, Array(24)).map(function() {
  return (Math.random() * 3 + 5).toFixed(3);
})

//konfiguire testDaten 
var dataset = []
var i;
for(i = 0; i < 24; i++){
  var t = [i + " Uhr", dataset1[i]]
  dataset.push(t)
}
console.log(dataset)

//suche max und min value in data
var min = d3.min(dataset, function(d) {
  return d[1];
})
var max = d3.max(dataset, function(d) {
  return d[1];
})

//definiere x und y scala 
var xScale = d3.scaleBand()
                .domain(dataset.map((d) => d[0]))
                .range([0, width - padding.left - padding.right]);

var yScale = d3.scaleLinear()
                .domain([0, max])
                .range([height - padding.top - padding.bottom, 0]);

var svg = d3.select('body')
            .append('svg')
            .attr('width', width + 'px')
            .attr('height', height + 'px');

var xAxis = d3.axisBottom()
              .scale(xScale);

var yAxis = d3.axisLeft()
							.scale(yScale);

svg.append('g')
  .attr('class', 'axis')
  .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
  .call(xAxis);

svg.append('g')
  .attr('class', 'axis')
	.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
	.call(yAxis);

var linePath = d3.line()
          			.x(function(d){ return xScale(d[0]) })
          			.y(function(d){ return yScale(d[1]) });

var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .text("a simple tooltip");

svg.append('g')
	.append('path')
	.attr('class', 'line-path')
	.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
	.attr('d', linePath(dataset))
  .attr('fill', 'white')
	.attr('stroke-width', 4)
	.attr('stroke', 'teal')
  .attr('opacity', 0.6)



svg.append('g')
  .selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('r', 6)
  .attr('opacity', 0.5)
  .attr('transform', function(d){
    return 'translate(' + (xScale(d[0]) + padding.left) + ',' + (yScale(d[1]) + padding.top) + ')'
  })
  .attr('fill', 'red')
  .on('mouseover', function(d){
    d3.select(this)
      .transition()
      .duration(300)
      .attr('fill', 'yellow')
      .attr('opacity', 1)
      .attr('r', 6 * 2)

svg.append("text")
    .attr("id","tooltip")
    .attr("x",xScale(d[0])+ 40)
    .attr("y",yScale(d[1])+ 40)
    .attr("text-anchor","middle")
    .attr("font-family","sans-setif")
    .attr("font-size","16px")
    .attr("font-weight","bold")
    .attr("fill","red")
    .text(d[1])
  })
  .on("mouseout", function(d){
          d3.select(this)
            .transition()
            .duration(500)
            .attr('fill', 'red')
            .attr('opacity', 0.5)
            .attr('r', 6);
            d3.select('#tooltip').remove();
  });
