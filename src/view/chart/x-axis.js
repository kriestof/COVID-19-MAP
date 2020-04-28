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

export default function xAxis() {
  return {
    oncreate: function(vnode) {
      const MARGIN = vnode.attrs.MARGIN
      const SVG_SIZE = vnode.attrs.SVG_SIZE
      let x = vnode.attrs.x
      let ticksNum = (x.domain()[1]-x.domain()[0]) / (1000 * 60 * 60 * 24)
      ticksNum = ticksNum > 20 ? 20:ticksNum

      d3.select(vnode.dom)
        .append("g").attr("class", "grid x-grid")
        .attr("transform", `translate(${MARGIN.x}, ${SVG_SIZE.height+MARGIN.y})`)
        .call(d3.axisBottom(x).ticks(ticksNum)
          .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text").attr("transform", "rotate(-65)").attr("dx", "-.8em").attr("dy", ".15em").style("text-anchor", "end")
    },
    view: function(vnode) {
      return m("g")
    }
  }
}
