//관리자 사이트 채팅방 정보처리 라우팅
//http://localhost:3001/channel
var express = require('express');
var router = express.Router();

router.get('/list', async (req, res) => {
  var channel_list = [
    {
      channel_id: 1,
      community_id: 1,
      category_code: 1,
      channel_name: '채팅채널1',
      user_limit: 100,
      channel_img_path: '',
      channel_desc: '',
      channel_state_code: 1,
      reg_date: Date.now(),
      reg_member_id: 'yujin___',
      edit_date: Date.now(),
      edit_member_id: 'yujin___',
    },
    {
      channel_id: 2,
      community_id: 10,
      category_code: 1,
      channel_name: '채팅채널2',
      user_limit: 100,
      channel_img_path: '',
      channel_desc: '',
      channel_state_code: 1,
      reg_date: Date.now(),
      reg_member_id: 'yujin1___',
      edit_date: Date.now(),
      edit_member_id: 'yujin1___',
    },
    {
      channel_id: 3,
      community_id: 1,
      category_code: 2,
      channel_name: '채팅채널1',
      user_limit: 100,
      channel_img_path: '',
      channel_desc: '',
      channel_state_code: 0,
      reg_date: Date.now(),
      reg_member_id: 'yujin2___',
      edit_date: Date.now(),
      edit_member_id: 'yujin2___',
    },
  ];
  res.render('channel/list', { channel_list });
});

//localhost:3001/channel/create
router.get('/create', async (req, res) => {
  res.render('channel/create');
});

//localhost:3001/channel/create
router.post('/create', async (req, res) => {
  var channel_id = req.body.channel_id;
  var community_id = req.body.community_id;
  var category_code = req.body.category_code;
  var channel_name = req.body.channel_name;
  var user_limit = req.body.user_limit;
  var channel_img_path = req.body.channel_img_path;
  var channel_desc = req.body.channel_desc;
  var channel_state_code = req.body.channel_state_code;

  //DB에 저장할 데이터
  // var channel = {
  //   channel_id,
  //   community_id,
  //   category_code,
  //   channel_name,
  //   user_limit,
  //   channel_img_path,
  //   channel_desc,
  //   channel_state_code,
  //   reg_date:Date.now(),
  //   reg_member_id:"",
  //   edit_date:Date.now(),
  //   edit_member_id:""
  // }

  var channel = {
    channel_id: 1,
    community_id: 1,
    category_code: 1,
    channel_name: '채팅채널1',
    user_limit: 100,
    channel_img_path: '',
    channel_desc: '',
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 'yujin___',
    edit_date: Date.now(),
    edit_member_id: 'yujin___',
  };

  res.redirect('/channel/list');
});

//localhost:3001/channel/modify
router.get('/modify/:cid', async (req, res) => {
  //임시로 전달할 예제 객체
  var channel = {
    channel_id: 1,
    community_id: 1,
    category_code: 1,
    channel_name: '채팅채널1',
    user_limit: 100,
    channel_img_path: '',
    channel_desc: '',
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 'yujin___',
    edit_date: Date.now(),
    edit_member_id: 'yujin___',
  };

  res.render('channel/modify', { channel });
});

//localhost:3001/channel/modify
router.post('/modify/:cid', async (req, res) => {
  var channel_id = req.body.channel_id;
  var community_id = req.body.community_id;
  var category_code = req.body.category_code;
  var channel_name = req.body.channel_name;
  var user_limit = req.body.user_limit;
  var channel_img_path = req.body.channel_img_path;
  var channel_desc = req.body.channel_desc;
  var channel_state_code = req.body.channel_state_code;

  //DB에 저장할 데이터
  // var channel = {
  //   channel_id,
  //   community_id,
  //   category_code,
  //   channel_name,
  //   user_limit,
  //   channel_img_path,
  //   channel_desc,
  //   channel_state_code,
  //   reg_date:Date.now(),
  //   reg_member_id:"",
  //   edit_date:Date.now(),
  //   edit_member_id:""
  // }

  var channel = {
    channel_id: 1,
    community_id: 1,
    category_code: 1,
    channel_name: '채팅채널1',
    user_limit: 100,
    channel_img_path: '',
    channel_desc: '채팅채널1입니다',
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 'yujin___',
    edit_date: Date.now(),
    edit_member_id: 'yujin___',
  };

  res.redirect('/channel/list');
});

router.get('/delete', async (req, res) => {
  res.render('channel/delete');
});

module.exports = router;
