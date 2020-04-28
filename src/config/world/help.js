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

const HELP_TEXT = `
<h2>Data</h2>

<p>Data are based <a href="https://github.com/CSSEGISandData/COVID-19">Johns Hopkins CSSE</a> and <a href="https://data.worldbank.org/">World Bank</a>.</p>

<p>Johns Hopkins CSSE data provide COVID19 daily-based data. Formula allows to assess three COVID19 parameters: <strong>infected</strong>, <strong>recovered</strong> and <strong>dead</strong>.</p>

<p>
World Bank data allows to modify mentioned above COVID19 indicators with World Bank data indicators.
Any indicator from <a href="https://data.worldbank.org/indicator">https://data.worldbank.org/indicator</a> can be used.
Indicators would be automatically fetched when formula is entered.
However little modification to World Bank indicator naming is required.
All world bank indicator names should begin with <strong>WB_</strong> prefix.
Parts of indicator name should be merged with dash (_) instead of dot (.).
For instance World Bank indicator name <strong>SP.POP.TOTL</strong> should be translated to <strong>WB_SP_POP_TOTL</strong>
</p>

<h2>Formula syntax</h2>

<p>
Formula syntax is based on <a href="https://mathjs.org/docs/expressions/syntax.html">mathjs</a> library.
Formulas consist of scalars, indicators represended by matrices and operations between them.
Standard arithmetic operations are supported and should be straightforward.
However for clarity they are outlined here.
</p>

<ul>
  <li>Paranthesis <strong>(</strong> and <strong>)</strong> regulates operator precedence</li>
  <li><strong>+</strong> and <strong>-</strong> operations can be used both between scalars and matrices</li>
  <li><strong>*</strong> and <strong>/</strong> can be used between scalars or scalar and matrix</li>
  <li><strong>.*</strong> and <strong>./</strong> operators can be used between matrices to multiply or divide matrices element-wise</li>
  <li><strong>round()</strong> function can be used to round number to integer</li>
  <li><strong>abs()</strong> function can be used to get absolute value</li>
</ul>

<p>
For example formula: <i>round(infected ./ WB_SP_POP_TOTL * 10^6)</i> represents number of infected per one million people.
</p>`

export default HELP_TEXT
