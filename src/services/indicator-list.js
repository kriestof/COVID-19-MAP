import m from "/web_modules/mithril.js"
import * as math from "/web_modules/mathjs.js"

import * as config from "../config/world/main.js"

export default function IndicatorList(scaleLimService) {
  this.dates = []
  this.data = undefined
  this.countryNames = undefined
  this.evalData = undefined
  this.formula = undefined
  this.mode = "all"
  let parent = this

  config.initFetch().then(function (res) {
    parent.dates = res.dates
    parent.data = res.data
    parent.countryNames = res.countryNames
    parent.changeData("infected")
    m.redraw()
  })

  this.getDateLimits = function() {
    return [this.dates[0], this.dates[this.dates.length-1]]
  }

  this.getValueLimits = function() {
    if (!this.evalData) return [null, null]
    let maxVal =  math.max(this.evalData.toArray().map((arr) => arr.filter((x) => !Number.isNaN(x) && Number.isFinite(x))))
    let minVal =  math.min(this.evalData.toArray().map((arr) => arr.filter((x) => !Number.isNaN(x) && Number.isFinite(x))))
    return [minVal, maxVal]
  }

  this.changeData = function(formula = this.formula) {
    return config.changeDataFetch(formula, this.data, this.dates, this.countryNames).then(function() {
      parent.evalData = math.evaluate(formula, parent.data)
      parent.formula = formula

      if (parent.mode === "increase") {
              let up = parent.evalData.subset(math.index(math.range(0, parent.evalData.size()[0]), math.range(1, parent.evalData.size()[1])))
              let down = parent.evalData.subset(math.index(math.range(0, parent.evalData.size()[0]), math.range(0, parent.evalData.size()[1]-1)))
              parent.evalData = math.subtract(up, down)
              parent.evalData = math.concat(math.zeros(parent.evalData.size()[0]).resize([parent.evalData.size()[0], 1]), parent.evalData)
      }
      scaleLimService.setValueLim(parent.getValueLimits()[0], parent.getValueLimits()[1])
      if (!scaleLimService.dateLim)
        scaleLimService.setDateLim(parent.getDateLimits()[0], parent.getDateLimits()[1])
    })
  }

  this.getElement = function(countryName, dateId) {
    if (!this.countryNames) return undefined
    if (this.countryNames.indexOf(countryName) == -1) return undefined
    let val = math.subset(this.evalData, math.index(this.countryNames.indexOf(countryName), dateId))
    if (Number.isNaN(val) || !Number.isFinite(val)) return undefined
    return val
  }

  this.getCountryTs = function(countryName) {
    return math.subset(this.evalData,
        math.index(this.countryNames.indexOf(countryName), math.range(0, this.dates.length))
      ).toArray()[0]
  }

  this.getDates = function() {
    return this.dates
  }
}
