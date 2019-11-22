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
  username: {type:String, required: true}, //用户名
  password: {type:String, required: true},  //密码
  type: {type:String, required: true},  //类型 dashen|laoban
  header: {type:String}, //头像
  post: {type:String}, //职位
  info: {type:String}, //个人或者职位简介
  company: {type:String}, //公司名称
  salary: {type:String}, //薪资
})

const UserModel = mongoose.model('user',userSchema)

exports.UserModel = UserModel   


// 定义 chats 集合的文档结构
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的 id 
  to: {type: String, required: true}, // 接收用户的 id 
  chat_id: {type: String, required: true}, // from 和 to 组成的字符串 
  content: {type: String, required: true}, // 内容 
  read: {type:Boolean, default: false}, // 标识是否已读 
  create_time: {type: Number} // 创建时间
})
const ChatModel = mongoose.model('chat',chatSchema)

exports.ChatModel = ChatModel
