import { isObject } from '@vue/shared'

const enum ReactiveFlag {
  IS_REACTIVE = '__v_isReactive',
}

// target -> proxy
const reactiveMap = new WeakMap()

export function reactive(target) {
  if (!isObject(target)) return

  // 解决同一个原始对象代理多次的问题
  if (target[ReactiveFlag.IS_REACTIVE]) return target

  // 解决一个对象代理之后得到的proxy再传入进行代理的问题
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) return existingProxy

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlag.IS_REACTIVE) {
        return true
      }
      // reciver指向proxy，必须使用Reflect.get来获取属性并将this指向proxy
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver)
    },
  })
  reactiveMap.set(target, proxy)
  return proxy
}
