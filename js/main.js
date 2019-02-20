//
// Mapping with D3 -- Nicole White, Feb 2019
//


// Removes the pie chart
function removePieChart(){
  info_svg.selectAll("path").remove();
  info_svg.selectAll(".pie-chart-label").remove();
}

// Draws the pie chart
function drawPieChart(data){
  var r = 120

// Define an arc for the displayed chart and one for the labels
  var arc = d3.arc()
    .innerRadius(r - 70)
    .outerRadius(r)
    .cornerRadius(4)

  var labelArc = d3.arc()
     .innerRadius(r - 70)
     .outerRadius(r)

  var svg = d3.select(".pie-layer"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 +")")
    .attr("x", "200")
    .attr("y", "5")

  var arcs = d3.pie()(data);

// draw the chart
  var background = g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .style("fill", function(d,i){
        return d3.color("hsl(179, 50%, " + (d.value + 20) + "%)");
      })
      .attr("d", arc)
      .attr("id", "pie_path")
      var pos = labelArc.innerRadius(r + 2).outerRadius(r + 2);
      var getAngle = function (d) {
      return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
  };

// Draw pie chart labels
  g.selectAll("text")
  .data(arcs)
  .enter()
  .append("text")
  .attr("class", "pie-chart-label")
  .attr("transform", function(d,i) {
    if(getAngle(d) > 90) {
      myAngle = getAngle(d) + 180          // no upside-down labels
    }
    else {
      myAngle = getAngle(d)
    }
    return "translate(" + pos.centroid(d) + ") " +
           "rotate(" + myAngle + ")";
    })
  .attr("dy", 5)
  .style("text-anchor", function(d) {
    if (getAngle(d) > 90) {
      return 'end'
    }
      else {
        return 'begin'
      }
    }
  )
  .text(function(d,i) {
    if(d.value == 0) { return ''}      // Don't display labels for zeros
    else{ return pie_chart_categories[i]};
  });

};


// Draws the bar chart
function drawChart(dataArray, layer){
  var selection = layer.selectAll( "rect" )
                       .data( dataArray );
    selection.enter()
      .append( "rect" )
      .attr( "x", function(d,i){
        return i*35+80;
      })
      .attr( "width", 25 )
      .attr( "style", "fill: rgba(0,0,0,0.25);" )
      .attr( "height", function(d){
        return d/10 * 6.5;
      })
      .attr( "y", function(d){
        return 150 - d/10 * 6.5;
      })
}


// Add bar chart labels
function chartLabels( dataArray ){
  info_svg.selectAll("text").remove() // this seems to be necessary to make all labels appear
  var selection = info_svg.selectAll( "text" )
                       .data( dataArray );
    selection.enter()
      .append( "text" )
      .attr("class", "chart-label")
      .attr("font-size", "12")
      .attr("text-anchor", "end")
      .text(function (d) {return d; })
      .attr("fill", "#000")
      .attr("transform", function(d, i){
        x = 210 + (i + 1) * 36
        return "translate("+ x + "," +  310 + ") rotate(-45)";
      });
}


// Removes the bar chart
function removeCharts() {
  bar1layer.selectAll('rect').remove()
  bar2layer.selectAll('rect').remove()
  info_svg.selectAll('text').remove()
}

// Returns name of geographic division
function getName(d){
  return d.properties.csdname;
};

// Get symbology fill color
function symbolizeFill(d){
  switch (getName(d)) {
    case 'Town and Municipality of Digby':
      return '#B2EBEB'
      break;
    case 'Clare':
      return '#ABD5D5'
      break;
    case 'Shelburne and Lockeport':
      return '#CCDBDB'
      break;
    case 'Argyle':
      return '#CCF5F5'
      break;
    case 'Municipality of Yarmouth':
      return '#99B8B8'
      break;
    case 'Town of Yarmouth':
      return '#2D9595'
      break;
    case "Barrington and Clark's Harbour":
      return '#99CCCC'
      break;
  }
}

function showPointLegend(){
  var svg = pieLayer.append("svg")
  var g = svg.append("g");
  var img = g.append("svg:image")
      .attr("xlink:href", "img/people.svg")
      .attr("width", 200)
      .attr("height", 200)
      .attr("x", 30)
      .attr("y",170);
}

function removePointsLegend(){
  pieLayer.selectAll("image").remove()
}

function showIntroText(){
  var svg = introTextLayer.append("svg")
  var g = svg.append("g");
  g.append("text")
      .text("This map visualizes Nova Scotian survey participants' answers to the question:")
      .attr("fill", "#000")
      .attr("x", 50)
      .attr("y",463);
  g.append("text")
      .text("'Can you stay where you're currently living?'")
      .attr("fill", "#000")
      .attr("x", 50)
      .attr("y",493);
  g.append("text")
      .text("Click on a region within the map for a more granular look at the data.")
      .attr("fill", "#000")
      .attr("x", 50)
      .attr("y",523);
  g.append("image")
      .attr("xlink:href", "img/legend.svg")
      .attr("width", 200)
      .attr("height", 200)
      .attr("x", 50)
      .attr("y",0);
  g.append("text")
      .text("Yarmouth, Shelburne, and Digby Counties")
      .attr("fill", "#000")
      .attr("x", 50)
      .attr("y",25);
}

function removeIntroText(){
  introTextLayer.selectAll("text").remove();
  introTextLayer.selectAll("image").remove();
  introTextLayer.selectAll("svg").remove();
}

// Display feature name and other text when zoomed in
function showTitleText(name) {
  var svg = introTextLayer.append("svg")
  var g = svg.append("g");

  g.append("text")
    .text(name)
    .attr("class", "title-text")
    .attr("fill", "#000")
    .attr("x", 50)
    .attr("y",25);

  g.append("text")
    .text("What is your ideal next residence?")
    .attr("fill", "#000")
    .attr("x", 260)
    .attr("y", 60)
}

function removeTitleText(){
  introTextLayer.selectAll("svg").remove();
}

function getPieData(d) {
  // Show the right pie chart when you zoom in
  switch (getName(d)) {
    case 'Town and Municipality of Digby':
      return  digby_normal;
      break;
    case 'Clare':
      return  clare_normal;
      break;
    case 'Shelburne and Lockeport':
      return  shel_normal;
      break;
    case 'Argyle':
      return  arg_normal;
      break;
    case 'Municipality of Yarmouth':
      return  y_mun_normal;
      break;
    case 'Town of Yarmouth':
      return y_town_normal;
      break;
    case "Barrington and Clark's Harbour":
      return bar_normal;
      break;
  }
}

// What happens when the map is clicked
function clicked(d) {
  removePoints();
  removePointsLegend();
  info_svg.selectAll(".pointer").remove();

  pie_data = getPieData(d)

  var x, y, k;

  // Compute centroid of the selected path for zooming in on
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = d.properties.zoom;  // custom zoom extent is stored in JSON
    centered = d;
    removeCharts();
    removeIntroText();
    drawPieChart(pie_data);
    addPoints(d);
    showPointLegend();
    showTitleText(getName(d));

  } else {  // Zoom out
    x = mapwidth / 2;
    y = mapheight / 2;
    k = 1;
    centered = null;
    removePoints();
    removePieChart();
    removePointsLegend();
    drawChart(can_stay_data, bar1layer);
    drawChart(cant_stay_data, bar2layer);
    chartLabels(names);
    removeTitleText();
    showIntroText();
  }

  // Highlight the clicked area
  mapLayer.selectAll('path')
    .style('fill', function(d){return centered && d===centered ? '#FFE4A1' : symbolizeFill(d);});

  // zoom in
  g.transition()
  .duration(750)
  .attr('transform', 'translate(' + mapwidth / 2 + ',' + mapheight / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');

} //end clicked

// Draw the dot density 'stay or go' layer
function addPoints(d) {
    var points_url = "json/stay_" + getName(d) + ".geojson";

  // Add Point layer
   d3.json(points_url, function(err, geojson) {
    if (d.properties.CSD_Stats_CSDarea > 600) {
         pointLayer.selectAll('path')
         .data(geojson.features)
         .enter().append('path')
         .attr('d', path)
         .attr('class','mypts')
         .attr("d", path.pointRadius(6))
         .style("fill", stylePoints1)
       }
    else if (d.properties.CSD_Stats_CSDarea < 600 && d.properties.CSD_Stats_CSDarea > 30){
      pointLayer.selectAll('path')
      .data(geojson.features)
      .enter().append('path')
      .attr('d', path)
      .attr('class','mypts')
      .attr("d", path.pointRadius(4))
      .style("fill", stylePoints2)
    }
    else {
      pointLayer.selectAll('path')
      .data(geojson.features)
      .enter().append('path')
      .attr('d', path)
      .attr('class','mypts')
      .attr("d", path.pointRadius(1))
      .style("fill", stylePoints3)
    };
     });
}

// Add custom icons to the point layer
function stylePoints1(d) {
if (d.properties.can_stay == 1) {return 'url(#img1_solid)'}
else if (d.properties.can_stay == 0) {return 'url(#img1_transp)'};
}

function stylePoints2(d) {
if (d.properties.can_stay == 1) {return 'url(#img2_solid)'}
else if (d.properties.can_stay == 0) {return 'url(#img2_transp)'};
}

function stylePoints3(d) {
if (d.properties.can_stay == 1) {return 'url(#img3_solid)'}
else if (d.properties.can_stay == 0) {return 'url(#img3_transp)'};
}

// Remove the point layer
function removePoints(d) {
  pointLayer.selectAll('path').remove();
}

// Highlight features on mouseover
function mouseover(d){
  // Highlight hovered area
  d3.select(this).style('fill', '#FFFFE6');
  // Draw effects
  hoverName(getName(d));
}

// Reset colour and remove text on mouseout
function mouseout(d){
  mapLayer.selectAll('path')
    .style('fill', function(d){return centered && d===centered ? '#FFE4A1' : symbolizeFill(d);});

  infoLayer.selectAll('text').transition()
    .style('opacity', 0)
    .remove();
}

// Display the feature name
function hoverName(text){
  var positions = [300,550]
  var selection = infoLayer.selectAll('text')
  .data(positions, function(d){});

    selection.enter().append('text')
    .text(text)
    .attr('x', positions[0])
    .attr('y', positions[1])
    .attr('class', 'label');
}

// Set dimensions for the map area
var mapwidth = 600;
var mapheight = 600;
var centered;

// Set dimensions for the right div
var infowidth = 700;
var infoheight = 600;

// Data to be visualized:
// Num of survey respondents who said they can stay
var can_stay_data = [329, 71, 166, 145, 149, 181, 133];

// Num of survey respondents who said they can't stay or are unsure
var cant_stay_data = [45, 68, 40, 109, 138, 70, 78];

// Names of the study areas
var names = ['Argyle', "Barrington", 'Clare',
             'Digby', 'Shelburne',
             'Yarmouth (M)', 'Yarmouth (T)'];

// Categories for the pie chart
var pie_chart_categories = ['Apartment', 'Assisted Living', 'Boarding House',
                            'Condominium', 'Co-op', 'Group Housing',
                            'Independent Living', 'Nursing Home',
                            "Seniors' Residence", 'Shared Housing',
                            'Social Housing', 'Other'];

// Data for the pie charts, raw figures (num of respondants) and normalized
// (percentage of total for each response)
// A better way to do this would be possibly storing all of this data within
// the JSON files so different datasets can be loaded
var y_mun_data = [56, 15, 2, 18, 16, 0, 31, 5, 46, 8, 32, 4];
var y_mun_normal = [24.03, 6.44, 0.86, 7.73, 6.87, 0.0, 13.3, 2.15, 19.74,
                    3.43, 13.73, 1.72];
var digby_data = [63, 11, 0, 19, 17, 0, 27, 5, 45, 11, 49, 3];
var digby_normal = [25.2, 4.4, 0.0, 7.6, 6.8, 0.0, 10.8, 2.0, 18.0, 4.4, 19.6,
                    1.2];
var clare_data = [86, 12, 1, 24, 13, 1, 19, 4, 33, 14, 29, 1];
var clare_normal = [36.29, 5.06, 0.42, 10.13, 5.49, 0.42, 8.02, 1.69, 13.92,
                    5.91, 12.24, 0.42];
var bar_data =[33, 2, 1, 6, 5, 0, 7, 0, 10, 0, 18, 2];
var bar_normal = [39.29, 2.38, 1.19, 7.14, 5.95, 0.0, 8.33, 0.0, 11.9, 0.0,
                  21.43, 2.38];
var arg_data = [146, 20, 0, 52, 51, 4, 46, 5, 65, 10, 61, 2];
var arg_normal = [31.6, 4.33, 0.0, 11.26, 11.04, 0.87, 9.96, 1.08, 14.07, 2.16,
                  13.2, 0.43];
var shel_data =[49, 4, 4, 14, 9, 0, 18, 3, 24, 5, 27, 3];
var shel_normal = [30.63, 2.5, 2.5, 8.75, 5.62, 0.0, 11.25, 1.88, 15.0, 3.12,
                   16.88, 1.88];
var y_town_data = [120, 6, 1, 23, 33, 0, 19, 1, 21, 7, 65, 3];
var y_town_normal = [40.13, 2.01, 0.33, 7.69, 11.04, 0.0, 6.35, 0.33, 7.02,
                     2.34, 21.74, 1.0]

// Geo Mercator projection centered on Nova Scotia
var projection = d3.geoMercator()
  .scale(18000)
  .translate([mapwidth / 2, mapheight / 2])
  .center( [5.6, 44.05] )
  .rotate( [71.1,-0.01] )

// Get SVG paths from the projection
var path = d3.geoPath()
  .projection(projection);

// SVGs to stick data on
var svg = d3.select("body").append("svg")
    .attr('width', mapwidth)
    .attr('height', mapheight)
    .classed('map-layer', true)

var info_svg = d3.select("body").append("svg")
   .attr('width', infowidth)
   .attr('height', infoheight)
   .attr("class", "background")

 var pieLayer = info_svg.append("svg")
   .attr('width', infowidth)
   .attr('height', infoheight)
   .attr('class', 'pie-layer')

 var introTextLayer = info_svg.append("svg")
   .attr('width', infowidth)
   .attr('height', infoheight)
   .attr('class', 'info-text-layer')

var bar1layer = info_svg.append("svg")
   .attr('width', infowidth)
   .attr('height', infoheight)
   .attr('x', '150')
   .attr('y', '150')


var bar2layer = info_svg.append("svg")
  .attr('width', infowidth)
  .attr('height', infoheight)
  .attr('x', '150')
  .attr('y', '150')

var numericLabelLayer = info_svg.append("svg")
  .attr('width', infowidth)
  .attr('height', infoheight)
  .attr('x', '150')
  .attr('y', '150')

// Style defs for custom icon SVGs
var defs = svg.append("svg:defs");

defs.append("svg:pattern")
.attr("id","img1_solid")
.attr("width", "8")
.attr("height", "8")
.attr("patternUnit", "userSpaceOnUse")
.append("svg:image")
.attr("xlink:href", "img/person.svg")
.attr("width", "8")
.attr("height","8")
.attr("x","0.6")
.attr("y", "0.6");

defs.append("svg:pattern")
.attr("id","img1_transp")
.attr("width", "8")
.attr("height", "8")
.attr("patternUnit", "userSpaceOnUse")
.append("svg:image")
.attr("xlink:href", "img/person.svg")
.attr("width", "8")
.attr("height","8")
.attr("x","0.6")
.attr("y", "0.6")
.style("opacity", 0.45)
;

defs.append("svg:pattern")
.attr("id","img2_solid")
.attr("width", "8")
.attr("height", "8")
.attr("patternUnit", "userSpaceOnUse")
.append("svg:image")
.attr("xlink:href", "img/person.svg")
.attr("width", "6")
.attr("height","6")
.attr("x","1.6")
.attr("y", "1.6");

defs.append("svg:pattern")
.attr("id","img2_transp")
.attr("width", "8")
.attr("height", "8")
.attr("patternUnit", "userSpaceOnUse")
.append("svg:image")
.attr("xlink:href", "img/person.svg")
.attr("width", "6")
.attr("height","6")
.attr("x","1.6")
.attr("y", "1.6")
.style("opacity", 0.45)
;

defs.append("svg:pattern")
.attr("id","img3_solid")
.attr("width", "1")
.attr("height", "1")
.attr("patternUnit", "userSpaceOnUse")
.append("svg:image")
.attr("xlink:href", "img/person.svg")
.attr("width", "1")
.attr("height","1")
.attr("x","0.26")
.attr("y", "0.39");

defs.append("svg:pattern")
.attr("id","img3_transp")
.attr("width", "1")
.attr("height", "1")
.attr("patternUnit", "userSpaceOnUse")
.append("svg:image")
.attr("xlink:href", "img/person.svg")
.attr("width", "1")
.attr("height","1")
.attr("x","0.26")
.attr("y", "0.39")
.style("opacity", 0.45);

// Add background
svg.append('rect')
  .attr('class', 'background')
  .attr('width', mapwidth)
  .attr('height', mapheight)
  .on('click', clicked);

// Layers for data visualization
var g = svg.append('g');
var outlineLayer = g.append('g')
var mapLayer = g.append('g');
var pointLayer = g.append('g');
var infoLayer = g.append('g');

// Geographic features stored as GeoJSON
var tri_url = "json/tri4.geojson";
// var outline_url = "json/tri4_outline.geojson" // outline for glow effect
// commented out because it was creating slow loading times

// Add the bar charts, labels etc. for initial view
drawChart(can_stay_data, bar1layer);
drawChart(cant_stay_data, bar2layer);
chartLabels(names);
showIntroText();

// Load JSON data
d3.json(tri_url, function(err, geojson) {
  // Each feature becomes a path
  mapLayer.selectAll("path")
  .data(geojson.features)
  .enter().append("path")
  .attr("d", path)
  .attr('vector-effect', 'non-scaling-stroke')
  .style('fill', symbolizeFill)
  .attr( "id", "tricounties")
  .on("mouseover", mouseover)
  .on("mouseout", mouseout)
  .on("click", clicked)
});

// Load different pages when the user clicks the tabs
document.getElementById("doc-tab").onclick = function(){
  d3.selectAll("svg").remove();
}

document.getElementById("attr-tab").onclick = function() {
  d3.selectAll("svg").remove();
}

document.getElementById("vis-tab").onclick = function() {
  document.location.reload();
}

// Outline layer
// d3.json(outline_url, function(err, geojson) {
//   outlineLayer.selectAll("path")
//   .data(geojson.features)
//   .enter().append("path")
//   .attr("d", path)
//   // .style('filter', 'blur(3px)')
//   .attr( "id", "tricounties_outline")
//
// });
