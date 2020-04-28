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

import {geoRobinson as d3_geoRobinson} from "/web_modules/d3-geo-projection.js"

import hopkinsFetch from "./hopkins-fetch.js"
import fetchWbankIndicators from "./worldbank-fetch.js"
import HELP_TEXT from "./help.js"

export const MAP_URL = "assets/countries-50m.json"
export const PROJECTION = d3_geoRobinson()

export const PREDEFINED_INDICATORS = [
  {name: "infected", formula: "infected"},
  {name: "recovered", formula: "recovered"},
  {name: "deaths", formula: "deaths"},
  {name: "currently infected", formula: "infected - recovered - deaths"},
  {name: "recovered rate", formula: "recovered ./ infected * 10^2"},
  {name: "death rate", formula: "deaths ./ infected * 10^2"},
  {name: "infected per POP per 1 mln.", formula: "round(infected ./ WB_SP_POP_TOTL * 10^6)"},
  {name: "deaths per POP per 1 mln.", formula: "round(deaths ./ WB_SP_POP_TOTL * 10^6)"},
  {name: "infected per POP DNST.", formula: "round(infected ./ WB_EN_POP_DNST)"},
  {name: "deaths per POP DNST.", formula: "round(deaths ./ WB_EN_POP_DNST)"},
]

export const REGIONS = [
  {value: "world", name: "World", scale: PROJECTION.scale(), translate: PROJECTION.translate()},
  {value: "europe", name: "Europe", scale: 700, translate: [300, 930]},
  {value: "asia", name: "Asia", scale: 400, translate: [-100, 500]},
  {value: "africa", name: "Africa", scale: 350, translate: [300, 260]},
  {value: "samerica", name: "South America", scale: 350, translate: [800, 140]},
  {value: "namerica", name: "North America", scale: 450, translate: [1200, 600]},
  {value: "australia", name: "Australia", scale: 450, translate: [-600, 50]},
]

export function changeDataFetch(formula, data, dates, countryNames) {
  return fetchWbankIndicators(formula, data, dates, countryNames)
}

export function initFetch(formula) {
  return hopkinsFetch()
}

export {HELP_TEXT}
