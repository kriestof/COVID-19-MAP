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

import * as config from "../../config/world/main.js"

export default function formulaMenuComponent() {
  let formulaValue = config.PREDEFINED_INDICATORS[0].name
  let error = undefined
  let isFetching = undefined

  return {
    view: function(vnode) {
      function changeData(formula) {
        isFetching = true
        indicatorList.changeData(formula)
          .then(() => error = undefined)
          .catch((err) => error = err.message)
          .finally(function() { isFetching = false; m.redraw()})
      }

      let indicatorList = vnode.attrs.indicatorList
      return m("section.formula-menu", [
        m(".left-menu", [
          m("span.label", "Indicator:"),
          m("select", {onchange: function() {formulaValue = this.value; changeData(this.value)}},
            config.PREDEFINED_INDICATORS.map((ind) => m("option", {value: ind.formula}, ind.name)))
        ]),
        m(".right-menu", [
          m("span.help-text", [
            m("span.label", "or type:"),
            m("br"),
            m(m.route.Link, {href: "/help"}, "help?")
          ]),
          m(".formula-wrapper", [
            m("input.formula#formula", {
              type: "text",
              value: formulaValue,
              disabled: isFetching,
              onchange: function() {formulaValue = this.value; changeData(this.value)},
              class: error ? "error":""
            }),
            m(".formula-error", {title: error}, error)
          ])
        ])
      ])
    }
  }
}
