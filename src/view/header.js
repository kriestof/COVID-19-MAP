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

let headerComponent = {
  view: function(vnode) {
    return m("header", [
      m("div.menu-left", [
        m("a.uw", {href: "https://www.uw.edu.pl/", "target": "_blank"}, m("img", {src: "assets/uwlogo.png"})),
        m("a.icm", {href: "https://www.icm.edu.pl/", "target": "_blank"}, m("img", {src: "assets/icm_gray.png"}))
      ]),
      m("div.menu-right", [
        // m("a", {href: "https://icm.edu.pl/"}, m("img", {src: "assets/logo_icm.svg", height: "40px"})),
        m("a", {href: "https://covid-19.icm.edu.pl"}, "Start Covid-19"),
        // m("a", {href: "https://covid-19.icm.edu.pl/model-epidemiologiczny-icm/#"}, "Badania dr Afelt"),
        m("a", {href: "https://covid-19.icm.edu.pl/model-epidemiologiczny-icm/"}, "Model epidemiologiczny ICM"),
        m("a", {href: "https://covid19map.icm.edu.pl"}, "Mapa pandemii")
        // m("a", "Interactive Pandemic Map")
      ])
    ])
  }
}

export default headerComponent
