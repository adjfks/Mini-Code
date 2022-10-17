export const enum ReactiveFlag {
  IS_REACTIVE = '__v_isReactive',
}

export const mutableHandlers = {
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
}
