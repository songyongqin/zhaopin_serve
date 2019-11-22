var express = require('express');
const md5 = require('blueimp-md5')

const {UserModel, ChatModel} = require('../db/models.js')
const filter = {password:0}
var router = express.Router();

//注册
router.post('/register', (req, res) => {
  //获取请求参数
  const {username,password,type} = req.body
  //处理
  UserModel.findOne({username},(error,user) => {
    if(user) {
      res.send({code:1, msg: '此用户已存在'})
    }else{
      new UserModel({username, password:md5(password), type}).save((error,user) => {
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24}) //引号
        const data = {username, type, _id: user._id}
        res.send({code:0,data})
      })
    }
  })
  //返回响应数据
});

//登录
router.post('/login', (req, res) => {
  //获取请求参数
  const {username,password} = req.body
  //处理
  UserModel.findOne({username,password:md5(password)},filter,(error,user) => {
    if(!user) {
      res.send({code:1, msg: '用户名或者密码错误'})
    }else{
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24}) //引号
      console.log('login',user._id)
      res.send({code:0,data:user})
    }
  })
});

//修改个人信息
router.post('/update',(req, res) => {
  //先判断cookie中是否有userid
  const userid = req.cookies.userid
  if(!userid) {
    return res.send({code:1,msg:'请先登录'})
  }
  const user = req.body
  //使用userid去数据库中修改
  UserModel.findByIdAndUpdate({_id:userid},user,(error,oldUser) => {
    if(!oldUser) {
      //如果没有查询到user，即前端cookie失效了
      res.clearCookie('userid')
      return res.send({code:1,msg:'请先登录'})
    }
    //查询到了，我们需要合并一个新对象返回,但不希望返回oldUser中的password
    const {_id, username, type} = oldUser
    const data = Object.assign(user,{_id, username, type})
    res.send({code:0,data})
  })
})

//获取个人信息路由
router.get('/user', (req, res) => {
  console.log(111)
  const userid = req.cookies.userid
  if(userid) {
    UserModel.findOne({_id:userid},filter,(error,user) => {
      res.send({code:0,data:user})
    })
  }else{ //cookie中没有userid
    res.send({code:1,msg:'请先登录'})
  }
})

//获取用户列表信息
router.get('/userlist', (req, res) => {
  const {type} = req.query
  UserModel.find({type}, filter, (error, user) => {
    res.send({code:0,data:user})
  })
})

//获取当前用户所有相关聊天信息列表
router.get('/msglist', (req, res) => {
  //返回所有user用户的用户名和头像
  UserModel.find((err, userDocs) => {
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username:user.username, header: user.header}
      return users
    }, {})
    //查询与userid相关的所有聊天信息
    const userid = req.cookies.userid
    console.log('msglist',userid)
    ChatModel.find({'$or':[{from: userid}, {to: userid}]}, filter, (err, chatMsgs) => {
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

//修改指定消息为已读
router.post('/readmsg', (req, res) => {
  const {from} = req.body
  const to = req.cookies.userid
  //更新数据库中chat数据
  //1. 查询条件
  //2. 更新为指定的数据对象
  //3. 是否一次更新多条，默认更新一条
  //4. 更新完成的回调函数
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, (err, doc) => {
    res.send({code:0, data: doc.nModified})
  })
})





module.exports = router;
