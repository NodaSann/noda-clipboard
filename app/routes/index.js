var express = require('express');
var router = express.Router();
//mongoose
const mongoose = require('mongoose')
//模板
const messageModel = require('../document/message')
//剪切板模型
const boardModel = require('../document/board'); // 新建board模型
//时间格式化
const moment = require('moment')
const session = require('express-session');
const bcrypt = require('bcrypt');
router.use(session({
  secret: 'noda-clipboard-secret',
  resave: false,
  saveUninitialized: true
}));

/* GET home page. */
router.get('/', function (req, res, next) {
  messageModel.find().sort({ 'sortime': -1 }).exec()
    .then(data => {
      let num = data.length
      let time = '还未发送过'
      if (!num == 0) {
        time = data[0].date;
      }
      res.render('home', { time, num })
    })
});
// 工具函数：更新剪切板访问时间
async function updateBoardAccess(boardId) {
  await boardModel.updateOne({ boardId }, { $set: { lastAccess: new Date() } });
}
//访问剪切板主页，输入boardId和密码
router.get('/clipboard/:boardId', async function (req, res, next) {
  const { boardId } = req.params;
  const { password } = req.query;
  const board = await boardModel.findOne({ boardId });
  if (!board) {
    res.status(404).send('剪切板不存在');
    return;
  }
  await updateBoardAccess(boardId); // 更新访问时间

  // 如果带有密码参数且正确（或无密码），自动登录
  if (
    (typeof board.password === 'string' && board.password.length === 0 && (password === undefined || password === '')) ||
    (password && board.password && await bcrypt.compare(password, board.password))
  ) {
    req.session[`auth_${boardId}`] = true;
    res.redirect(`/clipboard/${boardId}/message`);
    return;
  }
  // 检查session是否已通过密码验证
  if (req.session[`auth_${boardId}`]) {
    res.redirect(`/clipboard/${boardId}/message`);
    return;
  }
  res.render('board_login', { boardId });
});
//剪切板密码校验
router.post('/clipboard/:boardId/login', async function (req, res, next) {
  const { boardId } = req.params;
  const { password } = req.body;
  const board = await boardModel.findOne({ boardId });
  if (!board) {
    res.status(404).send('剪切板不存在');
    return;
  }
  // 密码为空或校验通过
  if ((typeof board.password === 'string' && board.password.length === 0 && (password === undefined || password === '')) ||
      (password && board.password && await bcrypt.compare(password, board.password))) {
    req.session[`auth_${boardId}`] = true;
    await updateBoardAccess(boardId); // 更新访问时间
    res.redirect(`/clipboard/${boardId}/message`);
  } else {
    res.render('board_login', { boardId, error: '密码错误' });
  }
});
//GET LIST
router.get('/clipboard/:boardId/message', async function (req, res, next) {
  const { boardId } = req.params;
  await updateBoardAccess(boardId); // 更新访问时间
  if (!req.session[`auth_${boardId}`]) {
    res.redirect(`/clipboard/${boardId}`);
    return;
  }
  // 清理过期内容
  await messageModel.deleteMany({ boardId, expireAt: { $lte: new Date() } });
  const data = await messageModel.find({ boardId }).sort({ 'sortime': -1 }).limit(10);
  // 生成带密码的分享链接
  const board = await boardModel.findOne({ boardId });
  const shareUrl = board
    ? `${req.protocol}://${req.get('host')}/clipboard/${boardId}?password=${encodeURIComponent(board.password)}`
    : `${req.protocol}://${req.get('host')}/clipboard/${boardId}`;
  if (data.length === 0) {
    //api
    // res.status(400).json({
    //   code: 4001,
    //   msg: '查询失败'
    // });
    const cuteEmoticonsMatrix =
      ["(◕‿◕)", "(◠‿◠)", "(◡‿◡)",
        "(◕ᴗ◕)", "(◉‿◉)", "(◕ᴥ◕)",
        "(´• ω •`)", "(´｡• ω •｡`)", "(´｡• ᵕ •｡`)",
        "(´• ᴗ •`)"]
    var emoji = cuteEmoticonsMatrix[Math.floor(Math.random() * 10)];
    data.push({ message: "暂时还没有消息", date: emoji, id: 313 })
    res.render('list.ejs', { data, boardId, shareUrl })
    return;
  }
  // res.send(data);
  //\n 转换为 br
  for (let i = 0; i < data.length; i++) {
    data[i].message = data[i].message.replace(/\n/g, '<br>')
  }
  res.render('list.ejs', { data, boardId, shareUrl })
});
//ADD MESSAGE
router.post('/clipboard/:boardId/message', async (req, res) => {
  const { boardId } = req.params;
  await updateBoardAccess(boardId); // 更新访问时间
  if (!req.session[`auth_${boardId}`]) {
    res.redirect(`/clipboard/${boardId}`);
    return;
  }
  const { message, expireMinutes } = req.body;
  const sortime = new Date();
  const time = moment(sortime).locale('zh-cn').format('lll');
  let expireAt = null;
  let expire = expireMinutes ? parseInt(expireMinutes) : 30; // 默认30分钟
  if (expire > 0) {
    expireAt = new Date(Date.now() + expire * 60000);
  }
  const saveMessage = new messageModel({ boardId, message, date: time, sortime, expireAt });
  await saveMessage.save();
  res.redirect(`/clipboard/${boardId}/message`);
})
//DEL MESSAGE
router.get('/clipboard/:boardId/del/:id', async (req, res) => {
  const { boardId, id } = req.params;
  await updateBoardAccess(boardId); // 更新访问时间
  if (!req.session[`auth_${boardId}`]) {
    res.redirect(`/clipboard/${boardId}`);
    return;
  }
  await messageModel.deleteOne({ _id: id, boardId });
  res.redirect(`/clipboard/${boardId}/message`);
})
// 新增：主页表单跳转路由，自动创建或跳转
router.post('/clipboard/go', async function(req, res, next) {
  const { boardId } = req.body;
  let password = req.body.password;
  if (typeof password !== 'string') password = '';
  let board = await boardModel.findOne({ boardId });
  if (!board) {
    // 新建剪切板，允许无密码
    let hash = '';
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }
    board = new boardModel({ boardId, password: hash });
    await board.save();
    await updateBoardAccess(boardId);
    req.session[`auth_${boardId}`] = true;
    res.redirect(`/clipboard/${boardId}/message`);
    return;
  }
  // 已存在的剪切板，必须校验密码
  if ((typeof board.password === 'string' && board.password.length === 0 && (password === undefined || password === '')) ||
      (password && board.password && await bcrypt.compare(password, board.password))) {
    await updateBoardAccess(boardId);
    req.session[`auth_${boardId}`] = true;
    res.redirect(`/clipboard/${boardId}/message`);
  } else {
    res.render('board_login', { boardId, error: '密码错误，无法进入已有剪切板' });
  }
});

// 定时清理无人访问的剪切板及其消息（如24小时无人访问自动删除）
const CLEAR_INTERVAL = 60 * 60 * 1000; // 每小时检查一次
const BOARD_EXPIRE_HOURS = 12; // 超过24小时无人访问即删除

setInterval(async () => {
  const expireDate = new Date(Date.now() - BOARD_EXPIRE_HOURS * 60 * 60 * 1000);
  // 找出过期的board
  const expiredBoards = await boardModel.find({ lastAccess: { $lt: expireDate } });
  for (const board of expiredBoards) {
    await messageModel.deleteMany({ boardId: board.boardId });
    await boardModel.deleteOne({ boardId: board.boardId });
  }
}, CLEAR_INTERVAL);

// AJAX接口：获取剪切板内容
router.get('/clipboard/:boardId/api/messages', async function (req, res, next) {
  const { boardId } = req.params;
  if (!req.session[`auth_${boardId}`]) {
    res.status(401).json({ error: '未授权' });
    return;
  }
  await updateBoardAccess(boardId);
  await messageModel.deleteMany({ boardId, expireAt: { $lte: new Date() } });
  const data = await messageModel.find({ boardId }).sort({ 'sortime': -1 }).limit(10);
  res.json(data);
});

module.exports = router;
