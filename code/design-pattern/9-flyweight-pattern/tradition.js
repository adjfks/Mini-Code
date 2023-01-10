/*
  上传功能的传统实现
*/

// 上传对象的构造函数
var UploadObj = (function () {
  function UploadObj(uploadType, fileName, fileSize) {
    console.log('创建对象');
    this.uploadType = uploadType || 'plugin'
    this.fileName = fileName
    this.fileSize = fileSize
    this.dom = null
  }
  // 初始化方法
  UploadObj.prototype.init = function (id) {
    var that = this
    this.id = id
    this.dom = document.createElement('div')
    this.dom.innerHTML = `
      <span>文件名称：${this.fileName}, 文件大小：${this.fileSize}</span>
      <button class="delFile">删除</button>
    `
    this.dom.querySelector('.delFile').onclick = function () {
      that.delFile()
    }
    document.body.appendChild(this.dom)
  }
  // 删除文件的方法
  UploadObj.prototype.delFile = function () {
    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom)
    }
    if (window.confirm('确定要删除该文件吗？' + this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom)
    }
  }
  return UploadObj
})()

// 上传函数
var startUpload = (function () {
  var id = 0
  return function (uploadType, files) {
    for (var i = 0; i < files.length; i++) {
      const uploadObj = new UploadObj(uploadType, files[i].fileName, files[i].fileSize)
      uploadObj.init(id)
    }
  }
})()


