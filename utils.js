// Copyright 2020 Krzysztof Piwoński <piwonski.kris@gmail.com>
//
// This file is a part of COVID-19 chart.
//
// COVID-19 chart is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// COVID-19 chart is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

function downloadPng(downloadSvg, filename) {
  let svgString = new XMLSerializer().serializeToString(downloadSvg.node())

  let canvas = document.createElement("canvas");
  canvas.width=downloadSvg.attr("width"); canvas.height=downloadSvg.attr("height")

  let ctx = canvas.getContext("2d");
  let img = new Image();
  let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
  let url = URL.createObjectURL(svg);

  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    let png = canvas.toDataURL("image/png");
    let ref = document.createElement("a")
    ref.href = png
    ref.download = filename
    ref.click()
    URL.revokeObjectURL(png);
  };
  img.src = url;
}


function convertHopkins(indicatorName) {
  removeCountries = new Set([
    "Diamond Princess",
    "Holy See",
    "MS Zaandam",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Western Sahara",
    "Taiwan*"
  ])

  columns = data[indicatorName].columns
  data[indicatorName] = data[indicatorName].filter(function(obj) { return !removeCountries.has(obj["Country/Region"])})
  data[indicatorName].columns = columns

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

  data[indicatorName].map(function(d) {
    if (d["Country/Region"] in namesMap)
      d["Country/Region"] = namesMap[d["Country/Region"]]
  })

  data[indicatorName].sort((objX, objY) => objX["Country/Region"] > objY["Country/Region"])

  data[indicatorName] = d3.nest()
    .key((d) => d["Country/Region"])
    .rollup(function(v) {
      dates = data[indicatorName].columns.slice(4, data[indicatorName].columns.length)
      res = {}

      for (date of dates)
        res[date] = d3.sum(v, (d) => parseFloat(d[date]))
      return res
    })
    .entries(data[indicatorName])

  countryNames = data[indicatorName].map(obj => obj.key)
  data[indicatorName] = math.matrix(data[indicatorName].map((country) =>
    Object.keys(country.value).map((key) => country.value[key])
  ))
}

function fetchWbankIndicators(formula) {
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
  for (indicator of wbankIndicatorsSet) {
    let indicatorName = "WB_"+indicator.replace(/\./g, "_")
    if (indicatorName in data)
      wbankIndicatorsSet.delete(indicator)
  }

  wbankIndicators = [...wbankIndicatorsSet]
  if (!wbankIndicators.length) return Promise.resolve()
  countryNamesSet = new Set(countryNames)

  return d3.json(`http://api.worldbank.org/v2/country/all/indicator/${wbankIndicators.join(";")}?format=json&date=2018&source=2&Per_page=10000`)
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
        return Promise.reject("Invalid World Bank indicator name")

      wbankData[1].map(function(x) {if(x.country.value in namesMap) x.country.value = namesMap[x.country.value]})
      wbankData = wbankData[1].filter((x) => countryNamesSet.has(x.country.value))
      wbankData = d3.nest().key((d) => d.indicator.id).object(wbankData)

      for (let indicatorName of wbankIndicators) {
        wbankIndicator = wbankData[indicatorName]
        wbankIndicator.sort((x, y) => x.country.value > y.country.value)
        wbankIndicator = wbankIndicator.map((x) => x.value)

        data["WB_"+indicatorName.replace(/\./g, "_")] = math.matrix(wbankIndicator.map(
          function(val) {if(val === null) val = NaN; return math.multiply(math.ones(dates.length), val);}
        ))
      }
    })
}
