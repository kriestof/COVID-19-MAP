function downloadPng(downloadSvg, filename) {
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
