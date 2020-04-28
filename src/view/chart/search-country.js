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

export default function searchCountry() {
  function matchCountry(countryNames, input) {
    let reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');

    return countryNames.filter(function(countryName) {
      if (countryName.match(reg)) {
        return countryName;
      }
    }).sort()
  }

  let searchCountryList = []
  let inputValue = ""

  return {
    view: function(vnode) {
      let countryNames = vnode.attrs.countryNames

      return m(".search-country-wrapper", [
        m("input.search-country", {
          type: "text",
          placeholder: "Type name",
          value: inputValue,
          onkeyup: function() {
            inputValue = this.value
            searchCountryList = []
            if (this.value.length > 2)
              searchCountryList = matchCountry(countryNames, this.value)
          }
        }),
        m(".result", {style: {display: searchCountryList.length ? "block":"none"}}, m("ul", [
          searchCountryList.map((countryName) => m("li", {
            onclick: function() {
               vnode.attrs.chartService.addCountry(countryName)
               searchCountryList = []
               inputValue = ""
            }
          }, countryName))
        ]))
      ])
    }
  }
}
