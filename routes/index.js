var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/register', function(req, res) {
  const {username,password} = req.query
  if(username === 'admin') {
    res.send({code:1,msg:'此用户已存在'})
  }else {
    res.send({code: 0,data: {id:'abc1234',username,password}})
  }
});

module.exports = router;
