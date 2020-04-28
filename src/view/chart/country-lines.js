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

export default function countryLines() {
  let mouseover = {}

  return {
    view: function(vnode) {
      let chartService = vnode.attrs.chartService
      let indicatorList = vnode.attrs.indicatorList
      const MARGIN = vnode.attrs.MARGIN
      let x = vnode.attrs.x
      let y = vnode.attrs.y

      return m("g",
        chartService.countries.map(function(country) {
          let tsData = indicatorList.getCountryTs(country.name)
          let dates = indicatorList.getDates()
          let chartArray = []

          for (let i = 0; i < tsData.length; i+=1)
            if (!Number.isNaN(tsData[i]) && Number.isFinite(tsData[i]) &&
              y.domain()[0] <= tsData[i] &&
              x.domain()[0] < dates[i] && x.domain()[1] >= dates[i])
              chartArray.push({time: new Date(dates[i]), value: tsData[i]})

          return m("g.country", [
            m("path", {fill: "none",
              stroke: country.color,
              "stroke-width": 3,
              "d": d3.line()
                    .x((d) => x(d.time)+MARGIN.x)
                    .y((d) => y(d.value)+MARGIN.y)(chartArray)
            }),
            vnode.attrs.showPoints ? m("g.points", chartArray.map(function(point) {
              return m("circle", {
                stroke: mouseover[point.time] ? country.color:null,
                fill: mouseover[point.time] ? "white":country.color,
                cx: x(point.time)+MARGIN.x,
                cy: y(point.value)+MARGIN.y,
                r: 5,
                "stroke-width": "2px",
                onmouseover: () => mouseover[point.time] = true,
                onmouseout: () => mouseover[point.time] = false,
              }, m("title", `country: ${country.name}\n value: ${point.value} \n date: ${d3.timeFormat("%Y-%m-%d")(point.time)}`))
            })):""
          ])
        }))
    }
  }
}
