import * as d3 from "/web_modules/d3.js"

import {downloadPng} from "../../utils.js"

export default function downloadMapPng(indicatorList) {
  let mapSvg = d3.select("#map svg")
  let downloadSvg = d3.select(mapSvg.node().cloneNode(true))
  downloadSvg.attr("width", mapSvg.node().width.baseVal.value)
  downloadSvg.attr("height",mapSvg.node().height.baseVal.value)

  downloadSvg.append("rect")
    .attr("y", downloadSvg.attr("height")-55)
    .attr("height", 55)
    .attr("width", Math.max(indicatorList.formula.length*6.5+80, 165))
    .attr("fill", "#525252")

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

    downloadSvg
      .append("text")
      .text("formula: " + indicatorList.formula)
      .attr("y", downloadSvg.attr("height")-37).attr("x", 5)
      .attr("fill", "white")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")

  downloadPng(downloadSvg, "COVID19-map.png")
}
