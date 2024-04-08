const express = require('express')
const path = require('path')

const app = express()

app.use('/static', express.static('./static'))

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(__dirname, './index.html'))
})

app.listen(3000, () => {
  console.log('server running, listening port 3000...')
})
