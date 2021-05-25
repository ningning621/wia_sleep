function getFrequencyByKey(data, str, splitter="::", index = 0) {
  let map = new Map();
  for (var i = 0; i < data.length; i++) {
      let key = data[i][str].split(splitter)[index];
      // let key = data[i][str];
      if (!map.has(key)) {
          map.set(key, 1);
      } else {
          map.set(key, map.get(key) + 1);
      }
  }

  let sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  return sortedMap;
}

// example input: "2:45"
function convertTimeStrToFrac(str) {
  let arr = str.split(":");
  return Number(arr[0]) + (Number(arr[1])/60);
}

function calculateAvgHours(data) {
  let totalHours = 0;
  let totalDays = 31 + 28 + 31 + 30 + 22; // hardcoded
  for (var day of data) {
    let hour = day["Hours"].split("-");
    // console.log(hour)
    // console.log((convertTimeStrToFrac(hour[1])) - (convertTimeStrToFrac(hour[0])));
    totalHours = totalHours + (convertTimeStrToFrac(hour[1])) - (convertTimeStrToFrac(hour[0]));
  }

  return totalHours/totalDays;
}

/* FUNCTIONS FOR GETTING HARDCODED DATA */
function getAllNighters() {
  return [
    {"Month": 1, "Day": 10},
    {"Month": 1, "Day": 16},
    {"Month": 1, "Day": 25},
    {"Month": 1, "Day": 27},
    {"Month": 1, "Day": 29},
    {"Month": 1, "Day": 31},
    {"Month": 3, "Day": 17},
    {"Month": 3, "Day": 19},
    {"Month": 1, "Day": 28},
    {"Month": 4, "Day": 2},
    {"Month": 4, "Day": 7},
    {"Month": 4, "Day": 9}, 
    {"Month": 4, "Day": 14}, 
    {"Month": 5, "Day": 24}
  ];
}

function getWatchSleep() {
  return [
    {"Month": 2, "Day": 4},
    {"Month": 3, "Day": 3},
    {"Month": 3, "Day": 15},
    {"Month": 3, "Day": 22},
    {"Month": 3, "Day": 31},
    {"Month": 4, "Day": 1},
    {"Month": 4, "Day": 2},
    {"Month": 4, "Day": 5},
    {"Month": 4, "Day": 15},
    {"Month": 4, "Day": 17},
    {"Month": 4, "Day": 18},
    {"Month": 4, "Day": 23},
    {"Month": 5, "Day": 10},
    {"Month": 5, "Day": 20},
    {"Month": 5, "Day": 21},
    {"Month": 5, "Day": 23}
  ];
}

function getRevengeSleep() {
  return [
    {"Month": 1, "Day": 10},
    {"Month": 1, "Day": 16},
    {"Month": 1, "Day": 27},
    {"Month": 1, "Day": 29},
    {"Month": 2, "Day": 14},
    {"Month": 2, "Day": 15},
    {"Month": 2, "Day": 16},
    {"Month": 3, "Day": 26},
    {"Month": 3, "Day": 28},
    {"Month": 4, "Day": 7}
  ];
}

function getWorkSleep() {
  return [
    {"Month": 1, "Day": 25},
    {"Month": 2, "Day": 22},
    {"Month": 3, "Day": 8},
    {"Month": 3, "Day": 16},
    {"Month": 3, "Day": 17},
    {"Month": 3, "Day": 19},
    {"Month": 4, "Day": 2},
    {"Month": 4, "Day": 14},
    {"Month": 5, "Day": 8},
    {"Month": 5, "Day": 23},
    {"Month": 5, "Day": 24}
  ];
}

function getLegendSleepArcs() {
  return [
    {"Counter": 1, "Hours": "0:15-8:00"},
    {"Counter": 2, "Hours": "3:00-9:30"},
    {"Counter": 3, "Hours": "12:45-15:00"},
    {"Counter": 4, "Hours": "0:00-9:15"},
    {"Counter": 5, "Hours": "1:30-11:00"},
    {"Counter": 6, "Hours": "2:00-8:45"},
    {"Counter": 7, "Hours": "12:15-18:00"},
    {"Counter": 8, "Hours": "3:00-11:00"},
    {"Counter": 9, "Hours": "12:00-14:15"},
    {"Counter": 10, "Hours": "2:00-8:00"},
    {"Counter": 11, "Hours": "0:00-8:00"},
    {"Counter": 12, "Hours": "14:00-18:00"},
    {"Counter": 13, "Hours": "3:00-10:30"},
    {"Counter": 14, "Hours": "2:00-9:00"},
    {"Counter": 15, "Hours": "14:15-21:45"},
    {"Counter": 16, "Hours": "3:00-12:00"},
    {"Counter": 17, "Hours": "0:45-11:30"},
    {"Counter": 18, "Hours": "1:00-13:00"},
    {"Counter": 19, "Hours": "0:30-8:15"},
    {"Counter": 20, "Hours": "2:00-9:00"}
  ]
}

/* FUNCTIONS TO HANDLE DRAWING TEXT */
function addTitleText(svg, x, y, textColor, textLst) {
  let counter = 0;
  for (var text of textLst) {
    svg.append("text")
      .attr("x", x)
      .attr("y", y+35*counter)
      .text(text)
      .style("font-family", "Rubik")
      .style("font-weight", "bold")
      .style("font-size", 30)
      .style("fill", textColor);
      
    counter = counter + 1;
  }
}

function addBodyText(svg, x, y, textColor, textLst) {
  let counter = 0;
  for (var text of textLst) {
    svg.append("text")
      .attr("x", x)
      .attr("y", y+20*counter)
      .text(text)
      .style("font-family", "Proza Libre")
      .style("text-anchor", "left")
      .style("font-size", 16)
      .style("fill", textColor);
      
    counter = counter + 1;
  }
}

function addAnnotationText(svg, x, y, textColor, textLst) {
  let counter = 0;
  for (var text of textLst) {
    svg.append("text")
      .attr("x", x)
      .attr("y", y+15*counter)
      .text(text)
      // .attr("transform", "translate(-2.5, -2.5)")
      .style("font-family", "Rubik")
      .style("text-anchor", "left")
      .style("font-size", 12)
      .style("fill", textColor);
      
    counter = counter + 1;
  }
}

/* FUNCTIONS TO HANDLE TOOLTIP FUNCTIONALITY */
function addTooltipToVis(className) {
  return d3.select("body")
    .append("div")
    .attr("class", className)
    .style("padding", 10)
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr("white-space", "pre-line")
    .style("background-color", "#fbfbfb")
    .style("border-radius", "5px")
    .style("border", "1px solid #cdcdcd");
}

function updateToolTipText(tooltip, tooltipText, topOffset, leftOffset) {
  tooltip
    .html(tooltipText)
    .style("font-family", "Rubik")
    .style("font-size", "12px")
    .style("visibility", "visible")
    .style("text-align", "left")
    .style("max-width", 175)
    .style("top", function() { return event.pageY - topOffset + "px"; })
    .style("left", function() { return event.pageX - leftOffset +"px"; });
}

function hideTooltip(tooltip) {
  tooltip.style("visibility", "hidden");
}