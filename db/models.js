//1连接数据库
//1.1引入mongoose
const mongoose = require('mongoose')
//1.2 连接指定数据库
mongoose.connect('mongodb://localhost:27017/baoan_zhipin')
//1.3获取连接对象
const conn = mongoose.connection
//1.4绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log('数据库连接成功')
})
//2 得到特定集合的model
const userSchema = mongoose.Schema({
  username: {type:String, required: true},
  password: {type:String, required: true},
  type: {type:String, required: true},
  head: {type:String},
  post: {type:String},
  info: {type: String},
  company: {type: String},
  salary: {type: String}
})

const UserModel = mongoose.model('user',userSchema)

exports.UserModel = UserModel
