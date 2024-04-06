let nextUnitOfWork = null

const workLoop = (deadline) => {
  let shouldYield = false
  if (nextUnitOfWork && !shouldYield) {
    // 处理fiber
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork) {
    // commit
  }
  requestIdleCallback(workLoop)
}

// requestIdleCallback(workLoop)

const render = () => {}

const DidAct = {
  render,
}

const container = document.getElementById('app')
DidAct.render(container)
