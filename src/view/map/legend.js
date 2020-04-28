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

export default function legendComponent() {
  return {
    view: function(vnode) {
      let entries = vnode.attrs.legendValues.map(function(val, id) {
        return m("g.legend-entry", [
          m("rect", {width: 15, height: 15, x: 20, y: (id+1)*25+20, fill: d3.interpolateRdBu(vnode.attrs.scale(val))}),
          m("text", {x: 40, y:(id+1)*25+20, dy: "0.8em", "font-family": "sans-serif",
            "font-size": "12px", fill: "white"}, val),
        ])
      })

      entries.unshift(m("g.legend-entry", [
        m("rect", {width: 15, height: 15, x: 20, y: 20, fill: "#ababab"}),
        m("text", {x: 40, y: 20, dy: "0.8em", "font-family": "sans-serif",
          "font-size": "12px", fill: "white"}, "Not avaliable"),
      ]))

      return m("g.legend", [
        m("rect", {width: 130, height: 250, fill: "#525252"}),
        m("g.entries", entries)
      ])
    }
  }
}
