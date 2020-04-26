import m from "/web_modules/mithril.js"
import * as d3 from "/web_modules/d3.js"

export default function countryPathComponent() {
  return {
    view: function(vnode) {
      let indicatorList = vnode.attrs.indicatorList
      let countryPath = vnode.attrs.countryPath
      let val = indicatorList.getElement(countryPath.properties.name, parseFloat(vnode.attrs.selectedDate))
      if (!vnode.state.projectedPath)
        vnode.state.projectedPath = vnode.attrs.path(countryPath)

      return m("path", {
                style: "cursor: pointer;" + (vnode.state.active ? "stroke: #004d76; stroke-width: 3;":""),
                d: vnode.state.projectedPath,
                fill: val !== undefined ? d3.interpolateRdBu(vnode.attrs.scale(val)):"#ababab",
                onclick: function() {
                  vnode.attrs.chartService.addCountry(countryPath.properties.name)
                },
                onmouseover: () => vnode.state.active = true,
                onmouseout: () => vnode.state.active = false,
                opacity: indicatorList.evalData ? 1:0
             }, m("title", `name: ${countryPath.properties.name}\n value: ${val !== undefined ? parseFloat(val.toPrecision(7)):"Not avaliable"}`))
    }
  }
}
