function getCssTree(componentSetLibNode) {
  const cssTree = {
    selector: '.' + componentSetLibNode.name,
    styleBody: {},
    children: [],
  }
  componentSetLibNode.propOtions.sort((a, b) => a.length - b.length)
}

module.exports = getStyle
