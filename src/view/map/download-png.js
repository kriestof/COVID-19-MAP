// Copyright 2020 Krzysztof Piwoński <piwonski.kris@gmail.com>
//
// This file is a part of COVID-19 map.
//
// COVID-19 map is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// COVID-19 map is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as d3 from "/web_modules/d3.js"

import {downloadPng} from "../../utils.js"

export default function downloadMapPng(indicatorList) {
  let mapSvg = d3.select("#map svg")
  let downloadSvg = d3.select(mapSvg.node().cloneNode(true))
  downloadSvg.attr("width", mapSvg.node().width.baseVal.value)
  downloadSvg.attr("height",mapSvg.node().height.baseVal.value+90)

  downloadSvg.selectAll(".country-paths, .legend").attr("transform", "translate(0, 40)")

  downloadSvg.append("rect")
    .attr("y", downloadSvg.attr("height")-50)
    .attr("height", 50)
    .attr("width", "100%")
    .attr("fill", "#525252")

  downloadSvg
    .append("text")
    .attr("y", downloadSvg.attr("height")-28).attr("x", 5)
    .text(`source: covid19map.icm.edu.pl |
      date: ${d3.timeFormat("%d-%m-%Y")(new Date(d3.select("#selected-date").text()))} |
      formula: ${indicatorList.formula}`)
    .style("fill", "white")
    .style("font-family", "sans-serif")
    .style("font-size", "12px")

  downloadSvg
    .append("text")
    .attr("y", downloadSvg.attr("height")-8).attr("x", 5)
    .text("ICM University of Warsaw. COVID-19 chart and map. © 2020 Krzysztof Piwoński. Based on data collected by Johns Hopkins CSSE and World Bank.")
    .style("fill", "white")
    .style("font-family", "sans-serif")
    .style("font-size", "12px")

  downloadSvg.append("rect")
    .attr("height", 40)
    .attr("width", "100%")
    .attr("fill", "#525252")


  downloadSvg
    .append("text")
    .text("Interactive Pandemic Map")
    .attr("x", 70).attr("y", 28)
    .style("fill", "white")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .style("font-size", "20px")

  downloadSvg
      .append("path")
      .attr("d", "M 128.8125 0 C 127.79862 0.02280949 126.77145 0.10992188 125.71875 0.21875 C 102.50037 2.61875 76.172875 23.84875 55.96875 53.65625 C 56.2925 53.65625 56.61425 53.66505 56.9375 53.65625 C 73.829625 30.12375 95.106005 13.6575 113.96875 11.84375 L 114 11.84375 C 144.20062 8.9325 155.91625 47.502125 140.1875 98 C 135.58125 112.78912 129.19675 126.69238 121.75 138.96875 L 121.75 90.78125 L 94.90625 90.78125 L 94.90625 148.875 C 105.28075 151.82862 119.04537 155.09612 130.90625 155.71875 C 134.805 149.72362 138.52 143.34725 141.9375 136.65625 C 146.0625 153.28475 160.0125 163.125 180.25 163.125 C 188.4075 163.125 195.99 162.1075 200.28125 160.03125 L 197.46875 140.4375 C 194.05375 141.76512 190.33875 142.375 185.75 142.375 C 176.2475 142.375 168.09375 136.74412 168.09375 124.875 C 167.94875 114.34275 175.06375 107.5 185 107.5 C 190.4925 107.5 194.0325 108.24263 196.5625 109.28125 L 200.28125 89.71875 C 195.095 87.940375 188.69375 87.1875 183.5 87.1875 C 173.41875 87.1875 165.125 89.443875 158.59375 93.25 C 172.89492 39.505082 160.24281 -0.7070942 128.8125 0 z M 108.40625 57.84375 C 100.9355 57.84375 95.8555 62.1725 94.90625 68.4375 C 51.229 54.8075 10.067375 62.803375 1.5625 87.1875 C -7.2627 112.49999 22.44675 145.88862 67.9375 161.75 C 78.209875 165.3335 88.4205 167.6865 98.15625 168.9375 C 85.21925 181.27538 71.414 188.53125 58.9375 188.25 C 40.090875 187.82362 28.539125 171.5435 26.6875 147.40625 C 25.538125 146.69975 24.415 145.99025 23.3125 145.25 C 21.58 181.0855 35.598625 206.74512 61 207.65625 C 81.970625 208.41357 106.22613 190.6025 126.09375 162.8125 C 122.62462 162.57375 117.48787 162.13625 112.46875 161.4375 C 104.72512 160.34775 97.192375 158.79788 94.90625 158.3125 C 88.673875 157.11113 82.294875 155.42625 75.875 153.1875 C 35.386125 139.07138 8.9272125 109.372 16.78125 86.84375 C 24.022375 66.069125 57.90725 58.68125 94.875 68.71875 C 94.79887 69.3325 94.75 69.94625 94.75 70.59375 C 94.75 77.56625 99.94425 83.21875 108.25 83.21875 L 108.40625 83.21875 C 116.71187 83.21875 122.03125 77.56625 122.03125 70.59375 C 121.88225 63.1775 116.71187 57.84375 108.40625 57.84375 z M 256.5 87.03125 C 243.88375 87.03125 237.5175 94.162625 234.84375 97.875 L 234.25 97.875 L 233.1875 88.65625 L 210.8125 88.65625 C 211.10125 95.484875 211.40625 103.80125 211.40625 113.59375 L 211.40625 161.65625 L 237.34375 161.65625 L 237.34375 119.96875 C 237.34375 118.189 237.505 116.27975 238.09375 114.5 C 239.13125 112.1245 241.50625 108.5625 246.25 108.5625 C 252.33625 108.5625 254.875 113.876 254.875 122.03125 L 254.875 161.65625 L 280.8125 161.65625 L 280.8125 120.125 C 280.8125 118.49062 280.9675 116.26325 281.5625 114.78125 C 282.745 111.21437 285.41 108.5625 289.71875 108.5625 C 295.645 108.5625 298.3125 113.73925 298.3125 122.78125 L 298.3125 161.65625 L 324.28125 161.65625 L 324.28125 118.78125 C 324.28125 98.457495 315.21875 87.03125 299.5 87.03125 C 294.605 87.03125 290.30625 88.076125 286.59375 90 C 282.73625 92.077625 279.3175 94.8925 276.5 98.75 L 276.21875 98.75 C 273.1025 91.333 265.84 87.03125 256.5 87.03125 z ")
      .attr("style", "fill:#008b76;fill-opacity:1;fill-rule:nonzero;stroke:none")
      .attr("transform", "translate(20, 9) scale(0.12)")

  downloadPng(downloadSvg, "COVID19-map.png")
}
