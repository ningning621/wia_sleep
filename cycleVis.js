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
  let hover_arc = d3.arc()
    .startAngle(function(d) {
      var str = d["Hours"].split("-");
      return (convertTimeStrToFrac(str[0])/24 * 360 * PI / 180);
    })
    .endAngle(function(d) {
      var str = d["Hours"].split("-");
      return (convertTimeStrToFrac(str[1])/24 * 360 * PI / 180);
    })
    .innerRadius(innerRad)
    .outerRadius(circleSize*0.58);

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
  let breakdown = {
    "monophasic": ["8h"], 
    "biphasic": ["6h", "1.5h"], 
    "everyman": ["3.5h", "20min", "20min", "20min"], 
    "dymaxion": ["30min", "30min", "30min", "30min"], 
    "uberman" : ["20min", "20min", "20min", "20min", "20min", "20min"]
  }
  let count = 0;

  // draw x-axis
  let axisScale = d3.scaleLinear()
    .domain([0, 24])
    .range([0, 2*Math.PI]);
  
  for (var i = (circleSpacing + circleSize*0.5); i < svgWidth; i = i+(circleSize+circleSpacing*2)) {
    // add background circle 
    svg.append("path")
      .attr("cycle", cycles[count])
      .attr("d", d3.arc()
        .innerRadius(innerRad) // hardcoded
        .outerRadius(circleSize*0.5) // hardcoded
        .startAngle(0)
        .endAngle(360 * PI / 180))
      .attr('transform', "translate(" + i + ", " + (svgHeight*0.6) + ")")
      .style("fill", backgroundColor)
      .on("mouseover", function() {
        let id = d3.select(this).attr("cycle");

        // handle circle animation
        d3.selectAll("." + id)
          .transition()
          .duration(500)
          .attr("d", hover_arc);

        // handle text animation
        d3.selectAll(".text_" + id)
          .transition()
          .duration(300)
          .style("opacity", 1);
      })
      .on("mouseout", function() {
        let id = d3.select(this).attr("cycle");

        // handle circle animation
        d3.selectAll("." + id)
          .transition()
          .duration(500)
          .attr("d", arc);

        // handle text animation
        d3.selectAll(".text_" + id)
          .transition()
          .duration(300)
          .style("opacity", 0);
      });
    
    // draw arcs for sleep time
    svg.selectAll(".marker")
      .data(data[cycles[count]])
      .enter()
      .append("path")
      .attr("class", cycles[count])
      .attr("d", arc)
      .attr('transform', "translate(" + i + ", " + (svgHeight*0.6) + ")")
      .style("fill", blueArcColor)
      .style("opacity", 0.8)
      .on("mouseover", function() {
        let id = d3.select(this).attr("class");

        // handle circle animation
        d3.selectAll("." + id)
          .transition()
          .duration(500)
          .attr("d", hover_arc);
        
        // handle text animation
        d3.selectAll(".text_" + id)
          .transition()
          .duration(300)
          .style("opacity", 1);
      })
      .on("mouseout", function() {
        let id = d3.select(this).attr("class");

        // handle circle animation
        d3.selectAll("." + id)
          .transition()
          .duration(500)
          .attr("d", arc);

        // handle text animation
        d3.selectAll(".text_" + id)
          .transition()
          .duration(300)
          .style("opacity", 0);
      });

    svg.selectAll(".markerText")
      .data(data[cycles[count]])
      .enter()
      .append("text")
      .attr("class", "text_" + cycles[count])
      .text(function(d, i) {
        let cycle = cycles[count];
        return breakdown[cycle][i];
      })
      .attr("transform", function(d) {
        var pos = arc.centroid(d);
        var x = pos[0];
        var y = pos[1];
        var hyp = Math.sqrt(x*x + y*y);
        return 'translate(' + (i + x/hyp*(circleSize*0.55+15)) + "," + ((svgHeight*0.6) + y/hyp*(circleSize*0.55+15))+ ')';
      })
      .style('text-anchor', function(d) {
        var str = d["Hours"].split("-");
        d["startAngle"] = convertTimeStrToFrac(str[0])/24 * 360 * PI / 180;
        d["endAngle"] = convertTimeStrToFrac(str[1])/24 * 360 * PI / 180;

        return (midAngle(d)) < Math.PI ? 'start' : 'end';
      })
      .style("font-family", "Rubik")
      .style("font-weight", "bold")
      .style("font-size", 12)
      .style("opacity", 0)
      .style("fill", textColor);

    //var str = d["Hours"].split("-");
    //return (convertTimeStrToFrac(str[0])/24 * 360 * PI / 180);

    // add title for sleep cycle
    svg.append("text")
      .attr("x", i)
      .attr("y", (svgHeight - circleSize)*0.6 - padding*2)
      .text(cycles[count])
      .style("font-family", "Rubik")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .style("font-size", 16);
    svg.append("text")
      .attr("x", i)
      .attr("y", (svgHeight+ circleSize)*0.6 + padding*2)
      .text(hours[count])
      .style("font-family", "Rubik")
      .style("text-anchor", "middle")
      // .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .style("font-size", 16);

    // svg.append('g')
    //   .call(d3.axisRadialOuter(
    //     axisScale, 
    //     circleSize*0.6)
    //   .tickFormat("")
    //   ).attr('transform', "translate(" + i + ", " + (svgHeight*0.6) + ")") 
    //   .style("opacity", 0.6)
    //   .selectAll("text")
    //     .style("font-family", "Rubik")
    //     .style("font-size", "12")
    //     .attr("text-anchor", function(d) {
    //       if (axisScale(d) < Math.PI) return "start";
    //       else return "end";
    //     });
    
    count++;
  }

  //24 hr time label
  svg.append("text")
    .attr("x", 0)
    .attr("y", svgHeight*0.75)
    .text("24 hr time ")
    .style("font-family", "Rubik")
    .style("font-weight", "bold")
    .style("font-size", 12)
    .style("fill", textColor);
  

  addBodyText(svg, 10, padding, textColor, [
    "Normally, when we think about sleep, we assume that people are following",
    "a monophasic sleep cycle where they sleep in one large chuck of time.",
    "However, there are other sleep cycles that take advantage of REM sleep",
    "duration and provides flexibility in how someone can manage their sleep hours (3). "
  ]);
}

function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }