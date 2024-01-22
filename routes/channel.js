//관리자 사이트 채팅방 정보처리 라우팅
//http://localhost:3001/channel
var express = require('express');
var router = express.Router();
const db = require('../models/index');
var moment = require('moment');
const handleResultMessage = (result, data, state) => {
  const resultMessage = {
    result,
    data,
    state,
  };
};

router.get('/list', async (req, res) => {
  const channel_list = await db.Channel.findAll({
    attributes: [
      'channel_id',
      'comunity_id',
      'category_code',
      'channel_name',
      'user_limit',
      'channel_img_path',
      'channel_desc',
      'channel_state_code',
      'reg_date',
      'reg_member_id',
      'edit_date',
      'edit_member_id',
    ],
  });

  res.render('channel/list', { channel_list, moment });
});

//localhost:3001/channel/create
router.get('/create', async (req, res) => {
  const date = new Date();
  const getYear = date.getFullYear();
  const getMonth = date.getMonth() + 1;
  const getDate = date.getDate();

  const today = `${getYear}-${getMonth}-${getDate}`;

  res.render('channel/create', { today });
});

//localhost:3001/channel/create
router.post('/create', async (req, res) => {
  const {
    comunity_id,
    category_code,
    channel_name,
    user_limit,
    channel_img_path,
    channel_state_code,
    channel_desc,
    reg_date,
    reg_member_id,
  } = req.body;

  const newChannel = {
    comunity_id,
    category_code,
    channel_name,
    user_limit,
    channel_img_path,
    channel_state_code,
    channel_desc,
    reg_date: Date.now(),
    reg_member_id,
    edit_date: null,
    edit_member_id: null,
  };

  await db.Channel.create(newChannel);

  res.redirect('/channel/list');
});

//localhost:3001/channel/modify
router.get('/modify/:id', async (req, res) => {
  const channelIndex = req.params.id;

  const channel = await db.Channel.findOne({
    where: { channel_id: channelIndex },
  });

  res.render('channel/modify', { channel, moment });
});

//localhost:3001/channel/modify
router.post('/modify/:id', async (req, res) => {
  const channelIndex = req.params.id;

  const {
    comunity_id,
    category_code,
    channel_name,
    user_limit,
    channel_img_path,
    channel_state_code,
    channel_desc,
    reg_date,
    reg_member_id,
    edit_member_id,
    edit_date,
    action,
  } = req.body;

  try {
    const updateChannel = {
      comunity_id,
      category_code,
      channel_name,
      user_limit,
      channel_img_path,
      channel_state_code,
      channel_desc,
      reg_date,
      reg_member_id,
      edit_member_id,
      edit_date,
    };

    await db.Channel.update(updateChannel, {
      where: { channel_id: channelIndex },
    });
  } catch (error) {
    console.log(error);
  }

  res.redirect('/channel/list');
});

router.get('/delete', async (req, res, next) => {
  var channel_id = req.query.channel_id;
  await db.Channel.destroy({ where: { channel_id: channel_id } });
  res.redirect('/channel/list');
});

module.exports = router;
