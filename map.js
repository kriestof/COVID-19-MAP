// Copyright 2020 Krzysztof Piwoński <piwonski.kris@gmail.com>
//
// This file is a part of COVID-19 chart.
//
// COVID-19 chart is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// COVID-19 chart is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

function worldMap(confirmedData, svg) {
  let projection = d3.geoRobinson()
  const PROJECTION_SCALE_WORLD = projection.scale()
  const PROJECTION_TRANSLATE_WORLD = projection.translate()
  if (region == "europe")
    projection = projection.scale(700).translate([300, 930])

  let path = d3.geoPath().projection(projection)
  let scale = d3.scaleLog().domain([100,1000000]).base(4)
  svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "#4d4d4d")


  world = undefined

  let tooltip = undefined


  function initMap() {
    let legend = svg.selectAll('g.legendEntry')
        .data([0].concat([100, 500, 1000, 5000, 25000, 100000, 500000]))
        .enter()
        .append('g').attr('class', 'legendEntry');

    legend
       .append('rect')
       .attr("x", 20)
       .attr("y", (d, i) => i * 25 + 20)
       .attr("width", 15)
       .attr("height", 15)
       .attr("fill", (d) => d ? d3.interpolateYlOrRd(scale(d)):"white")

     legend
         .append('text')
         .attr("x", 40)
         .attr("y", (d, i) => i * 25 + 20)
         .attr("dy", "0.8em")
         .text((d,i) => d)
         .style("font-family", "sans-serif")
         .style("font-size", "12px")
         .style("fill", "white");

    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let dates = confirmedData.columns.slice(4, confirmedData.columns.length)
    let dateEl = d3.select("#date")
      .attr("max", dates.length-1)
      .on("input", function() {
      displayMapForDate(dates[this.value])
    })
    dateEl.node().value = dates.length-1

    d3.select("#map-outer a").on("click", downloadMapPng)

    return d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then((data) => world = data)
    .then(drawWorld)
  }

  function drawWorld() {
    svg.selectAll("path")
       .data(topojson.feature(world,world.objects.countries).features)
       .enter().append("path")
       .attr("d", path)
       .attr("fill", "green")
       .style("cursor", "pointer");
    svg.selectAll("path")
    .on("mouseover", function(d) {
      d3.select(this).attr("stroke", "#004d76").attr("stroke-width", "3")
      tooltip
        .html(`country: ${d.properties.name} </br> value: ${d.properties.value ? d.properties.value:0}`)
        .style("top", d3.mouse(this)[1] + "px")
        .style("left", d3.mouse(this)[0] + "px")
        .style("opacity", 0.9)
    })
    .on("mouseout", function() {
      d3.select(this).attr("stroke", "")
      tooltip.style("opacity", 0)
    })
    .on("click", function(d) {
        chart.drawChart(d.properties.name)
    })
  }

  function displayRegion(region) {
    if (region == "world") {
      projection = projection.scale(PROJECTION_SCALE_WORLD).translate(PROJECTION_TRANSLATE_WORLD)
      svg.selectAll("path").remove()
      drawWorld()
      displayMapForDate()
    }

    if (region == "europe") {
      projection = projection.scale(700).translate([300, 930])
      svg.selectAll("path").remove()
      drawWorld()
      displayMapForDate()
    }
  }

  function displayMapForDate(date) {
    if (!date)
      date = d3.select("#selected-date").text()
    d3.select("#selected-date").text(date)

    let prevDay = new Date(date)
    prevDay.setDate(prevDay.getDate()-1)
    prevDay = d3.timeFormat("%-m/%-d/%y")(prevDay)

    countriesData =  d3.nest()
      .key((d) => d["Country/Region"])
      .rollup((v) => d3.sum(v, (d) => mode == "all"? parseFloat(d[date]):parseFloat(d[date]) - parseFloat(d[prevDay])))
      .object(confirmedData)

    svg.selectAll("path").
        attr("fill", (d) => (countriesData[d.properties.name])?
          d3.interpolateYlOrRd(scale(countriesData[d.properties.name])):"white").
        each((d) => d.properties.value = countriesData[d.properties.name])
  }

  function downloadMapPng() {
    d3.event.preventDefault()

    downloadSvg = d3.select(mapSvg.node().cloneNode(true))
    downloadSvg.attr("width", mapSvg.node().width.baseVal.value)
    downloadSvg.attr("height",mapSvg.node().height.baseVal.value)

    downloadSvg
      .append("text")
      .text("source: covid19chart.info")
      .attr("y", downloadSvg.attr("height")-7).attr("x", 5)
      .attr("fill", "white")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")

      downloadSvg
        .append("text")
        .text(`date: ${d3.timeFormat("%d-%m-%Y")(new Date(d3.select("#selected-date").text()))}`)
        .attr("y", downloadSvg.attr("height")-21).attr("x", 5)
        .attr("fill", "white")
        .style("font-family", "sans-serif")
        .style("font-size", "12px")

    downloadPng(downloadSvg, "COVID19-map.png")
  }

  return {
    displayMapForDate: displayMapForDate,
    displayRegion: displayRegion,
    initMap: initMap,
    downloadMapPng: downloadMapPng
  }
}
