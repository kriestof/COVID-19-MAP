export default function countryLines() {
  let mouseover = {}

  return {
    view: function(vnode) {
      let chartService = vnode.attrs.chartService
      let indicatorList = vnode.attrs.indicatorList
      const MARGIN = vnode.attrs.MARGIN
      let x = vnode.attrs.x
      let y = vnode.attrs.y

      return m("g",
        chartService.countries.map(function(country) {
          let tsData = indicatorList.getCountryTs(country.name)
          let dates = indicatorList.getDates()
          let chartArray = []

          for (let i = 0; i < tsData.length; i+=1)
            if (!Number.isNaN(tsData[i]) && Number.isFinite(tsData[i]) &&
              y.domain()[0] <= tsData[i] &&
              x.domain()[0] < dates[i] && x.domain()[1] >= dates[i])
              chartArray.push({time: new Date(dates[i]), value: tsData[i]})

          return m("g.country", [
            m("path", {fill: "none",
              stroke: country.color,
              "stroke-width": 3,
              "d": d3.line()
                    .x((d) => x(d.time)+MARGIN.x)
                    .y((d) => y(d.value)+MARGIN.y)(chartArray)
            }),
            vnode.attrs.showPoints ? m("g.points", chartArray.map(function(point) {
              return m("circle", {
                stroke: mouseover[point.time] ? country.color:null,
                fill: mouseover[point.time] ? "white":country.color,
                cx: x(point.time)+MARGIN.x,
                cy: y(point.value)+MARGIN.y,
                r: 5,
                "stroke-width": "2px",
                onmouseover: () => mouseover[point.time] = true,
                onmouseout: () => mouseover[point.time] = false,
              }, m("title", `country: ${country.name}\n value: ${point.value} \n date: ${d3.timeFormat("%Y-%m-%d")(point.time)}`))
            })):""
          ])
        }))
    }
  }
}
