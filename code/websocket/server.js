const http = require('http')
const WebSocket = require('ws')

const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on('connection', (socket) => {
  console.log('WebSocket 连接已打开！')

  socket.on('message', (message) => {
    console.log('message: ', message)
    socket.send('Hello Adjfks')
  })

  socket.on('close', () => {
    console.log('WebSocket连接已关闭！')
  })
})

server.on('request', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World!')
})

server.listen(8080, () => {
  console.log('服务器已启动，正在监听8080端口...')
})
