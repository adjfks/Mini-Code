
function getCssTree(componentSetLibNode) {
  const root = initCssTree(componentSetLibNode)
}

function initCssTree(componentSetLibNode) {
  // // 将属性选择器进行格式化整理，便于建树
  const attrSelectors = getSelectors(componentSetLibNode.propOptions)
  // // 完整的DOM树
  // const completedTree = componentSetLibNode.completedTree
  // // 
  // // 给每个子节点样式树进行补丁patch
  // componentSetLibNode.stateChildren.forEach(stateChild => {
  //   patch(completedTree, stateChild)
  // })
  // 格式化补丁后的样式树
  const stateTrees = getStateTrees(componentSetLibNode)
  return {
    selector: '.' + componentSetLibNode.name,
    styleBody: {},
    children: initChildren(stateTrees, attrSelectors, 0),
  }
}

function initChildren(stateTrees, attrSelectors, i, stack = []) {
  if (i >= attrSelectors.length) {
    // console.log(stack);
    // const propSelector = stack.join('')
    // const tree = stateTrees.find(tree => tree.selector === propSelector)
    // return tree.children
    return []
  }
  const children = []
  const cur = attrSelectors[i]
  for (let j = 0, len = cur.length; j < len; j++) {
    const selector = cur[j]
    // stack用于记录当前节点所在的树枝路径，如 ['[type="secondary"]', '[shape="standard"]']
    stack.push(selector)
    const css = {
      selector: `&${selector}`,
      styleBody: {},
      children: initChildren(stateTrees, attrSelectors, i + 1, stack),
    }
    children.push(css)
    stack.pop()
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

function getStateTrees(componentSetLibNode) {
  const stateChildren = componentSetLibNode.stateChildren
  const formatFn = (name) => name.split(',').map(item => {
    const [prop, value] = item.trim().toLowerCase().split('=')
    return `[${prop}="${value}"]`
  })
  return formatChildrenNode(stateChildren, formatFn)

}

function formatChildrenNode(children, formatSelectorFn) {
  if (!children || !children.length) return []
  return children.map(child => {
    return {
      selector: formatSelectorFn ? formatSelectorFn(child.name) : `.${child.name}`,
      styleBody: child.style,
      children: formatChildrenNode(child.children)
    }
  })
}

module.exports = {
  getCssTree,
  initCssTree,
  initChildren,
  getSelectors,
}
