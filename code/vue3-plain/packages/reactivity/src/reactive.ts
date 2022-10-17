import { isObject } from '@vue/shared'
import { mutableHandlers, ReactiveFlag } from './baseHandler'

// target -> proxy
const reactiveMap = new WeakMap()

export function reactive(target) {
  if (!isObject(target)) return

  // 解决同一个原始对象代理多次的问题
  if (target[ReactiveFlag.IS_REACTIVE]) return target

  // 解决一个对象代理之后得到的proxy再传入进行代理的问题
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) return existingProxy

  const proxy = new Proxy(target, mutableHandlers)

  reactiveMap.set(target, proxy)
  return proxy
}
