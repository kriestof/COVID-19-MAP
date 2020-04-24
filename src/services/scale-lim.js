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
