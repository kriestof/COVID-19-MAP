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

import m from "/web_modules/mithril.js"
import * as d3 from "/web_modules/d3.js"

export default function yAxis() {
  return {
    oncreate: function(vnode) {
      const MARGIN = vnode.attrs.MARGIN
      const SVG_SIZE = vnode.attrs.SVG_SIZE

      d3.select(vnode.dom).append("g").attr("class", "grid y-grid").call(d3.axisLeft(vnode.attrs.y)
        .tickFormat((d) => d3.format(",.0f")(d.toPrecision(2))))
        .attr("transform", `translate(${MARGIN.x}, ${MARGIN.y})`)
      d3.select(vnode.dom).append("g").attr("class", "grid y-grid y-gridlines").call(d3.axisLeft(vnode.attrs.y)
        .tickFormat("").tickSize(-SVG_SIZE.width))
        .attr("transform", `translate(${MARGIN.x}, ${MARGIN.y})`)
      d3.select(vnode.dom).select(".y-gridlines .domain").remove()
      d3.select(vnode.dom).selectAll(".y-gridlines line").attr("stroke", "#cecece")
    },
    view: function(vnode) {
      return m("g")
    }
  }
}
