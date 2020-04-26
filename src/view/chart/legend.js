import m from "/web_modules/mithril.js"

export default function legend() {
  return {
    view: function(vnode) {
      let chartService = vnode.attrs.chartService
      const MARGIN = vnode.attrs.MARGIN

      return m("g", {transform: `translate(${MARGIN.x},0)`}, chartService.countries.map(function(country, id) {
        return m("g", [
          m("rect", {
            x: 20,
            y: id*25+20,
            width: 15,
            height: 15,
            fill: country.color
          }),
          m("text.remove-label", {
              x: 40,
              y: id*25+22,
              dy: "0.8em",
              "font-family": "sans-serif",
              "font-size": "12px",
              fill: "red",
              style: "cursor: pointer;",
              onclick: () => chartService.removeCountry(country)
          },"[x]"),
          m("text.text-label", {
            x: 60,
            y: id*25+22,
            dy: "0.8em",
            "font-family": "sans-serif",
            "font-size": "12px"
          }, country.name)
        ])
      }))
    }
  }
}
