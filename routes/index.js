var express = require('express');
const md5 = require('blueimp-md5')
const filter = {password:0} //指定过滤的熟悉

const {UserModel} = require('../db/models')
var router = express.Router();

//注册
router.post('/register', (req, res) => {
  //获取请求参数
  const {username,password,type} = req.body
  console.log(username)
  //处理
  UserModel.findOne({username},(error,user) => {
    console.log(user)
    if(user) {
      res.send({code:1, msg: '此用户已存在'})
    }else{
      new UserModel({username, password:md5(password), type}).save((error,user) => {
        res.cookie('userid',user._id,{maxAge:1000*60*60*24})
        const data = {username, type, _id: user._id}
        res.send({code:0,data})
      })
    }
  })
})
//登录
router.post('/login',(req,res) => {
  const {username, password} = req.body
  UserModel.findOne({username,password:md5(password)},filter,(error,user) => {
    if(user) {
      res.send({code:0,data:user})
    }else{
      res.send({code:1,msg:'用户未注册'})
    }
  })
})

module.exports = router;
