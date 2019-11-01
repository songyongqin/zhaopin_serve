var express = require('express');
const md5 = require('blueimp-md5')

const {UserModel} = this.require('../db/models')
var router = express.Router();

//注册
router.post('/register', (req, res) => {
  //获取请求参数
  const {username,password,type} = req.query
  //处理
  UserModel.findOne({username},(error,user) => {
    if(user) {
      res.send({code:1, msg: '此用户已存在'})
    }else{
      new UserModel({username, password:md5(password), type}).save((error,user) => {
        res.cookie({userid:user._id,max,maxAge:1000*60*60*24})
        const data = {username, type, _id: user._id}
        res.send({code:0,data})
      })
    }
  })
  
  //返回响应数据
});

//登录

module.exports = router;
