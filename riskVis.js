function drawRiskFactorChart(svgClass) {
  let svg = d3.select(svgClass);

  let svgWidth = 1000;
  let svgHeight = 500;

  let data = {
    "Heart Attack": [4.8, 3.4],
    "Coronary Heart Disease": [4.7 , 3.4],
    "Stroke": [3.6 , 2.4],
    "Asthma": [16.5, 11.8],
    "COPD": [8.6, 4.7],
    "Cancer": [10.2 , 9.8],
    "Arthritis": [28.8, 20.5],
    "Depression": [22.9 , 14.6],
    "Chronic Kidney Disease": [3.3, 2.2],
    "Diabetes": [11.1, 8.6]
  };

  let x = d3.scaleBand()
    .domain(Object.keys(data))
    .range([padding*4, svgWidth - padding*4])
  let y = d3.scaleLinear()
    .domain([0, 30])
    .range([svgHeight-padding*4, padding*6]);

  // short of sleep data
  svg.selectAll("#short")
    .data(Object.keys(data))
    .enter()
    .append("rect")
    .attr("x", d => x(d))
    .attr("y", d => y(data[d][0]))
    .attr("width", x.bandwidth()/3)
    .attr("height", function(d) {
      return y(0)-y(data[d][0]);
    })
    .attr("rx", 3)
    .style("fill", allNighterColor);

  // sufficient sleep data
  svg.selectAll("#sufficient")
    .data(Object.keys(data))
    .enter()
    .append("rect")
    .attr("x", d => (x(d)+x.bandwidth()/3))
    .attr("y", d => y(data[d][1]))
    .attr("width", x.bandwidth()/3)
    .attr("height", function(d) {
      return y(0)-y(data[d][1]);
    })
    .attr("rx", 3)
    .style("fill", blueArcColor);

  // add x-axis
  svg.append("g")
    .attr("transform", "translate("+ (-1*x.bandwidth()/5)+"," + (svgHeight-100+padding*0.5)+ ")")
    .style("font-family", "Rubik")
    .style("font-size", 14)
    .call(d3.axisBottom(x))
    .call(g => g.select(".domain").remove())
    .selectAll(".tick text")
    .call(wrap, 80);

  // add y-axis
  svg.append("g")
    .attr("transform", "translate("+ (padding*3.5)+"," + (0)+ ")")
    .style("font-family", "Rubik")
    .style("font-size", 14)
    .call(d3.axisLeft(y).tickFormat(d => d + "%").ticks(8))
    .call(g => g.select(".domain").remove())
  svg.append("text")
    .attr("x", -1*((svgHeight-padding*4 + padding*6)*0.5))
    .attr("y", padding)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Risk Percentage")
    .style("font-family", "Rubik")
    .style("font-weight", "bold")
    .style("font-size", 14);
    
  // add legend 
  svg.append("rect")
    .attr("x", svgWidth*0.825)
    .attr("y", svgHeight*0.3 - padding)
    .attr("width", padding*0.75)
    .attr("height", padding*0.75)
    .attr("rx", 3)
    .style("fill", allNighterColor);
  svg.append("rect")
    .attr("x", svgWidth*0.825)
    .attr("y", svgHeight*0.3)
    .attr("width", padding*0.75)
    .attr("height", padding*0.75)
    .attr("rx", 3)
    .style("fill", blueArcColor);
  svg.append("text")
    .attr("x", svgWidth*0.825 + padding)
    .attr("y", svgHeight*0.3 - padding/2)
    .text("short sleep (< 7h)")
    .style("alignment-baseline", "middle")
    .style("font-family", "Rubik")
    .style("font-size", 14);
  svg.append("text")
    .attr("x", svgWidth*0.825 + padding)
    .attr("y", svgHeight*0.3 +padding/2)
    .text("sufficient sleep (> 7h)")
    .style("alignment-baseline", "middle")
    .style("font-family", "Rubik")
    .style("font-size", 14);

  addBodyText(svg, 10, padding, textColor, [
    "Following good sleep hygiene is important as there are associated health risks for",
    "getting \"short sleep\" (less than 7 hours per night), as presented by the CDC (2). "
  ]);

  addBodyText(svg, 10, svgHeight+padding, textColor, [
    "To improve sleep hygiene and avoid these health risks, it is recommended to prioritize sleep",
    "sleep (which I am working on!), keep a consistent routine, and budget time for winding down",
    "in the absence of electronics. (4)"
  ]);

  // add title for line chart
  svg.append("text")
    .attr("x", (padding*4 + svgWidth - padding*4)*0.5)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    // .attr("transform", "rotate(-90)")
    .text("Risk Factors Associated with Sleep")
    .style("font-family", "Rubik")
    .style("font-weight", "bold")
    .style("font-size", 18);
}

/* used for wrapping text in bar graph axes labels */
// code adapted from https://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
  text.each(function() {
  var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
  while (word = words.pop()) {
    line.push(word);
    tspan.text(line.join(" "));
    if (tspan.node().getComputedTextLength() > width) {
      line.pop();
      tspan.text(line.join(" "));
      line = [word];
      tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
    }
  }
  });
}