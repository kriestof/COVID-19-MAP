import m from "/web_modules/mithril.js"

import * as config from "/src/config/world/main.js"

export default function formulaMenuComponent() {
  let formulaValue = config.PREDEFINED_INDICATORS[0].name
  let error = undefined
  let isFetching = undefined

  return {
    view: function(vnode) {
      function changeData(formula) {
        isFetching = true
        indicatorList.changeData(formula)
          .then(() => error = undefined)
          .catch((err) => error = err.message)
          .finally(function() { isFetching = false; m.redraw()})
      }

      let indicatorList = vnode.attrs.indicatorList
      return m("section.formula-menu", [
        m(".left-menu", [
          m("span.label", "Indicator:"),
          m("select", {onchange: function() {formulaValue = this.value; changeData(this.value)}},
            config.PREDEFINED_INDICATORS.map((ind) => m("option", {value: ind.formula}, ind.name)))
        ]),
        m(".right-menu", [
          m("span.help-text", [
            m("span.label", "or type:"),
            m("br"),
            m("a", {href: "/help.html"}, "help?")
          ]),
          m(".formula-wrapper", [
            m("input.formula#formula", {
              type: "text",
              value: formulaValue,
              disabled: isFetching,
              onchange: function() {formulaValue = this.value; changeData(this.value)},
              class: error ? "error":""
            }),
            m(".formula-error", {title: error}, error)
          ])
        ])
      ])
    }
  }
}
