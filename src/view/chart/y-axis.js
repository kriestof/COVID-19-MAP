import m from "/web_modules/mithril.js"
import * as d3 from "/web_modules/d3.js"

export default function yAxis() {
  return {
    oncreate: function(vnode) {
      const MARGIN = vnode.attrs.MARGIN
      const SVG_SIZE = vnode.attrs.SVG_SIZE

      d3.select(vnode.dom).append("g").attr("class", "grid y-grid").call(d3.axisLeft(vnode.attrs.y)
        .tickFormat((d) => d3.format(",.0f")(d.toPrecision(2))))
        .attr("transform", `translate(${MARGIN.x}, ${MARGIN.y})`)
      d3.select(vnode.dom).append("g").attr("class", "grid y-grid y-gridlines").call(d3.axisLeft(vnode.attrs.y)
        .tickFormat("").tickSize(-SVG_SIZE.width))
        .attr("transform", `translate(${MARGIN.x}, ${MARGIN.y})`)
      d3.select(vnode.dom).select(".y-gridlines .domain").remove()
      d3.select(vnode.dom).selectAll(".y-gridlines line").attr("stroke", "#cecece")
    },
    view: function(vnode) {
      return m("g")
    }
  }
}
