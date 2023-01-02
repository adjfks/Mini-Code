var CreateDiv = (function() {
  var instance
  var CreateDiv = function(html) {
    if (instance) {
      return instance
    }
    this.html = html
    this.init()
    return instance = this
  }
  CreateDiv.prototype.init = function () {
    const div = document.createElement('div')
    div.innerHTML = this.html
    document.body.appendChild(div)
  }
  return CreateDiv
})()

const div1 = new CreateDiv('div1')
const div2 = new CreateDiv('div2')
