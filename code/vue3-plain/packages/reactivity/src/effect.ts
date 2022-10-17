export let activeEffect: ReactiveEffect | undefined = undefined

type Dep = Set<ReactiveEffect>
type keyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, keyToDepMap>()

class ReactiveEffect {
  active = true
  constructor(public fn) {}
  run() {
    // 非激活情况，只需要执行函数，不需要进行依赖收集
    if (!this.active) this.fn()
    try {
      activeEffect = this
      this.fn()
    } finally {
      activeEffect = undefined
    }
  }
}

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

// 依赖收集
export function track(target: object, key) {
  let keyToDepMap = targetMap.get(target)
  if (!keyToDepMap) {
    targetMap.set(target, (keyToDepMap = new Map()))
  }
  let Dep = keyToDepMap.get(key)
  if (!Dep) {
    keyToDepMap.set(key, (Dep = new Set()))
  }
  if (activeEffect) {
    Dep.add(activeEffect)
  }
}

// 触发更新
export function trigger(target: object, key, value, oldValue) {
  let effects = new Set<() => any>()
  const keyToDepMap = targetMap.get(target)
  const dep = keyToDepMap.get(key)
  dep.forEach((e) => {
    effects.add(e.run.bind(e))
  })
  effects.forEach((effect) => {
    effect()
  })
}
