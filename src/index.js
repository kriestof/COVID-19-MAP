import IndicatorList from "./services/indicator-list.js"
import ChartService from "./services/chart.js"
import ScaleLimService from "./services/scale-lim.js"

import formulaMenuComponent from "./view/formula-menu/main.js"
import mapComponent from "./view/map/main.js"
import chartComponent from "./view/chart/main.js"
import scaleLimComponent from "./view/scale-limits/main.js"
import footerComponent from "./view/footer.js"

let scaleLimService = new ScaleLimService()
let indicatorList = new IndicatorList(scaleLimService)
let chartService = new ChartService(indicatorList)

let rootComponent = {
  view: function(vnode) {
    return m("div", [
      m("h1", "History of COVID19 by country"),
      m("#inner", [
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

m.mount(document.body, rootComponent)
