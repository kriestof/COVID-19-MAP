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
import {HELP_TEXT} from "/src/config/world/main.js"

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
