import m from "/web_modules/mithril.js"
import * as d3 from "/web_modules/d3.js"

export default function xAxis() {
  return {
    oncreate: function(vnode) {
      const MARGIN = vnode.attrs.MARGIN
      const SVG_SIZE = vnode.attrs.SVG_SIZE
      let x = vnode.attrs.x
      let ticksNum = (x.domain()[1]-x.domain()[0]) / (1000 * 60 * 60 * 24)
      ticksNum = ticksNum > 20 ? 20:ticksNum

      d3.select(vnode.dom)
        .append("g").attr("class", "grid x-grid")
        .attr("transform", `translate(${MARGIN.x}, ${SVG_SIZE.height+MARGIN.y})`)
        .call(d3.axisBottom(x).ticks(ticksNum)
          .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text").attr("transform", "rotate(-65)").attr("dx", "-.8em").attr("dy", ".15em").style("text-anchor", "end")
    },
    view: function(vnode) {
      return m("g")
    }
  }
}
