import { track, trigger } from './effect'

export const enum ReactiveFlag {
  IS_REACTIVE = '__v_isReactive',
}

export const mutableHandlers = {
  get(target, key, receiver) {
    if (key === ReactiveFlag.IS_REACTIVE) {
      return true
    }

    // 依赖收集
    track(target, key)

    // reciver指向proxy，必须使用Reflect.get来获取属性并将this指向proxy
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const oldValue = receiver[key]
    const res = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      trigger(target, key, value, oldValue)
    }
    return res
  },
}
