import ticksSymlogWrapper from "./ticks-symlog.js"
import yAxis from "./y-axis.js"
import xAxis from "./x-axis.js"
import countryLines from "./country-lines.js"
import searchCountry from "./search-country.js"
import legend from "./legend.js"
import downloadChartPng from "./download-png.js"

export default function chartComponent() {
  const MARGIN = Object.freeze({x: 60, y: 10})
  const SVG_SIZE = Object.freeze({width: 820, height: 600})

  let x = d3.scaleTime().range([ 0, SVG_SIZE.width])

  let y = undefined
  function changeYScale(scale) {
    if (scale === "symlog") {
      y = d3.scaleSymlog().range([SVG_SIZE.height, 0])
      y.ticks = ticksSymlogWrapper(y)
    }
    if (scale === "linear") {
      y = d3.scaleLinear().range([SVG_SIZE.height, 0])
    }
    yScaleType = scale
  }
  let yScaleType = "symlog"
  let showPoints = "true"
  changeYScale(yScaleType)

  return {
    view: function(vnode) {
      let scaleLimService = vnode.attrs.scaleLimService

      if (scaleLimService.dateLim)
        x.domain([scaleLimService.dateLim[0] - 1000*60*60*24, scaleLimService.dateLim[1]])

      if (scaleLimService.valueLim)
        y.domain(scaleLimService.valueLim)

      return m("#chart", [
        m("#chart-menu", [
          m(".left-menu", [
            m(searchCountry, {
              countryNames: vnode.attrs.indicatorList.countryNames,
              chartService: vnode.attrs.chartService
            }),
            m("a#download-chart", {onclick: () => downloadChartPng(MARGIN)}, "Download png")
          ]),
          m(".right-menu", [
            m("label#show-points", [
              "Show points",
              m("input", {type: "checkbox", checked: showPoints ? true:false, onchange: () => showPoints = !showPoints })
            ]),
            m("span.label", "Scale type:"),
            m("select#choose-scale", {oninput: function() {changeYScale(this.value)}}, [
              m("option", {value: "symlog"}, "symlog"),
              m("option", {value: "linear"}, "linear")
            ])
          ])
        ]),
        m("svg", [
          m("rect", {width: "100%", height: "100%", fill: "white"}),
          scaleLimService.valueLim ? m("g", m(yAxis, {key: `${scaleLimService.valueLim[0]}-${scaleLimService.valueLim[1]}-${yScaleType}`, y: y, MARGIN: MARGIN, SVG_SIZE: SVG_SIZE})):"",
          scaleLimService.dateLim ? m("g", m(xAxis, {key: x.domain()[0].toISOString()+x.domain()[1].toISOString(),
            x: x, MARGIN: MARGIN, SVG_SIZE: SVG_SIZE})):"",
          m("g.country-lines", m(countryLines, {
            key: yScaleType,
            indicatorList: vnode.attrs.indicatorList,
            chartService: vnode.attrs.chartService,
            x: x, y: y,
            MARGIN: MARGIN,
            showPoints: showPoints
          })),
          m("g", m(legend, {chartService: vnode.attrs.chartService, MARGIN: MARGIN}))
        ])
      ])
    }
  }
}
