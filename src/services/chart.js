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

import * as d3 from "/web_modules/d3.js"

export default function ChartService(indicatorList) {
  this.countries = []
  this.countryColors = new Set()

  this.getColor = function() {
    let i = 0
    while (this.countryColors.has(d3.schemeCategory10[i])) i +=1

    this.countryColors.add(d3.schemeCategory10[i])
    return d3.schemeCategory10[i]
  }

  this.addCountry = function(countryName) {
    if (this.countries.length >= 10) return undefined
    if (this.countries.filter((x) => x.name == countryName).length) return undefined
    this.countries.push({name: countryName, color: this.getColor()})
  }

  this.removeCountry = function(country) {
    this.countries = this.countries.filter((el) => el.name !== country.name)
    this.countryColors.delete(country.color)
  }
}
