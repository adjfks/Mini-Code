import vnode from './vnode'
export default function (
  sel: string,
  data: object,
  ch: number | string | Object | object[]
) {
  if (Array.isArray(ch)) {
    return vnode(sel, data, ch, undefined, undefined)
  } else if (typeof ch === 'object' && ch.hasOwnProperty('sel')) {
    return vnode(sel, data, [ch], undefined, undefined)
  } else if (typeof ch === 'number' || typeof ch === 'string') {
    return vnode(sel, data, undefined, ch, undefined)
  }
}
