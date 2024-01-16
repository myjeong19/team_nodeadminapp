const express = require('express');
const router = express.Router();
const db = require('../models/index');

const bcrypt = require('bcryptjs');

const AES = require("mysql-aes");



router.get('/list', async (req, res) => {
  const admins = await db.Admin.findAll({
    attributes: [
      'admin_member_id',
      'company_code',
      'admin_id',
      'admin_name',
      'email',
      'admin_password',
      'telephone',
      'used_yn_code',
      'reg_user_id',
      'reg_date',
      'edit_user_id',
      'edit_date',
    ],
  });

  res.render('admin/list', { admins });
});

router.post('/list', async (req, res) => {
  const { admin_name, admin_id, used_yn_code } = req.body;

  const searchOption = {
    admin_name,
    admin_id,
    used_yn_code,
  };

  try {
    if (admin_name) {
      const admins = await db.Admin.findAll({
        where: { admin_name: searchOption.admin_name },
      });
      res.render('admin/list', { admins });
    }

    if (admin_id) {
      const admins = await db.Admin.findAll({
        where: { admin_id: searchOption.admin_id },
      });
      res.render('admin/list', { admins });
    }

    if (used_yn_code) {
      const admins = await db.Admin.findAll({
        where: { used_yn_code: searchOption.used_yn_code },
      });
      res.render('admin/list', { admins });
    }
  } catch (error) {}
});

router.get('/create', async (req, res) => {
  res.render('admin/create');
});

router.post('/create', async (req, res) => {
  const {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    used_yn_code,
    reg_user_id,
    reg_date,
  } = req.body;

  var encryptedPassword = await bcrypt.hash(admin_password,12);

  var encryptedTelephone = AES.encrypt(telephone, process.env.MYSQL_AES_KEY);

  const newAdmin = {
    company_code,
    admin_id,
    admin_password:encryptedPassword,
    admin_name,
    email,
    telephone:encryptedTelephone,
    used_yn_code,
    reg_user_id,
    reg_date,
    edit_user_id: null,
    edit_date: null,
  };

  await db.Admin.create(newAdmin);

  res.redirect('list');
});

router.get('/delete', async (req, res) => {
  res.render('admin/delete');
});

router.get('/modify/:id', async (req, res) => {
  const adminIndex = req.params.id;

  const admin = await db.Admin.findOne({
    where: { admin_member_id: adminIndex },
  });

  admin.telephone = AES.decrypt(admin.telephone, process.env.MYSQL_AES_KEY);

  res.render('admin/modify', { admin });
});

router.post('/modify/:id', async (req, res) => {
  const adminIndex = req.params.id;
  const {
    admin_member_id,
    company_code,
    admin_id,
    used_yn_code,
    admin_name,
    telephone,
    reg_user_id,
    reg_date,
    edit_user_id,
    edit_date,
    action,
  } = req.body;

  if (action === 'save') {
    const updateAdmin = {
      admin_member_id,
      company_code,
      admin_id,
      used_yn_code,
      admin_name,
      telephone,
      reg_user_id,
      reg_date,
      edit_user_id,
      edit_date,
    };

    await db.Admin.update(updateAdmin, {
      where: { admin_member_id: adminIndex },
    });
  } else {
    await db.Admin.destroy({ where: { admin_member_id: adminIndex } });
  }

  res.redirect('/admin/list');
});

module.exports = router;
