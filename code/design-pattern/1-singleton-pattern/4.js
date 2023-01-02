/* 通用的单例 */
function getSingle(fn) {
  var result
  return function() {
    return result || (result = new fn(...arguments))
  }
}

var CreateDiv = function(html) {
  this.html = html
  this.init()
}

CreateDiv.prototype.init = function() {
  const div = document.createElement('div')
  div.innerHTML = this.html
  document.body.appendChild(div)
}

var createSingleDiv = getSingle(CreateDiv)

var div1 = createSingleDiv('div1')
var div2 = createSingleDiv('div2')
