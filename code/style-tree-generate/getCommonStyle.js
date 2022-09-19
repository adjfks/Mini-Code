function getCommonStyle(root1, root2) {
  if (root1.styles['display'] === 'none' || root2.styles['display'] === 'none')
    return null
  const node = {
    sel: root1.sel,
    styles: {},
    children: {},
  }
  const styLen1 = Object.keys(root1.styles).length
  const styLen2 = Object.keys(root2.styles).length
  const [sty1, sty2] =
    styLen1 < styLen2
      ? [root1.styles, root2.styles]
      : [root2.styles, root1.styles]
  Object.keys(sty1).forEach((p) => {
    if (sty2[p] && sty1[p] === sty2[p]) {
      node.styles[p] = sty1[p]
    }
  })
  for (const sel in root1.children) {
    const child1 = root1.children[sel]
    const child2 = root2.children[sel]
    if (child2) {
      const res = getCommonStyle(child1, child2)
      if (res) {
        node.children[sel] = res
      }
    }
  }
  return node
}

module.exports = getCommonStyle
