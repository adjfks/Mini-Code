function getCssTree(componentSetLibNode) {
  const cssTree = {
    selector: '.' + componentSetLibNode.name,
    styleBody: {},
    children: [],
  }
  componentSetLibNode.propOtions.sort((a, b) => a.length - b.length)
}

module.exports = getStyle
function getCssTree(componentSetLibNode) {
  const attrSelectors = getSelectors(componentSetLibNode.propOptions)
  const root = {
    selector: '.' + componentSetLibNode.name,
    styleBody: {},
    children: initChildren(attrSelectors, 0),
  }
  console.log(root)
}

function initChildren(attrSelectors, i) {
  if (i >= attrSelectors.length) return []
  const children = []
  const cur = attrSelectors[i]
  for (let j = 0, len = cur.length; j < len; j++) {
    const selector = cur[j]
    const css = {
      selector,
      styleBody: {},
      children: initChildren(attrSelectors, i + 1),
    }
    children.push(css)
  }
  return children
}

function getSelectors(propOptions) {
  const attrSelectors = []
  for (const optionName in propOptions) {
    const optionValues = propOptions[optionName].map(
      (val) => `[${optionName}="${val}"]`
    )
    attrSelectors.push(optionValues)
  }
  return attrSelectors
}

module.exports = getCssTree
