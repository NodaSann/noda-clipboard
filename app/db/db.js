module.exports = function(success, err) {
    // 如果没有传入失败的函数
    if(!err){
        err=function(){
            console.log('连接失败');
        }
    }


    // 导包
    const mongoose = require('mongoose')
    // 导入连接配置  ||  直接使用解构赋值
    const {ip,port,path} = require('./config.js')
    // 连接mongodb服务  
    mongoose.connect(`mongodb://${ip}:${port}/${path}`);
    // 设置回调
    mongoose.connection.on('open', () => {
        success();
    })
    mongoose.connection.on('error', () => {
        err();
    })
    mongoose.connection.on('close', () => {
        console.log('连接关闭');
    })

}
