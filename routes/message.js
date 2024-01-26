var express = require("express");
var router = express.Router();
var db = require("../models/index");
var Op = db.Sequelize.Op;
var moment = require('moment');

//더미데이터 삭제처리했습니다.

router.get("/list", async (req, res, next) => {
  var searchOption = {
    nick_name: "",
    msg_state_code: "",
    channel_id: "",
  };

  var messages = await db.Messages.findAll({
    attribute: [
      "channel_id",
      "member_id",
      "nick_name",
      "msg_type_code",
      "connection_id",
      "message",
      "ip_address",
      "top_channel_msg_id",
      "msg_state_code",
      "msg_date",
      "edit_date",
      "del_date",
    ],
  });
  messages = messages.map((arr) => {
    return arr.dataValues;
  });
  
  res.render("message/list", { messages, searchOption, moment });
});

router.post("/list", async (req, res, next) => {
  var searchOption = {
    nick_name: req.body.nick_name,
    msg_state_code: Number(req.body.msg_state_code),
    channel_id: req.body.channel_id && Number(req.body.channel_id),
  };

  var messages = await db.Messages.findAll({
    where: {
      [Op.and]: [
        // 다른 조건을 추가할 때 빈 문자열이 아닌 경우에만 추가
        searchOption.channel_id !== "" && {
          channel_id: searchOption.channel_id,
        },
        searchOption.nick_name !== "" && { nick_name: searchOption.nick_name },
        searchOption.msg_state_code !== 9 &&
          searchOption.msg_state_code !== "" && {
            msg_state_code: searchOption.msg_state_code,
          },
      ],
    },
  });
  messages = messages.map((arr) => {
    return arr.dataValues;
  });
  console.log("searchOption : ", searchOption);
  res.render("message/list", { messages, searchOption, moment });
});

router.get("/create", async (req, res, next) => {
  res.render("message/create");
});

router.post("/create", async (req, res, next) => {
  var message = {
    channel_id: req.body.channel_id,
    member_id: req.body.member_id,
    nick_name: req.body.nick_name,
    msg_type_code: req.body.msg_type_code,
    connection_id: req.body.connection_id,
    message: req.body.message,
    ip_address: req.body.ip_address,
    top_channel_msg_id: req.body.top_channel_msg_id,
    msg_state_code: req.body.msg_state_code,
    msg_date: Date.now(),
    edit_date: Date.now(),
    del_date: Date.now(),
  };
  await db.Messages.create(message);
  console.log("message : ", message);
  res.redirect("/message/list");
});

router.get("/modify/:channel_msg_id", async (req, res, next) => {
  //선택한 게시글 고유번호를 파라메터 방식으로 URL을 통해 전달받음.
  var channel_msg_id = req.params.channel_msg_id;
  const message = await db.Messages.findOne({
    where: { channel_msg_id: channel_msg_id },
  });
  res.render("message/modify", { message });
});

router.post("/modify/:channel_msg_id", async (req, res, next) => {
  var channel_msg_id = req.params.channel_msg_id;
  console.log("channel_msg_id :", channel_msg_id);
  var message = await db.Messages.findOne({
    where: { channel_msg_id: channel_msg_id },
  });
  message = message.dataValues;
  console.log("req.body.channel_id :", req.body.channel_id);
  message.channel_id = Number(req.body.channel_id);
  message.nick_name = req.body.nick_name;
  message.msg_state_code = req.body.msg_state_code;
  message.message = req.body.message;
  message.edit_date = Date.now();

  var result = await db.Messages.update(message, {
    where: { channel_msg_id: message.channel_msg_id },
  });
  console.log(`result ${result}`);
  res.redirect("/message/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/message/list");
});

module.exports = router;
