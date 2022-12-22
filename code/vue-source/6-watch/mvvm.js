function Mvvm(config) {
  this.$el = config.el
  this.$root = document.querySelector(this.$el)
  this.$data = observe(config.data)
  proxy.call(this, this.$data)
  this.$template = config.template || ''
  render.call(this)
  config.watch && initWatch(this, config.watch)

  function observe(obj) {
    for (let key in obj) {
      let dep = new Dep()
      let value = obj[key]
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          if (Dep.target) {
            dep.addSub(Dep.target)
          }
          return value
        },
        set: function (newVal) {
          if (newVal === value) return
          const oldVal = value
          value = newVal
          dep.notifyAll(newVal, oldVal)
        }
      })
    }
    return obj
  }

  function Dep() {
    this.subscribers = []
    this.addSub = function (sub) {
      if (this.subscribers.findIndex(s => s === sub) === -1) {
        this.subscribers.push(sub)
      }
    }
    this.notifyAll = function (newVal, oldVal) {
      for (let i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i].update(newVal, oldVal)
      }
    }
  }

  function proxy(data) {
    for (let key in data) {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          return this.$data[key]
        },
        set: function (newVal) {
          this.$data[key] = newVal
        }
      })
    }
  }

  function render() {
    var html = this.$template
      .replace(/"/g, '\\"')
      .replace(/\s+|\r|\t|\n/g, ' ')
      .replace(/\{\{.*?\}\}/g, function (value) {
        return value.replace('{{', '"+(').replace('}}', ')+"')
      })
    html = `var targetHtml = "${html}";return targetHtml;`
    var parsedHtml = new Function(...Object.keys(this.$data), html)(...Object.values(this.$data))
    this.$root.innerHTML = parsedHtml
  }

  function initWatch(vm, watch) {
    for (let key in watch) {
      createWatcher(vm, key, watch[key])
    }
  }

  function createWatcher(vm, key, handler) {
    new Watcher(vm, key, handler)
  }

  function Watcher(vm, expOrFn, cb) {
    this.cb = cb
    this.getter = function () {
      return vm[expOrFn]
    }
    // 访问响应式数据，触发该数据的dep收集当前这个watcher
    // 实际vue中用了一个栈来进行Dep.target的赋值
    Dep.target = this
    this.value = this.getter()
    Dep.target = null

    this.update = cb
  }
}
