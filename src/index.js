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

import IndicatorList from "./services/indicator-list.js"
import ChartService from "./services/chart.js"
import ScaleLimService from "./services/scale-lim.js"

import formulaMenuComponent from "./view/formula-menu/main.js"
import mapComponent from "./view/map/main.js"
import chartComponent from "./view/chart/main.js"
import scaleLimComponent from "./view/scale-limits/main.js"
import footerComponent from "./view/footer.js"
import headerComponent from "./view/header.js"
import {HELP_TEXT} from "./config/world/main.js"

let scaleLimService = new ScaleLimService()
let indicatorList = new IndicatorList(scaleLimService)
let chartService = new ChartService(indicatorList)

let rootComponent = {
  view: function(vnode) {
    return m("", [
      m(headerComponent, {text: "Interactive Pandemic Map"}),
      m("main.inner", [
      m("div", [
        m(formulaMenuComponent, {indicatorList: indicatorList}),
        m(mapComponent, {indicatorList: indicatorList, chartService: chartService, scaleLimService: scaleLimService}),
      ]),
      m("div", [
        m(scaleLimComponent, {indicatorList: indicatorList, scaleLimService: scaleLimService}),
        m(chartComponent, {indicatorList: indicatorList, chartService: chartService, scaleLimService: scaleLimService})
      ]),
        m(footerComponent)
      ])
    ])
  }
}

m.route(document.body, "/", {
  "/": rootComponent,
  "/help": {view: () => m("", [
    m(headerComponent, {text: "Interactive Pandemic Map - help"}),
    m("main.help", m.trust(HELP_TEXT)),
    m(footerComponent)
  ])}
})
