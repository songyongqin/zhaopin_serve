var express = require('express');
const md5 = require('blueimp-md5')
const filter = {password:0} //指定过滤的熟悉
const {UserModel} = require('../db/models.js')
const filter = {password:0}
var router = express.Router();

//注册
router.post('/register', (req, res) => {
  //获取请求参数
  const {username,password,type} = req.body
  //处理
  UserModel.findOne({username},(error,user) => {
    console.log(user)
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

module.exports = router;
