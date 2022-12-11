function Mvvm(config) {
  this.$el = config.el
  this.$root = document.querySelector(config.el)
  this.$data = observe(config.data)
  // 用于将data中的属性代理到this实例上,使得可以通过this.xxx的方式访问数据
  proxy.call(this, this.$data)
  this.$template = config.template
  new Watcher(() => {
    console.log(this.name, this.age);
    render.call(this)
  })
  if (config.computed) {
    initComputed(this, config.computed)
  }

  function Dep() {
    // 收集订阅者（依赖）的数组
    this.subscribers = []
    // 添加依赖的方法
    this.addSub = function (sub) {
      if (sub && this.subscribers.findIndex(item => item === sub) === -1) {
        this.subscribers.push(sub)
      }
      if (sub && sub.deps.findIndex(item => item === this) === -1) {
        sub.depend(this)
      }
    }
    // 通知所有依赖更新的方法
    this.notifyAll = function () {
      for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i].update()
      }
    }
  }

  function observe(obj) {
    for (let key in obj) {
      // 每一个属性对应一个Dep实例
      let dep = new Dep()
      let value = obj[key]
      if (Object.prototype.toString.call(value) === '[object Object]') {
        observe(value)
      }
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          if (Dep.target) {
            // 添加依赖
            dep.addSub(Dep.target)
          }
          return value
        },
        set: function (newVal) {
          if (newVal === value) return value
          value = newVal
          dep.notifyAll()
        }
      })
    }
    return obj
  }

  function Watcher(fn, options) {
    this.dirty = false
    this.lazy = !!options.lazy
    // 用于收集dep
    this.deps = []
    // 更新函数
    this.update = function () {
      // 计算属性的watcher.lazy为true
      if (this.lazy) {
        this.dirty = true
      } else {
        this.value = fn()
      }
    }
    this.evaluate = function () {
      if (this.lazy) {
        this.value = fn()
      }
      return this.value
    }

    this.depend = function (dep) {
      this.deps.push(dep)
    }
    // 初始化watcher时要给相应数据添加依赖
    Dep.target = this
    this.value = fn()
    Dep.target = null
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

  // 处理template并进行渲染
  function render() {
    var html = this.$template
      .replace(/"/g, '\\"')
      .replace(/\s+|\r|\t|\n/g, ' ')
      .replace(/\{\{.*?\}\}/g, function (value) {
        return value.replace('{{', '"+(').replace('}}', ')+"')
      })
    html = `var targetHtml = "${html}";return targetHtml;`
    // 语法：new Function(...args, functionBody)
    var parsedHtml = new Function(...Object.keys(this.$data), html)(...Object.values(this.$data))
    this.$root.innerHTML = parsedHtml
  }

  // 暂时只实现函数形式的computed
  function initComputed(vm, computed) {
    var watchers = vm._computedWatchers = Object.create(null)
    for (let key in computed) {
      const getter = computed[key]
      watchers[key] = new Watcher(getter, { lazy: true })
      // 将计算属性代理到vm实例上
      if (!(key in vm)) {
        defineComputed(vm, key);
      }
    }
  }

  function defineComputed(vm, key) {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: createComputedGetter(key)
    })
  }

  function createComputedGetter(key) {
    // 获取该属性对应的watcher
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {

      }
    }
  }
}
