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

export default function countryPathComponent() {
  return {
    view: function(vnode) {
      let indicatorList = vnode.attrs.indicatorList
      let countryPath = vnode.attrs.countryPath
      let val = indicatorList.getElement(countryPath.properties.name, parseFloat(vnode.attrs.selectedDate))
      if (!vnode.state.projectedPath)
        vnode.state.projectedPath = vnode.attrs.path(countryPath)

      return m("path", {
                style: "cursor: pointer;" + (vnode.state.active ? "stroke: #004d76; stroke-width: 3;":""),
                d: vnode.state.projectedPath,
                fill: val !== undefined ? d3.interpolateRdBu(vnode.attrs.scale(val)):"#ababab",
                onclick: function() {
                  if (!val) return
                  vnode.attrs.chartService.addCountry(countryPath.properties.name)
                },
                onmouseover: () => vnode.state.active = true,
                onmouseout: () => vnode.state.active = false,
                opacity: indicatorList.evalData ? 1:0
             }, m("title", `name: ${countryPath.properties.name}\n value: ${val !== undefined ? parseFloat(val.toPrecision(7)):"Not avaliable"}`))
    }
  }
}
