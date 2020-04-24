let projection = d3.geoRobinson()

let predefinedIndicators = [
  {name: "infected", formula: "infected"},
  {name: "recovered", formula: "recovered"},
  {name: "deaths", formula: "deaths"},
  {name: "currently infected", formula: "infected - recovered - deaths"},
  {name: "recovered rate", formula: "recovered ./ infected * 10^2"},
  {name: "death rate", formula: "deaths ./ infected * 10^2"},
  {name: "infected per POP per 1 mln.", formula: "round(infected ./ WB_SP_POP_TOTL * 10^6)"},
  {name: "deaths per POP per 1 mln.", formula: "round(deaths ./ WB_SP_POP_TOTL * 10^6)"},
  {name: "infected per POP DNST.", formula: "round(infected ./ WB_EN_POP_DNST)"},
  {name: "deaths per POP DNST.", formula: "round(deaths ./ WB_EN_POP_DNST)"},
]

let regions = [
  {value: "world", name: "World", scale: projection.scale(), translate: projection.translate()},
  {value: "europe", name: "Europe", scale: 700, translate: [300, 930]},
  {value: "asia", name: "Asia", scale: 400, translate: [-100, 500]},
  {value: "africa", name: "Africa", scale: 350, translate: [300, 260]},
  {value: "samerica", name: "South America", scale: 350, translate: [800, 140]},
  {value: "namerica", name: "North America", scale: 450, translate: [1200, 600]},
  {value: "australia", name: "Australia", scale: 450, translate: [-600, 50]},
]

let config = {
  regions: regions,
  predefinedIndicators: predefinedIndicators,
  projection: projection
}

export default config
