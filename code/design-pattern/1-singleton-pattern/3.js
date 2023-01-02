var CreateDiv = function(html) {
  this.html = html
  this.init()
}

CreateDiv.prototype.init = function() {
  const div = document.createElement('div')
  div.innerHTML = this.html
  document.body.appendChild(div)
}

var proxySingletonCreateDiv = (function() {
  var instance
  return function () {
    if (instance) {
      return instance
    }
    return instance = new CreateDiv(...arguments)
  }
})()

var proxy_div1 = proxySingletonCreateDiv('proxy div1')
var proxy_div2 = proxySingletonCreateDiv('proxy div2')

var div3 = new CreateDiv('div3')
var div4 = new CreateDiv('div4')
var div5 = new CreateDiv('div5')
