// Copyright 2020 Krzysztof Piwoński <piwonski.kris@gmail.com>
//
// This file is a part of COVID-19 map.
//
// COVID-19 map is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// COVID-19 map is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import m from "/web_modules/mithril.js"

export default function scaleLimComponent() {
  let dateLim = [undefined, undefined]
  let valueLim = [undefined, undefined]

  return {
    view: function(vnode) {
      let scaleLimService = vnode.attrs.scaleLimService
      let indicatorList = vnode.attrs.indicatorList

      return m("section.scale-lim-menu", [
        m(".xlim-menu", [
          m("span.label", "Date range:"),
          m("input", {type: "date",
            required: true,
            valueAsDate: scaleLimService.dateLim ? scaleLimService.dateLim[0]:null,
            onchange: function() {
              if(this.value) scaleLimService.dateLim[0] = new Date(this.value)
            }
          }),
          m("span", ":"),
          m("input", {type: "date",
            required: true,
            valueAsDate: scaleLimService.dateLim ? scaleLimService.dateLim[1]:null,
            onchange: function() {
              if(this.value) scaleLimService.dateLim[1] = new Date(this.value)
            }
          })
        ]),
        m(".ylim-menu", [
          m("span.label", "Value range:"),
          m("input", {type:"number",
            value: scaleLimService.valueLim ? scaleLimService.valueLim[0]:null,
            onchange: function() {
              if (this.value < scaleLimService.valueLim[1])
                scaleLimService.valueLim[0] = this.value
            }
          }),
          m("span", ":"),
          m("input", {type:"number",
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
