const patch = require('./patch')

function initCssTree(componentSetLibNode) {
  // 将属性选择器进行格式化整理，便于建树
  const attrSelectors = getSelectors(componentSetLibNode.propOptions)
  // 完整的DOM树
  const completedTree = componentSetLibNode.completedTree
  // 给每个子节点样式树进行补丁patch
  componentSetLibNode.stateChildren = componentSetLibNode.stateChildren.map((stateChild) => patch(completedTree, stateChild))
  // 在将状态树添加到叶子节点前进行处理，整理compileNode成cssStrElement的形似
  const stateTrees = getStateTrees(componentSetLibNode)
  // 建树
  return {
    selector: '.' + componentSetLibNode.name,
    styleBody: {},
    children: initChildren(stateTrees, attrSelectors, 0),
  }
}

function initChildren(stateTrees, attrSelectors, i, stack = []) {
  if (i >= attrSelectors.length) {
    const path = stack.join('')
    const tree = stateTrees.find(tree => tree.selector === path)
    return tree.children
  }
  const children = []
  const cur = attrSelectors[i]
  for (let j = 0, len = cur.length; j < len; j++) {
    const selector = cur[j]
    // stack用于记录当前节点所在的树枝路径，如 ['[type="secondary"]', '[shape="standard"]']
    stack.push(selector)
    let styleBody = {}
    if (i === attrSelectors.length - 1) {
      const path = stack.join('')
      const tree = stateTrees.find(tree => tree.selector === path)
      styleBody = tree.styleBody || {}
    }
    const css = {
      selector: `&${selector}`,
      styleBody,
      children: initChildren(stateTrees, attrSelectors, i + 1, stack),
    }
    children.push(css)
    stack.pop()
  }
  return children
}

// 整理compileNode成cssStrElement的形似
function getStateTrees(componentSetLibNode) {
  const stateChildren = componentSetLibNode.stateChildren
  const formatFn = (name) => name.split(',').map(item => {
    const [prop, value] = item.trim().toLowerCase().split('=')
    return `[${prop}="${value}"]`
  }).join('')
  return formatChildrenNode(stateChildren, formatFn)
}

function formatChildrenNode(stateChildren, formatSelectorFn) {
  if (Array.isArray(stateChildren)) {
    for (let i = 0, len = stateChildren.length; i < len; i++) {
      const child = stateChildren[i]
      stateChildren[i] = {
        selector: formatSelectorFn ? formatSelectorFn(child.name) : `.${child.name}`,
        styleBody: child.style,
        children: formatChildrenNode(child.children)
      }
    }
    return stateChildren
  }
  if (!stateChildren || !Reflect.ownKeys(stateChildren).length) return {}
  for (const childName in stateChildren) {
    const child = stateChildren[childName]
    stateChildren[childName] = {
      selector: formatSelectorFn ? formatSelectorFn(child.name) : `.${child.name}`,
      styleBody: child.style,
      children: formatChildrenNode(child.children)
    }
  }
  return stateChildren
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

module.exports = initCssTree