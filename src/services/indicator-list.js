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
