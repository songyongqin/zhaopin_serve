//加密
const md5 = require('blueimp-md5')

//1连接数据库
//1.1引入mongoose
const mongoose = require('mongoose')
//1.2 连接指定数据库
mongoose.connect('mongodb://localhost:27017/zhipin_test')
//1.3获取连接对象
const conn = mongoose.connection
//1.4绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log('数据库连接成功')
})
//2得到特定集合的model
//2.1定义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type:String, required: true},
    password: {type:String, required: true},
    type: {type:String, required: true},
    head: {type:String}
})
//2.2定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user',userSchema) //集合的名字为users
//3通过Model 或其实例对集合数据进行CRUD操作
//3.1通过Model实例的save()添加数据
function testSave(){
    const userModel = new UserModel({username:'Tom',password:md5('234'),type:'dashen'})
    //调用save()保存
    userModel.save(function(error,user){
        console.log(error)
        console.log(user)
    })
}
// testSave()
//3.2通过Model的find()/findOne（）查询多个或一个数据
function testFind() {
    UserModel.find((error,users)=>{
        console.log('testFind()',error,users)
    })
}
// testFind()
function testFindOne() {
    UserModel.findOne({username:'Bob'},(error,users)=>{
        console.log('testFind()',error,users)
    })
}
// testFindOne()
//3.3通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id:'5dbabd07c471ac27101a2ae0'},{username:'TomUpdate'},(error,oldUser)=>{
        console.log('testUpdate()',error,oldUser)
    })
}
// testUpdate()
//3.4通过Model的remove()删除匹配的数据
function testDelete() {
    UserModel.remove({_id:'5dbbca3a2aca401d50e6ce1c'},(error,doc) => {
        console.log('remove',error,doc)
    })
}
testDelete()