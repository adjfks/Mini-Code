function patch(fullTree, target) {
  const children1 = fullTree.children
  const children2 = target.children
  if (!children1 || !children2) {
    return
  }

  target.children = {}
  const nameSet = new Set()

  for (const child of children1) {
    nameSet.add(child.name)
  }

  for (const child of children2) {
    if (nameSet.has(child.name)) {
      nameSet.delete(child.name)
    }
    target.children[child.name] = child
  }

  for (const name of Array.from(nameSet)) {
    const node = {
      name,
      style: { display: 'none' }
    }
    target.children[name] = node
  }

  for (const child1 of children1) {
    const child2 = target.children[child1.name]
    patch(child1, child2)
  }
  return target
}

module.exports = patch