const express = require('express');
const { load, save } = require('../db');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

// 글 목록  → /posts
router.get('/', (req, res) => {
  const posts = load().posts;
  res.render('posts/list', { posts, user: req.session.user });
});

// 글 작성 화면  → /posts/new
router.get('/new', requireLogin, (req, res) => {
  res.render('posts/new');
});

// 글 작성 처리  → /posts
router.post('/', requireLogin, (req, res) => {
  const { title, content } = req.body;
  const data = load();

  data.posts.push({
    id: Date.now(),
    title,
    content,
    author: req.session.user.username,
  });
  save(data);
  res.redirect('/posts');
});

// 글 상세  → /posts/:id
router.get('/:id', (req, res) => {
  const post = load().posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.send('없는 글입니다');

  res.render('posts/detail', { post, user: req.session.user });
});

// 글 수정 화면  → /posts/:id/edit
router.get('/:id/edit', requireLogin, (req, res) => {
  const post = load().posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.send('없는 글입니다');
  if (post.author !== req.session.user.username) return res.send('본인 글만 수정할 수 있습니다');

  res.render('posts/edit', { post });
});

// 글 수정 처리
router.post('/:id/edit', requireLogin, (req, res) => {
  const data = load();
  const post = data.posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.send('없는 글입니다');
  if (post.author !== req.session.user.username) return res.send('본인 글만 수정할 수 있습니다');

  post.title = req.body.title;
  post.content = req.body.content;
  save(data);
  res.redirect('/posts/' + post.id);
});

// 글 삭제
router.post('/:id/delete', requireLogin, (req, res) => {
  const data = load();
  const post = data.posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.send('없는 글입니다');
  if (post.author !== req.session.user.username) return res.send('본인 글만 삭제할 수 있습니다');

  data.posts = data.posts.filter(p => p.id !== post.id);
  save(data);
  res.redirect('/posts');
});

module.exports = router;