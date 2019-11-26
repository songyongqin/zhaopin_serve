const {ChatModel} = require('../db/models')
module.exports = function (server) {
  // 得到 IO 对象
  const io = require('socket.io')(server)
  // 监视连接(当有一个客户连接上时回调) 
  io.on('connection', socket => {
    socket.on('sendMsg', ({from, to , content}) => {
      const chat_id = [from, to].sort().join('_')
      const create_time = new Date().getTime()
      new ChatModel({from, to, content, chat_id, create_time}).save((err,chatMsgs) => {
        io.emit('receiveMsg', chatMsgs)
        console.log('服务器发送消息' + chatMsgs)
      })
    })
  })
}