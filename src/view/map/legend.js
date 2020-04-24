export default function legendComponent() {
  return {
    view: function(vnode) {
      let entries = vnode.attrs.legendValues.map(function(val, id) {
        return m("g.legend-entry", [
          m("rect", {width: 15, height: 15, x: 20, y: (id+1)*25+20, fill: d3.interpolateRdBu(vnode.attrs.scale(val))}),
          m("text", {x: 40, y:(id+1)*25+20, dy: "0.8em", "font-family": "sans-serif",
            "font-size": "12px", fill: "white"}, val),
        ])
      })

      entries.unshift(m("g.legend-entry", [
        m("rect", {width: 15, height: 15, x: 20, y: 20, fill: "#ababab"}),
        m("text", {x: 40, y: 20, dy: "0.8em", "font-family": "sans-serif",
          "font-size": "12px", fill: "white"}, "Not avaliable"),
      ]))

      return m("g.legend", [
        m("rect", {width: 130, height: 250, fill: "#525252"}),
        m("g.entries", entries)
      ])
    }
  }
}
