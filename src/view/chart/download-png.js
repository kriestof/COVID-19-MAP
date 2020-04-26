import * as d3 from "/web_modules/d3.js"

import {downloadPng} from "../../utils.js"

export default function downloadChartPng(MARGIN) {
  let chartSvg = d3.select("#chart svg")
  let downloadSvg = d3.select(chartSvg.node().cloneNode(true))
  downloadSvg.attr("width", chartSvg.node().width.baseVal.value)
  downloadSvg.attr("height",chartSvg.node().height.baseVal.value)

  downloadSvg.selectAll(".remove-label").remove()
  downloadSvg.selectAll(".text-label").attr("x", 40)

  downloadSvg
    .append("text")
    .text("source: covid19chart.info")
    .attr("y", downloadSvg.attr("height")-5).attr("x", MARGIN.x)
    .attr("fill", "#595959")
    .style("font-family", "sans-serif")
    .style("font-size", "12px")

  downloadSvg
    .append("text")
    .text("formula: " + d3.select("#formula").node().value)
    .attr("y", downloadSvg.attr("height")-20).attr("x", MARGIN.x)
    .attr("fill", "#595959")
    .style("font-family", "sans-serif")
    .style("font-size", "12px")

  downloadPng(downloadSvg, "COVID19-chart.png")
}
