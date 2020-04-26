import * as d3 from "/web_modules/d3.js"
import * as math from "/web_modules/mathjs.js"
import {UTCDate} from "/src/utils.js"

export default function hopkinsFetch() {
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
