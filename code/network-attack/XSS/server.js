/* 
  简单模拟反射型XSS攻击
  访问localhost:3000/?username="Joke" 页面正常显示username
  当黑客在请求中携带恶意参数时：例如访问 localhost:3000/?username=Joke<script>alert('你被攻击了！')</script>
*/

var express = require('express')

var router = express.Router()

router.get('/', function (req, res, next) {
  res.send('username：' + req.query.username)
})

var app = express()
app.use(router)

app.listen(3000, () => {
  console.log('listening to 3000...');
})
