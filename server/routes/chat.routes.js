const express = require('express');
const {
  getUserChats,
  getChatMessages,
  initChat,  
} = require('../controllers/chat.controller');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.get('/list', verifyToken, getUserChats);
router.get('/:chatId', verifyToken, getChatMessages);

router.post('/init', verifyToken, initChat);

module.exports = router;
