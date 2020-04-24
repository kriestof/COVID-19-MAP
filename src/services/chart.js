export default function ChartService(indicatorList) {
  this.countries = []
  this.countryColors = new Set()

  this.getColor = function() {
    let i = 0
    while (this.countryColors.has(d3.schemeCategory10[i])) i +=1

    this.countryColors.add(d3.schemeCategory10[i])
    return d3.schemeCategory10[i]
  }

  this.addCountry = function(countryName) {
    if (this.countries.length >= 10) return undefined
    if (this.countries.filter((x) => x.name == countryName).length) return undefined
    this.countries.push({name: countryName, color: this.getColor()})
  }

  this.removeCountry = function(country) {
    this.countries = this.countries.filter((el) => el.name !== country.name)
    this.countryColors.delete(country.color)
  }
}
