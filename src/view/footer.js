import m from "/web_modules/mithril.js"

export default function footerComponent() {
  return {
   view: function(vnode) {
     return m("footer", [
       m("span.left", "COVID-19 chart and map. Copyright 2020 Krzysztof Piwoński. "),
       m("a", {href: "https://github.com/kriestof/COVID-19-chart"}, "source code"),
       m("span.right", [
         "Based on data collected by ",
         m("a", {href: "https://github.com/CSSEGISandData/COVID-19"}, "Johns Hopkins CSSE"),
         " and ",
         m("a", {href: "https://data.worldbank.org/"}, "World Bank")
       ])
     ])
   }
 }
}
