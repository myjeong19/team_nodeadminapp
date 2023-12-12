var express = require('express');
var router = express.Router();




router.get('/',async(req,res)=>{

    var messages = [
        {
            channelNum:1,
            adminNum:1,
            nickName:'일돌이',
            logging:1,
            chatId:'one',
            message:'밥먹자',
            ipAddress:'111.111.111.111',
            topNum:1,
            statusMessage:1,
            saveDate:Date.now(),
            editDate:Date.now(),
            deleteDate:Date.now()
        },
        {
            channelNum:2,
            adminNum:2,
            nickName:'이돌이',
            logging:2,
            chatId:'two',
            message:'놀자',
            ipAddress:'222.111.111.111',
            topNum:2,
            statusMessage:2,
            saveDate:Date.now(),
            editDate:Date.now(),
            deleteDate:Date.now()
        },
        {
            channelNum:3,
            adminNum:3,
            nickName:'삼돌이',
            logging:3,
            chatId:'three',
            message:'심심해',
            ipAddress:'123.111.111.111',
            topNum:3,
            statusMessage:3,
            saveDate:Date.now(),
            editDate:Date.now(),
            deleteDate:Date.now()
        }
    ];


    res.render('message/list',{messages});
});


router.get('/create',async(req,res)=>{
    res.render('message/create');
});


router.post('/create',async(req,res) => {

    var chatId = req.body.chatId;
    var nickName = req.body.nickName;
    var message = req.body.message;

    var messageDB = {
        channelNum:0,
        adminNum:0,
        nickName,
        logging:0,
        chatId,
        message,
        ipAddress:'123.111.111.111',
        topNum:0,
        statusMessage:0,
        saveDate:Date.now(),
        editDate:Date.now(),
        deleteDate:Date.now()
    };

    res.redirect('/message');
});


router.get('/modify/:aid', async (req,res) => {

    var channelNum = req.params.aid;

    var messageDB = {
        channelNum,
        adminNum:1,
        nickName:'일돌이',
        logging:1,
        chatId:'one',
        message:'밥먹자',
        ipAddress:'111.111.111.111',
        topNum:1,
        statusMessage:1,
        saveDate:Date.now(),
        editDate:Date.now(),
        deleteDate:Date.now()
    };

    res.render('message/modify',{messageDB});
});


router.post('/modify/:aid', async (req,res) => {

    var channelNum = req.params.aid;

    var chatId = req.body.chatId;
    var nickName = req.body.nickName;
    var message = req.body.message;

    var messageDB = {
        channelNum,
        adminNum:0,
        nickName,
        logging:0,
        chatId,
        message,
        ipAddress:'123.111.111.111',
        topNum:0,
        statusMessage:0,
        saveDate:Date.now(),
        editDate:Date.now(),
        deleteDate:Date.now()
    };

    res.redirect('/message');
});


router.get('/delete', async (req,res) => {

    var channelNum =req.query.idx;

    res.redirect('/message');
});


module.exports = router;