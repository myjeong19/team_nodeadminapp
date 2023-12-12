var express = require('express');
var router = express.Router();




router.get('/list',async(req,res)=>{
    res.render('message/list');
});


router.get('/create',async(req,res)=>{
    res.render('message/create');
});


router.post('/create',async(req,res) => {
    res.redirect('/message/list');
});


router.get('/modify', async (req,res) => {
    res.render('message/modify');
});


router.post('/modify', async (req,res) => {
    res.redirect('/message/list');
});


router.get('/delete', async (req,res) => {
    res.render('message/list');
});


module.exports = router;