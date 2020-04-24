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

      return m("#search-country-wrapper", [
        m("input#search-country", {
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
        m("#result", {style: {display: searchCountryList.length ? "block":"none"}}, m("ul", [
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
