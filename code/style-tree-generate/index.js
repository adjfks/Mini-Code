function getCommonStyle(root1, root2) {
  const node = {
    name: root1.name,
    styles: {},
    children: [],
  }
  const styLen1 = Object.keys(root1.styles).length
  const styLen2 = Object.keys(root2.styles).length
  const [sty1, sty2] =
    styLen1 < styLen2 ? [root1.styles, root2.styles] : [root2.styles, root1.styles]
  // const sty1 = styLen1 < styLen2
  //   ? root1.style
  //   : root2.style
  // const sty2 = styLen1 < styLen2
  //   ? root2.style
  //   : root1.style
  Object.keys(sty1).forEach((p) => {
    if (sty2[p] && sty1[p] === sty2[p]) {
      node.styles[p] = sty1[p]
    }
  })
  for (let i = 0; i < root1.children.length; i++) {
    const child1 = root1.children[i]
    const child2 = root2.children[i]
    node.children.push(getCommonStyle(child1, child2))
  }
  return node
}

module.exports = {
  getCommonStyle,
}
