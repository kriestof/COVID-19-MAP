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

function Chart(countryNames, dates, svg) {
  const MARGIN = {x: 60, y: 10}
  const WIDTH = 800
  const HEIGHT = 600

  this.drawYAxis = function() {
    svg.append("g").attr("class", "grid y-grid").call(d3.axisLeft(y).tickFormat((d) => d3.format(",.0f")(d.toPrecision(2)))).attr("transform", `translate(${MARGIN.x}, ${MARGIN.y})`)
  }

  let parent = this
  this.allCountryNames = countryNames
  this.countries = []
  this.countryColors = new Set()
  this.countriesData = undefined

  svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "white")
  y = d3.scaleSymlog().range([HEIGHT, 0])
  y.ticks = ticksSymlog

  x = d3.scaleTime().domain([new Date(dates[0]), new Date(dates[dates.length-1])]).range([ 0, WIDTH])
  svg.append("g").attr("class", "grid").attr("transform", `translate(${MARGIN.x}, ${HEIGHT+MARGIN.y})`).call(d3.axisBottom(x).ticks(dates.length).tickFormat(d3.timeFormat("%Y-%m-%d")))
    .selectAll("text").attr("transform", "rotate(-65)").attr("dx", "-.8em").attr("dy", ".15em").style("text-anchor", "end")

  d3.select("#download-chart").on("click", () => this.downloadChartPng())

  d3.select("#chart #search-country").on("keyup", function() {
    if(this.value.length > 2) {
      let selectedCountries = new Set(parent.countries.map((x) => x.name))
      let resCountry = parent._matchCountry(this.value).filter((countryName) => !selectedCountries.has(countryName))

      d3.select("#chart #result ul").selectAll("li").data(resCountry).
        join("li").text((d) => d)

        d3.selectAll("#chart #result ul li").on("click", function() {
          parent.drawChart(d3.select(this).text())
          d3.select("#chart #search-country").node().value = ""
          d3.select("#chart #result ul").selectAll("li").remove()
        })
    }
    else
      d3.select("#chart #result ul").selectAll("li").remove()
  })

  this.drawChart = function(countryName) {
    if (this.countries.length >= 10) return undefined
    if (this.countries.filter((x) => x.name == countryName).length) return undefined

    tsData = math.subset(this.countriesData, math.index(countryNames.indexOf(countryName), math.range(0, dates.length))).toArray()[0]

    chartArray = []
    for (i = 0; i < tsData.length; i+=1)
      if (!Number.isNaN(tsData[i]) && Number.isFinite(tsData[i]))
        chartArray.push({time: new Date(dates[i]), valueAll: tsData[i]})
    this.countries.push({name: countryName, data: chartArray, color: this._getColor()})

    this.drawLinesChart()
    this._drawLegendChart()
    if (this.countries.length == 10) d3.select("#chart #search-country").attr("disabled", true)
  }

  this.drawLinesChart = function() {
    chartSvg.selectAll('g.country').remove()

    let country = chartSvg.selectAll("g.country")
        .data(this.countries).enter().append("g").attr("class", "country")

    country.append("path")
       .attr("fill", "none")
       .attr("stroke", (d) => d.color)
       .attr("stroke-width", 1.5)
       .attr("d", (d) => d3.line()
         .x((d) => x(d.time)+MARGIN.x)
         .y((d) => y(this._getChartValue(d))+MARGIN.y)(d.data.filter((x) => this._getChartValue(x) !== undefined))
       )

    country
      .selectAll("circle")
      .data((d) => d.data.filter((x) => this._getChartValue(x) !== undefined))
      .enter().append("circle")
      .attr("fill", function(d) { return d3.select(this.parentNode).datum().color})
      .attr("cx", (d) => x(d.time)+MARGIN.x)
      .attr("cy", (d) => y(this._getChartValue(d))+MARGIN.y)
      .attr("r", 5)
      .attr("stroke-width", "2px")
      .on("mouseover", function() {
        d3.select(this).attr("stroke", d3.select(this).attr("fill"))
        d3.select(this).attr("fill", "white")
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", d3.select(this).attr("stroke"))
        d3.select(this).attr("stroke", null)
      })
      .append("title").text(function (d) {
        let countryName = d3.select(this.parentNode.parentNode).datum().name
        return `country: ${countryName}\n value: ${parseFloat(parent._getChartValue(d).toPrecision(7))} \n date: ${d3.timeFormat("%Y-%m-%d")(d.time)}`
      })
  }

  this._getChartValue = function(d) {
    return d.valueAll
  }

  this._drawLegendChart = function() {
    legend = chartSvg.selectAll('g.legendEntry')
        .data(this.countries)
        .enter().append("g")
        .attr('class', 'legendEntry').attr("transform", "translate(60,0)")

    legend
        .append('rect')
        .attr("x", 20)
        .attr("y", (d, i) => i * 25 + 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d) => d.color)

     legend
         .append('text')
         .attr("x", 40)
         .attr("y", (d, i) => i * 25 + 20)
         .attr("dy", "0.8em")
         .text("[x]")
         .style("font-family", "sans-serif")
         .style("font-size", "12px")
         .style("fill", "red")
         .style("cursor", "pointer")
         .attr("class", "remove-label")
         .on("click", (d) => this.removeFromChart(d))

     legend
         .append('text')
         .attr("x", 60)
         .attr("y", (d, i) => i * 25 + 20)
         .attr("dy", "0.8em")
         .text((d) => d.name)
         .style("font-family", "sans-serif")
         .style("font-size", "12px")
         .attr("class", "text-label")
  }

  this.removeFromChart = function(removedCountry) {
    this.countries = this.countries.filter((el) => el.name != removedCountry.name)
    chartSvg.selectAll('g.legendEntry').remove()
    this._drawLegendChart()
    this.drawLinesChart()

    if (this.countries.length < 10) d3.select("#chart #search-country").attr("disabled", null)
    this.countryColors.delete(removedCountry.color)
  }

  this.changeData = function(data) {
    this.countriesData = data
    maxVal =  math.max(data.toArray().map((arr) => arr.filter((x) => !Number.isNaN(x) && Number.isFinite(x))))
    minVal =  math.min(data.toArray().map((arr) => arr.filter((x) => !Number.isNaN(x) && Number.isFinite(x))))

    y.domain([minVal, maxVal])
    svg.select(".y-grid").remove()
    this.drawYAxis()

    this._drawLegendChart()
    this.drawLinesChart()

    for (let country of this.countries) {
      this.removeFromChart(country)
      this.drawChart(country.name)
    }
  }

  this._getColor = function() {
    i = 0
    while (this.countryColors.has(d3.schemeCategory10[i])) i +=1

    this.countryColors.add(d3.schemeCategory10[i])
    return d3.schemeCategory10[i]
  }

  this._matchCountry = function(input) {
    let reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');

    return this.allCountryNames.filter(function(countryName) {
      if (countryName.match(reg)) {
        return countryName;
      }
    }).sort()
  }

  this.downloadChartPng = function(e) {
    d3.event.preventDefault()

    downloadSvg = d3.select(chartSvg.node().cloneNode(true))
    downloadSvg.attr("width", chartSvg.node().width.baseVal.value)
    downloadSvg.attr("height",chartSvg.node().height.baseVal.value)

    downloadSvg.selectAll(".remove-label").remove()
    downloadSvg.selectAll(".text-label").attr("x", 40)

    downloadSvg
      .append("text")
      .text("source: covid19chart.info")
      .attr("y", downloadSvg.attr("height")-5).attr("x", MARGIN.x)
      .attr("fill", "#595959")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")

    downloadSvg
      .append("text")
      .text("formula: " + d3.select("#formula").node().value)
      .attr("y", downloadSvg.attr("height")-20).attr("x", MARGIN.x)
      .attr("fill", "#595959")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")

    downloadPng(downloadSvg, "COVID19-chart.png")
  }

   function ticksSymlog(count) {
    logp = (x) => Math.sign(x) * Math.log1p(math.abs(x))
    powp = (x) => Math.sign(x) * Math.expm1(math.abs(x))

    var d = y.domain(),
        u = d[0],
        v = d[d.length - 1],
        r;
    base = Math.E
    if (r = v < u) i = u, u = v, v = i;

    var i = logp(u),
        j = logp(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.floor(i), j = Math.ceil(j);
      if (u > 0) for (; i <= j; ++i) {
        for (k = 1, p = powp(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i <= j; ++i) {
        for (k = base - 1, p = powp(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
      if (z.length * 2 < n) z = ticks(u, v, n);
    } else {
      z = d3.ticks(i, j, Math.min(j - i, n)).map(powp);
    }

    return r ? z.reverse() : z;
  }
}
