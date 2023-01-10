/*
  使用享元模式进行优化
  享元模式的关键是找出对象的内部状态和外部状态
  对于本例子中的上传对象，内部状态是 uploadType，外部状态则是fileName,fileSize等
*/

// 上传对象的构造函数，只需设置内部状态uploadTyp
var UploadObj = function (uploadType) {
  console.log('创建对象');
  this.uploadType = uploadType
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

// 提供一个工厂对象，用于创建共享对象
var uploadObjFactor = (function () {
  // 哈希map用于记录共享对象
  var createdFlyWeightObjs = {}
  return {
    create: function (uploadType) {
      return createdFlyWeightObjs[uploadType] ||
        (createdFlyWeightObjs[uploadType] = new UploadObj(uploadType))
    }
  }
})()

// 提供一个外部状态管理器
var uploadManager = (function () {
  var uploadDatabase = {}
  return {
    // 用于往外部状态池添加外部状态
    add: function (id, uploadType, fileName, fileSize) {
      var flyweightObj = uploadObjFactor.create(uploadType)
      var dom = document.createElement('div')
      dom.innerHTML = `
        <span>文件名称：${fileName}, 文件大小：${fileSize}</span>
        <button class="delFile">删除</button>
      `
      dom.querySelector('.delFile').onclick = function () {
        flyweightObj.delFile()
      }
      document.body.appendChild(dom)
      uploadDatabase[id] = {
        fileName,
        fileSize,
        dom
      }
      return flyweightObj
    },
    // 用于给共享对象设置外部状体
    setExternalState: function (id, flyweightObj) {
      for (var i in uploadDatabase[id]) {
        flyweightObj[i] = uploadDatabase[id][i]
      }
    }
  }
})()

// 提供用户调用的startUpload方法
var startUpload = (function () {
  var id = 0
  function startUpload(uploadType, files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var uploadObj = uploadManager.add(id, uploadType, file.fileName, file.fileSize)
      uploadManager.setExternalState(id, uploadObj)
      id++
    }
  }
  return startUpload
})()

