const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    ip : String,
    userAgentHash : {type:String,unique:true},
    createdAt : {
        type : Date,
        default : Date.now
    },
});

schema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model('Visitor',schema);