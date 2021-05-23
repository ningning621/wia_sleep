function drawSleepCycleChart(svgClass) {
  let svg = d3.select(svgClass);

  let svgWidth = 1000;
  let svgHeight = 500;

  let circleSize = 120;
  let innerRad = 20;
  let circleSpacing = ((svgWidth/5)-circleSize)*0.5;

  let arc = d3.arc()
    .startAngle(function(d) {
      var str = d["Hours"].split("-");
      return (convertTimeStrToFrac(str[0])/24 * 360 * PI / 180);
    })
    .endAngle(function(d) {
      var str = d["Hours"].split("-");
      return (convertTimeStrToFrac(str[1])/24 * 360 * PI / 180);
    })
    .innerRadius(innerRad)
    .outerRadius(circleSize*0.55);

  let data = {
    "monophasic": [
      {"Hours": "0:00-8:00"}
    ],
    "biphasic": [
      {"Hours": "0:00-6:00"},
      {"Hours": "14:15-15:45"}
    ],
    "everyman": [
      {"Hours": "0:00-3:30"},
      {"Hours": "8:20-8:40"}, 
      {"Hours": "13:35-13:55"},
      {"Hours": "18:50-19:10"}
    ],
    "dymaxion": [
      {"Hours": "0:00-0:30"},
      {"Hours": "6:00-6:30"},
      {"Hours": "12:00-12:30"},
      {"Hours": "18:00-18:30"}
    ],
    "uberman": [
      {"Hours": "0:00-0:20"},
      {"Hours": "4:00-4:20"},
      {"Hours": "8:00-8:20"},
      {"Hours": "12:00-12:20"},
      {"Hours": "16:00-16:20"},
      {"Hours": "20:00-20:20"},
    ]
  };

  let cycles = ["monophasic", "biphasic", "everyman", "dymaxion", "uberman"];
  let hours = ["8 hours", "7.5 hours", "4.5 hours", "2 hours", "2 hours"];
  let count = 0;
  for (var i = (circleSpacing + circleSize*0.5); i < svgWidth; i = i+(circleSize+circleSpacing*2)) {
    // add background circle 
    svg.append("path")
      .attr("d", d3.arc()
        .innerRadius(innerRad) // hardcoded
        .outerRadius(circleSize*0.5) // hardcoded
        .startAngle(0)
        .endAngle(360 * PI / 180))
      .attr('transform', "translate(" + i + ", " + (svgHeight*0.5) + ")")
      .style("fill", backgroundColor);
    
    // draw arcs for sleep time
    svg.selectAll(".marker")
      .data(data[cycles[count]])
      .enter()
      .append("path")
      .attr("d", arc)
      .attr('transform', "translate(" + i + ", " + (svgHeight*0.5) + ")")
      .style("fill", blueArcColor)
      .style("opacity", 0.8);

    // add title for sleep cycle
    svg.append("text")
      .attr("x", i)
      .attr("y", (svgHeight - circleSize)*0.5 - padding*2)
      .text(cycles[count])
      .style("font-family", "Rubik")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .style("font-size", 16);
    svg.append("text")
      .attr("x", i)
      .attr("y", (svgHeight+ circleSize)*0.5 + padding*2)
      .text(hours[count])
      .style("font-family", "Rubik")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .style("font-size", 16);
    
    count++;
  }
}