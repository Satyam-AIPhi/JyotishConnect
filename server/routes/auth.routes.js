const express = require('express');
const { google, signOut, login, signup, astrologerSignup } = require('../controllers/auth.controller.js');

const router = express.Router();

router.post("/signup", signup);
router.post("/signup/astrologer", astrologerSignup); 
router.post("/login", login);
router.post('/google', google);
router.get('/signout', signOut)

module.exports = router;