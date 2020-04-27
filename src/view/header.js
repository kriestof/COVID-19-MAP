import m from "/web_modules/mithril.js"

let headerComponent = {
  view: function(vnode) {
    return m("header", m("h1", [
      m("a", {href: "https://icm.edu.pl/"}, m("img", {src: "assets/logo_icm.svg", height: "40px"})),
      m("span", vnode.attrs.text)
    ]))
  }
}

export default headerComponent
