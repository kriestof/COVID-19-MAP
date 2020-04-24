// Copyright 2020 Krzysztof Piwoński <piwonski.kris@gmail.com>
//
// This file is a part of COVID-19 chart.
//
// COVID-19 chart is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// COVID-19 chart is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

export function downloadPng(downloadSvg, filename) {
  let svgString = new XMLSerializer().serializeToString(downloadSvg.node())

  let canvas = document.createElement("canvas");
  canvas.width=downloadSvg.attr("width"); canvas.height=downloadSvg.attr("height")

  let ctx = canvas.getContext("2d");
  let img = new Image();
  let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
  let url = URL.createObjectURL(svg);

  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    let png = canvas.toDataURL("image/png");
    let ref = document.createElement("a")
    ref.href = png
    ref.download = filename
    ref.click()
    URL.revokeObjectURL(png);
  };
  img.src = url;
}

export function UTCDate(strDate) {
  let strDateSplit = strDate.split("/")
  return new Date(`20${strDateSplit[2]}-${strDateSplit[0].padStart(2, "0")}-${strDateSplit[1].padStart(2, "0")}T00:00:00Z`)
}
