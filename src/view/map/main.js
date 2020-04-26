import m from "/web_modules/mithril.js"
import * as d3 from "/web_modules/d3.js"
import * as math from "/web_modules/mathjs.js"
import {feature as topojson_feature} from "/web_modules/topojson-client.js"

import countryPathComponent from "./path.js"
import legendComponent from "./legend.js"
import downloadMapPng from "./download-png.js"
import config from "/src/config/world.js"

export default function mapComponent() {
  let selectedDate = -1
  let indicatorList = undefined

  let projection = config.projection
  let path = d3.geoPath().projection(projection)
  let scale = d3.scaleSymlog().range([1, 0])

  let regionValue = undefined

  let world = []

  return {
    oninit: function(vnode) {
      m.request({url: "countries-50m.json"}).then((data) => world = topojson_feature(data,data.objects.countries).features)
      indicatorList = vnode.attrs.indicatorList
    },
    view: function(vnode) {
      let dates = indicatorList.getDates()
      if (selectedDate === -1)
        selectedDate = dates.length-1

      let scaleMinVal = undefined, scaleMaxVal = undefined
      if (vnode.attrs.scaleLimService.valueLim) {
        [scaleMinVal, scaleMaxVal] = vnode.attrs.scaleLimService.valueLim
        let absMax = Math.max(Math.abs(scaleMinVal), Math.abs(scaleMaxVal))
        scale.domain([-absMax, absMax])
      }


      return m("section.map#map",[
        m(".map-menu", [
          m("span.label", "Choose date:"),
          m("input.date", {type: "range", min: 0, max: dates.length ? dates.length-1:0, value: selectedDate, oninput: function() { selectedDate = this.value}}),
          m("span.label", "Date:"),
          m("span#selected-date", dates[selectedDate] ? dates[selectedDate].toISOString().slice(0, 10):"")
        ]),
        m(".right-menu", [
          m("span.label", "Region:"),
          m("select.region", {oninput: function() {
            let reg = config.regions.find((x) => this.value === x.value)
            projection.scale(reg.scale).translate(reg.translate)
            regionValue = reg.value
          }}, config.regions.map((reg) => m("option" , {value: reg.value}, reg.name))),
          m("span.label", "Mode:"),
          m("select", {oninput: function() {indicatorList.mode = this.value; indicatorList.changeData()}}, [
            m("option", {value: "all", default: true}, "Indicator"),
            m("option", {value: "increase", default: true}, "Daily increase")
          ]),
        ]),
        m(".map-outer", [
          m("a", {onclick: () => downloadMapPng(indicatorList)}, "Download png"),
          m("svg", [
            m("rect", {width: "100%", height: "100%", fill: "#4d4d4d"}),
            m("g.country-paths", world.map(function(countryPath) {
              return m(countryPathComponent, {
                key: countryPath.properties.name + " " + regionValue,
                countryPath: countryPath,
                selectedDate: selectedDate,
                path: path,
                scale: scale,
                indicatorList: indicatorList,
                chartService: vnode.attrs.chartService
              })
            })),
            vnode.attrs.scaleLimService.valueLim ? m(legendComponent, {
              legendValues: math.range(scale(scaleMinVal), scale(scaleMaxVal)-0.01, (scale(scaleMaxVal)-scale(scaleMinVal))/7).toArray()
              .map((x) => parseFloat(Math.round(scale.invert(x).toPrecision(2)))),
              scale: scale
            }):""
          ])
        ]),
      ])
    }
  }
}
