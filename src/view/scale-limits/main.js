export default function scaleLimComponent() {
  let dateLim = [undefined, undefined]
  let valueLim = [undefined, undefined]

  return {
    view: function(vnode) {
      let scaleLimService = vnode.attrs.scaleLimService
      let indicatorList = vnode.attrs.indicatorList

      return m("#scale-lim-menu", [
        m("#xlim-menu", [
          m("span.label", "Date range:"),
          m("input#xlim-min", {type: "date",
            required: true,
            valueAsDate: scaleLimService.dateLim ? scaleLimService.dateLim[0]:null,
            onchange: function() {
              if(this.value) scaleLimService.dateLim[0] = new Date(this.value)
            }
          }),
          m("span", ":"),
          m("input#xlim-max", {type: "date",
            required: true,
            valueAsDate: scaleLimService.dateLim ? scaleLimService.dateLim[1]:null,
            onchange: function() {
              if(this.value) scaleLimService.dateLim[1] = new Date(this.value)
            }
          })
        ]),
        m("#ylim-menu", [
          m("span.label", "Value range:"),
          m("input#ylim-min", {type:"number",
            value: scaleLimService.valueLim ? scaleLimService.valueLim[0]:null,
            onchange: function() {
              if (this.value < scaleLimService.valueLim[1])
                scaleLimService.valueLim[0] = this.value
            }
          }),
          m("span", ":"),
          m("input#ylim-max", {type:"number",
            value: scaleLimService.valueLim ? scaleLimService.valueLim[1]:null,
            onchange: function() {
              if (this.value > scaleLimService.valueLim[0])
                scaleLimService.valueLim[1] = this.value
            }
          })
        ]),
      ])
    }
  }
}
