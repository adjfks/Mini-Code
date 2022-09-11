document.querySelector('#xhr1_btn').onclick = function () {
  const xhr = new XMLHttpRequest()
  // 在open之前监听onreadystatechange事件，保证跨浏览器兼容性
  xhr.onreadystatechange = function () {
    // 使用DOM level0,保证跨浏览器兼容性
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        const h3 = document.createElement('h3')
        h3.innerHTML = `接收到xhr1响应  --->   ${xhr.responseText}`
        document.body.appendChild(h3)
      }
    }
  }
  xhr.open('get', '/test')
  xhr.send(null) // 没有请求体也必须加上null，保证跨浏览器兼容性
}
