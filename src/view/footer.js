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

export default function footerComponent() {
  return {
   view: function(vnode) {
     return m("footer", [
       m("span.left", [
         m("a.logo-link", {href: "https://icm.edu.pl/"}, m("img", {src: "assets/logo_icm.svg", height: "20px"})),
         m("span", "COVID-19 chart and map. Copyright 2020 Krzysztof Piwoński. "),
         m("a", {href: "https://github.com/kriestof/COVID-19-MAP"}, "source code")
       ]),
       m("span.right", [
         "Based on data collected by ",
         m("a", {href: "https://github.com/CSSEGISandData/COVID-19"}, "Johns Hopkins CSSE"),
         " and ",
         m("a", {href: "https://data.worldbank.org/indicator"}, "World Bank")
       ])
     ])
   }
 }
}
