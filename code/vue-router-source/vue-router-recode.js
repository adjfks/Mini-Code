let _Vue
class VueRouter {
  constructor({ routes }) {
    const routerMap = {}
    routes.forEach(route => {
      const path = route.path
      if (!routerMap[path]) {
        routerMap[path] = route
      }
    })
    this.routerMap = routerMap
    this.current = {
      path: '/',
      component: {
        template: '<div>aa</div>'
      }
    }
    this.listener()
  }
  listener() {
    window.addEventListener('load', () => {
      const hash = window.location.hash
      console.log('load hash: ', hash);
      if (!hash) {
        window.location.hash = '/'
      }
    })
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash
      console.log('change hash: ', hash);
      const route = this.search(hash.slice(1))
      if (route) {
        this.current.path = route.path
        this.current.component = route.component
      }
    })
  }
  search(path) {
    return this.routerMap[path] || null
  }
}
// Vue.use时将会执行install方法
VueRouter.install = function (Vue, options) {
  _Vue = Vue
  // 混入生命周期钩子beforeCreate,给根实例和每个组件实例挂载_routerRoot属性，根实例还需要挂载_router属性
  _Vue.mixin({
    beforeCreate() {
      const vm = this
      if (vm.$options.router) {
        vm._routerRoot = vm
        vm._router = vm.$options.router
        _Vue.util.defineReactive(vm, '_route', vm._router.current)
      } else {
        vm._routerRoot = vm.$parent && vm.$parent._routerRoot
      }
    }
  })
  _Vue.component('router-link', {
    props: {
      to: String
    },
    render(h) {
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    }
  })
  _Vue.component('router-view', {
    render(h) {
      let component = this._routerRoot._route.component
      return h(component)
    }
  })
}
// 当检测到全局存在Vue构造函数时会自动调用Vue.use
if (typeof Vue !== undefined) {
  Vue.use(VueRouter)
}
