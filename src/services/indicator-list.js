import m from "/web_modules/mithril.js"
import * as math from "/web_modules/mathjs.js"
import * as d3 from "/web_modules/d3.js"

import {UTCDate} from "../utils.js"

export default function IndicatorList(scaleLimService) {
  this.dates = []
  this.data = undefined
  this.countryNames = undefined
  this.evalData = undefined
  this.formula = undefined
  this.mode = "all"
  let parent = this

  initFetch().then(function (res) {
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
    return fetchWbankIndicators(formula, this.data, this.dates, this.countryNames).then(function() {
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

function initFetch(formula) {
  let promises = [
    d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"),
    d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"),
    d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv")
  ]

  return Promise.all(promises).then(function(reqRes) {
    let res = {
        data: {},
        dates: undefined,
        countryNames: undefined
    }
    res.data.infected = reqRes[0]
    res.data.recovered = reqRes[1]
    res.data.deaths = reqRes[2]
    res.dates = res.data.infected.columns.slice(4, res.data.infected.columns.length)
    convertHopkins("infected", res)
    convertHopkins("recovered", res)
    convertHopkins("deaths", res)
    res.dates = res.dates.map(UTCDate)
    return res
  })
}

function convertHopkins(indicatorName, res) {
  let removeCountries = new Set([
    "Diamond Princess",
    "Holy See",
    "MS Zaandam",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Western Sahara",
    "Taiwan*"
  ])

  let columns = res.data[indicatorName].columns
  res.data[indicatorName] = res.data[indicatorName].filter(function(obj) { return !removeCountries.has(obj["Country/Region"])})
  res.data[indicatorName].columns = columns

  const namesMap = {
    "US": "United States of America",
    "Korea, South": "South Korea",
    "Korea, North": "North Korea",
    "Bosnia and Herzegovina": "Bosnia and Herz.",
    "North Macedonia": "Macedonia",
    "Dominican Republic": "Dominican Rep.",
    "Congo (Kinshasa)": "Dem. Rep. Congo",
    "Burma": "Myanmar",
    "Central African Republic": "Central African Rep.",
    "Cote d'Ivoire": "Côte d'Ivoire",
    "Dominican Republic": "Dominican Rep.",
    "Eswatini": "eSwatini",
    "Equatorial Guinea": "Eq. Guinea",
    "South Sudan": "S. Sudan",
    "Congo (Brazzaville)": "Congo"
  }

  res.data[indicatorName].map(function(d) {
    if (d["Country/Region"] in namesMap)
      d["Country/Region"] = namesMap[d["Country/Region"]]
  })

  res.data[indicatorName].sort((objX, objY) => objX["Country/Region"] > objY["Country/Region"]? 1:-1)

  res.data[indicatorName] = d3.nest()
    .key((d) => d["Country/Region"])
    .rollup(function(v) {
      let rollupRes = {}

      for (let date of res.dates)
        rollupRes[date] = d3.sum(v, (d) => parseFloat(d[date]))
      return rollupRes
    })
    .entries(res.data[indicatorName])

  res.countryNames = res.data[indicatorName].map(obj => obj.key)
  res.data[indicatorName] = math.matrix(res.data[indicatorName].map((country) =>
    Object.keys(country.value).map((key) => country.value[key])
  ))
}

function fetchWbankIndicators(formula, data, dates, countryNames) {
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
