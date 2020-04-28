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

export default function ScaleLimService() {
  this.valueLim = undefined
  this.dateLim = undefined

  this.setValueLim = function(minVal, maxVal) {
    this.valueLim = [minVal, maxVal]
  }

  this.setDateLim = function(minVal, maxVal) {
    this.dateLim = [minVal, maxVal]
  }
}
