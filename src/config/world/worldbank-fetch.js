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
import * as math from "/web_modules/mathjs.js"
import {UTCDate} from "../../utils.js"

export default function fetchWbankIndicators(formula, data, dates, countryNames) {
  let pr = undefined
  try {
    pr = math.parse(formula)
  } catch (err) {
    return Promise.reject(err)
  }

  let wbankIndicators = []

  pr.traverse(function(node) {
    if (node.isSymbolNode && node.name.startsWith("WB_"))
      wbankIndicators.push(node.name.slice(3).replace(/_/g, "."))
  })

  let wbankIndicatorsSet = new Set(wbankIndicators)
  for (let indicator of wbankIndicatorsSet) {
    let indicatorName = "WB_"+indicator.replace(/\./g, "_")
    if (indicatorName in data)
      wbankIndicatorsSet.delete(indicator)
  }

  wbankIndicators = [...wbankIndicatorsSet]
  if (!wbankIndicators.length) return Promise.resolve()
  let countryNamesSet = new Set(countryNames)

  return d3.json(`http://api.worldbank.org/v2/country/all/indicator/${wbankIndicators.join(";")}?format=json&mrnev=1&gapfill=Y&source=2&Per_page=10000`)
    .then(function(wbankData) {
      const namesMap = {
        "Bahamas, The": "Bahamas",
        "Bosnia and Herzegovina": "Bosnia and Herz.",
        "Brunei Darussalam": "Brunei",
        "Central African Republic": "Central African Rep.",
        "Congo, Dem. Rep.": "Dem. Rep. Congo",
        "Congo, Rep.": "Congo",
        "Cote d'Ivoire": "Côte d'Ivoire",
        "Czech Republic": "Czechia",
        "Dominican Republic": "Dominican Rep.",
        "Egypt, Arab Rep.": "Egypt",
        "Equatorial Guinea": "Eq. Guinea",
        "Eswatini": "eSwatini",
        "Gambia, The": "Gambia",
        "Iran, Islamic Rep.": "Iran",
        "Kyrgyz Republic": "Kyrgyzstan",
        "Lao PDR": "Laos",
        "North Macedonia": "Macedonia",
        "Korea, Dem. People’s Rep.": "North Korea",
        "Russian Federation": "Russia",
        "South Sudan": "S. Sudan",
        "Slovak Republic": "Slovakia",
        "Solomon Islands": "Solomon Is.",
        "Korea, Rep.": "South Korea",
        "Syrian Arab Republic": "Syria",
        "United States": "United States of America",
        "Venezuela, RB": "Venezuela",
        "Yemen, Rep.": "Yemen"
      }

      if (wbankData[0].message)
        return Promise.reject({message:"Invalid World Bank indicator name"})

      wbankData[1].map(function(x) {if(x.country.value in namesMap) x.country.value = namesMap[x.country.value]})
      wbankData = wbankData[1].filter((x) => countryNamesSet.has(x.country.value))
      wbankData = d3.nest().key((d) => d.indicator.id).object(wbankData)

      for (let indicatorName of wbankIndicators) {
        let wbankIndicator = wbankData[indicatorName]
        let wbankIndicatorCountryNamesSet = new Set(wbankIndicator.map((x) => x.country.value))
        let naCountryNames = countryNames.filter((x) => !wbankIndicatorCountryNamesSet.has(x))
        naCountryNames.map((countryName) => wbankIndicator.push({country: {value: countryName}, value: NaN}))
        wbankIndicator.sort((x, y) => x.country.value > y.country.value ? 1:-1)
        wbankIndicator = wbankIndicator.map((x) => x.value)

        data["WB_"+indicatorName.replace(/\./g, "_")] = math.matrix(wbankIndicator.map(
          function(val) {if(val === null) val = NaN; return math.multiply(math.ones(dates.length), val);}
        ))
      }
    })
}
