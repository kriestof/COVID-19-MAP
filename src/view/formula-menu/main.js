import config from "../../config/world.js"

export default function formulaMenuComponent() {
  let formulaValue = config.predefinedIndicators[0].name
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
      return m("#formula-menu", [
        m(".left-menu", [
          m("span.label", "Indicator:"),
          m("select#predefined-formulas", {onchange: function() {formulaValue = this.value; changeData(this.value)}},
            config.predefinedIndicators.map((ind) => m("option", {value: ind.formula}, ind.name)))
        ]),
        m(".right-menu", [
          m("span.help-text", [
            m("span.label", "or type:"),
            m("br"),
            m("a", {href: "/help.html"}, "help?")
          ]),
          m("#formula-wrapper", [
            m("input#formula", {
              type: "text",
              value: formulaValue,
              disabled: isFetching,
              onchange: function() {formulaValue = this.value; changeData(this.value)},
              class: error ? "error":""
            }),
            m("#formula-error", {title: error}, error)
          ])
        ])
      ])
    }
  }
}
