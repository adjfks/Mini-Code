import fs from 'fs'
import http from 'http'

const server = http.createServer()

server.on('request', function (req, res) {
  const method = req.method
  if (method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      fs.readFile('./index.html', function (err, data) {
        res.end(data)
      })
    } else if (req.url === '/test') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end('test响应')
    } else if (req.url === '/index.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' })
      fs.readFile('./index.js', function (err, data) {
        res.end(data)
      })
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      fs.readFile('./404.html', function (err, data) {
        res.end(data)
      })
    }
  }
})

const PORT = 8000
server.listen(PORT, function () {
  console.log(`服务已启动，正在监听${PORT}端口...`)
})
