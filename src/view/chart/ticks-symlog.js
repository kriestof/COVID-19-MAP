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
import * as d3 from "/web_modules/d3.js"

export default function ticksSymlogWrapper(y) {
  return function ticksSymlog(count) {
   let logp = (x) => Math.sign(x) * Math.log1p(Math.abs(x))
   let powp = (x) => Math.sign(x) * Math.expm1(Math.abs(x))

   let d = y.domain(),
       u = d[0],
       v = d[d.length - 1],
       r;
   let base = Math.E
   if (r = v < u) i = u, u = v, v = i;

   let i = logp(u),
       j = logp(v),
       p,
       k,
       t,
       n = count == null ? 10 : +count,
       z = [];

   if (!(base % 1) && j - i < n) {
     i = Math.floor(i), j = Math.ceil(j);
     if (u > 0) for (; i <= j; ++i) {
       for (k = 1, p = powp(i); k < base; ++k) {
         t = p * k;
         if (t < u) continue;
         if (t > v) break;
         z.push(t);
       }
     } else for (; i <= j; ++i) {
       for (k = base - 1, p = powp(i); k >= 1; --k) {
         t = p * k;
         if (t < u) continue;
         if (t > v) break;
         z.push(t);
       }
     }
     if (z.length * 2 < n) z = ticks(u, v, n);
   } else {
     z = d3.ticks(i, j, Math.min(j - i, n)).map(powp);
   }

   return r ? z.reverse() : z;
  }
}
