const express = require('express');
const router = express.Router();
const Visitor = require('../model/Visitor');
const crypto = require('crypto');

router.get('/track',async (req,res) =>{
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent']

    const hash = crypto.createHash('sha256').update(ip+userAgent).digest('hex');

    try{
        const visitor = await Visitor.findOne({userAgentHash : hash});

        if(!visitor){
            await Visitor.create({ip,userAgentHash:hash});
        }

        const total = await Visitor.countDocuments();
        return res.json({total})
    }catch(err){
        return res.status(500).json({error:'Internal Server error!'})
    }
})

module.exports = router;