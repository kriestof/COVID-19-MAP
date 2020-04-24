export function TooltipService() {
  this.coords = {x: 0, y: 0}
  this.visible = false
  this.country = undefined
  this.value = undefined
  this.opacity = 0

  this.displayTooltip = function(x, y, countryArg, valueArg) {
      this.coords.x = x
      this.coords.y = y
      this.country = countryArg
      this.value = valueArg
      this.opacity = 1
  }

  this.hideTooltip = function() {
      this.opacity = 0
  }
}

export function tooltipComponent() {
  return {
    view: function(vnode) {
      let tooltipService = vnode.attrs.tooltipService
      return m(".tooltip", {style: {opacity: tooltipService.opacity, top: tooltipService.coords.y + "px", left: tooltipService.coords.x + "px"}}, [
        m("span", `name: ${tooltipService.country}`),
        m("br"),
        m("span", `value: ${tooltipService.value}`)
      ])
    }
  }
}
