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

export default function legend() {
  return {
    view: function(vnode) {
      let chartService = vnode.attrs.chartService
      const MARGIN = vnode.attrs.MARGIN

      return m("g", {transform: `translate(${MARGIN.x},0)`}, chartService.countries.map(function(country, id) {
        return m("g", [
          m("rect", {
            x: 20,
            y: id*25+20,
            width: 15,
            height: 15,
            fill: country.color
          }),
          m("text.remove-label", {
              x: 40,
              y: id*25+22,
              dy: "0.8em",
              "font-family": "sans-serif",
              "font-size": "12px",
              fill: "red",
              style: "cursor: pointer;",
              onclick: () => chartService.removeCountry(country)
          },"[x]"),
          m("text.text-label", {
            x: 60,
            y: id*25+22,
            dy: "0.8em",
            "font-family": "sans-serif",
            "font-size": "12px"
          }, country.name)
        ])
      }))
    }
  }
}
