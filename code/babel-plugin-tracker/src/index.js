const { xlsx } = require('node-xlsx')

function isDuplicateTraverse(path) {
  return (
    path.isFunctionDeclaration() ||
    path.isClassDeclaration() ||
    path.isArrowFunctionExpression()
  )
}

// 解析excel表格
function parseXlsx(excelFilePath) {
  // 解析excel, 获取到所有sheets
  const sheets = xlsx.parse(excelFilePath)
  const sheet = sheets[0]
  return sheet.data.reduce((v, t) => {
    if (t[1] === 'id') return v
    const paramsArr = []
    for (let i = 3; i < t.length; i++) {
      paramsArr.push(t[i])
    }
    v[t[1]] = paramsArr
    return v
  }, {})
}

module.exports = function ({ template }) {
  function handleComments(comments, type, isAdd, pathBody, path) {
    if (!comments?.length) return
    for (let i = comments.length - 1; i >= 0; i--) {
      const comment = comments[i]
      // 行级注释
      if (comment?.type === 'CommentLine') {
        const comArr = comment.value.trim().split('-')
        if (comArr[0] === 'buried') {
          if (isAdd) {
            console.log(`待更换的注释是:${comment.value}, 类型是:${type}`)
            // 插入
            const node = template(`
            var buried = 'buried'
            `)()
            console.log('node: ', node)
            pathBody.push(node)
          }
          // 重复的注释节点也要删除
          path.node[type].splice(i, 1)
          // console.log('path.node: ', path.node)
        }
      }
    }
  }

  return {
    visitor: {
      Program: {
        enter(path, state) {
          console.log('enter')
        },
        exit() {
          console.log('exit')
        },
      },
      'FunctionDeclaration|ClassDeclaration|ArrowFunctionExpression'(
        path,
        state
      ) {
        path.traverse({
          enter(path) {
            // 重复遍历则直接跳过
            if (isDuplicateTraverse(path)) path.skip()
            if (typeof path.key === 'number') {
              // console.log('enter', path.key, path.node.type)
            }
            const isSiblingTrailExit = !!path.getSibling(path.key - 1)?.node
              ?.trailingComments?.length
            // console.log('isSiblingTrailExit: ', isSiblingTrailExit)
            const { leadingComments, innerComments, trailingComments } =
              path.node
            handleComments(
              leadingComments,
              'leadingComments',
              !isSiblingTrailExit,
              path.parent.body,
              path
            )
            handleComments(
              innerComments,
              'innerComments',
              true,
              path.node.body,
              path
            )
            handleComments(
              trailingComments,
              'trailingComments',
              true,
              path.parent.body,
              path
            )
          },
          exit(path) {
            // if (typeof path.key === 'number')
            // console.log('exit', path.key, path.node.type)
          },
        })
      },
    },
  }
}
