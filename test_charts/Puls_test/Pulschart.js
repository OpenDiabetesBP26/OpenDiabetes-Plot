const dataPuls = [
            {date: new Date(2019, 11, 5, 8, 0), value: 102},
            {date: new Date(2019, 11, 5, 12, 30), value: 115},
            {date: new Date(2019, 11, 5, 15, 0), value: 152},
            {date: new Date(2019, 11, 5, 17, 30), value: 132},
            {date: new Date(2019, 11, 5, 21, 0), value: 92},
            ];

window.onload = function() {
        var width=960;
        var height=600;
    
        var marge = {top:60,bottom:60,left:60,right:60}
        gWidth = width-marge.left-marge.right;
        gHeight = height-marge.top-marge.bottom;
        
              
        d3.select("body")
          .append("svg")
          .attr("width",width)
          .attr("height",height);
    		
        var g = d3.select("svg")
            .append("g")
    		.attr("transform","translate("+marge.top+","+marge.left+")");
        
        //xAxis-Time
    	var xScale = d3.scaleTime()
    		.domain(d3.extent(dataPuls, (d) => d.date))
    		.range([0,gWidth]);
        var xAxis = d3.axisBottom(xScale);
            
        //yAxis-Puls value
     	var yScale = d3.scaleLinear()
    		.domain([d3.min(dataPuls, d => d.value)-20,d3.max(dataPuls, d => d.value)+20])
    		.range([gHeight,0]);
        var yAxis = d3.axisLeft(yScale);
    	
        //add xAxis
    	g.append("g")
            .attr('class', 'axis')
    		.attr("transform","translate(0,"+(gHeight)+")")
            .call(xAxis);
        //add yAxis
    	g.append("g")
            .attr('class', 'axis')
            .call(yAxis);
        
        g.append("text")
            .text("bpm")
            .attr("text-anchor","end")
            .attr("dx", "3em")
            .attr("dy", "1em");
        
        //Path
        var linePath = d3.line()
          			.x(function (d) {return xScale(d['date']);})
                    .y(function (d) {return yScale(d['value']);});
    
    
        g.append("path")
            .attr("d",linePath(dataPuls))
            .attr('fill', 'none')
            .attr('stroke-width', 3)
	        .attr('stroke', 'red');
}
        