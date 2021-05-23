function drawCdcLineChart(svgClass) {
  let svg = d3.select(svgClass);

  let svgWidth = 1000;
  let svgHeight = 500;

  let data = [
    {"year": 2009, "total": 8.67},
    {"year": 2010, "total": 8.67},
    {"year": 2011, "total": 8.71},
    {"year": 2012, "total": 8.73},
    {"year": 2013, "total": 8.74},
    {"year": 2014, "total": 8.80},
    {"year": 2015, "total": 8.83},
    {"year": 2016, "total": 8.79},
    {"year": 2017, "total": 8.80},
    {"year": 2018, "total": 8.82},
    {"year": 2019, "total": 8.84}
  ];

  // set scales
  let x = d3.scaleLinear()
    .domain([2009, 2019])
    .range([svgWidth*0.5, svgWidth-100]);

  let y = d3.scaleLinear()
  .domain([8.4, 8.9])
  .range([svgHeight-100, 100]);

  // line generator
  let line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.total))
    .curve(d3.curveCatmullRom.alpha(0.5));

  svg.append("path")
    .datum(data)
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", blueArcColor)
    .style("stroke-width", 2);
      
  // add axis
  svg.append("g")
    .attr("transform", "translate(0," + (svgHeight-100+padding*0.5)+ ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .call(g => g.select(".domain").remove())
    .style("font-family", "Rubik")
    .style("font-size", 14);
    
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" +(svgWidth*0.5 - padding*0.5)+ "," + 0+ ")")
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.select(".domain").remove())
    .style("font-family", "Rubik")
    .style("font-size", 14);

  // overlay for mouseover
  let circle = svg.append("circle")
    .attr("r", 6)
    .style("opacity", 0)
    .style("fill", "none")
    .style("stroke", darkGreyColor)
    .style("stroke-width", 2);
  let circleText = svg.append("text")
    .style("font-family", "Rubik")
    .style("font-weight", "bold")
    .style("opacity", 1)
    .style("font-size", 12);
  svg.append("rect")
    .datum(data)
    .attr("x", svgWidth*0.5)
    .attr("y", 100)
    .attr("width", svgWidth-100-(svgWidth*0.5))
    .attr("height", svgHeight-100-100)
    .style("opacity", 0)
    .on("mousemove", function(d) {
      let year = getYearFromEvent(d3.mouse(this)[0], data);
      circle.attr("transform", "translate("+ x(year) +","+ y(data[year-2009]["total"]) +")")
        .style("opacity", 1);
      circleText.attr("x", x(year))
        .attr("y", y(data[year-2009]["total"])-15)
        .text((data[year-2009]["total"]))
        .style("opacity", 1)
        .style("font-family", "Rubik")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", 14);
     })
    .on("mouseout", function() {
      circle.style("opacity", 0)
      circleText.style("opacity", 0);
    });
  

}

function getYearFromEvent(eventX, data) {
  let svgWidth = 1000;
  let segmentSize = (svgWidth-100-svgWidth*0.5)/10;
  let list = [];
  let counter = 2009;
  for (var i = svgWidth*0.5; i<= svgWidth-100; i+=segmentSize) {
    list.push({"year": counter, "pxloc": i});
    counter++;
  }
  let year = 2009;
  list.reduce((a, b) => {
    var isLarger = Math.abs(b["pxloc"] - eventX) < Math.abs(a["pxloc"] - eventX);

    if (isLarger) {
      year = b["year"];
      return b;
    } 
    
    year = a["year"];
    return a;
  });
  return Number(year);
}