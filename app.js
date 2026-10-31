const express = require('express');
const session = require('express-session');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

const app = express();

// --- 미들웨어 ---
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

// --- 라우터 연결 ---
app.get('/', (req, res) => {
  res.render('main', { user: req.session.user });
});
app.use('/', authRouter);        // /signup, /login, /logout
app.use('/posts', postsRouter);  // /posts로 시작하는 주소 전부

app.listen(3000, () => {
  console.log('서버 실행: http://localhost:3000');
});