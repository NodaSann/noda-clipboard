const mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({
    boardId: { 
        type: String, 
        required: true 
    }, // 所属剪切板
    message: {
        type:String,
        required:true
    },
    date: {
        type:String,
        required:true
    },
    //排序用的时间
    sortime:Date,
    expireAt: Date // 过期时间
});
let messageModel = mongoose.model('messages', messageSchema);


module.exports = messageModel;