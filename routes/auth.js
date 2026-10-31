const express = require('express');
const { load, save } = require('../db');
const router = express.Router();

// 회원가입 화면
router.get('/signup', (req, res) => {
  res.render('auth/signup', { error: '' });
});

// 회원가입 처리
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const data = load();

  if (!username || !password) {
    return res.render('auth/signup', { error: '아이디와 비밀번호를 입력하세요' });
  }
  if (data.users.find(u => u.username === username)) {
    return res.render('auth/signup', { error: '이미 있는 아이디입니다' });
  }

  data.users.push({ username, password });
  save(data);
  res.redirect('/login');
});

// 로그인 화면
router.get('/login', (req, res) => {
  res.render('auth/login', { error: '' });
});

// 로그인 처리
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = load().users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.render('auth/login', { error: '아이디 또는 비밀번호가 틀렸습니다' });
  }

  req.session.user = { username: user.username };
  res.redirect('/');
});

// 로그아웃
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;