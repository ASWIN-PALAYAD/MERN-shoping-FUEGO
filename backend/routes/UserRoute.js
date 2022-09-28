const express = require('express');
const { createUser, loginUser } = require('../controller/UserController');
const router = express.Router();

router.route('/registration').post(createUser);
router.route('/login').post(loginUser)

module.exports = router;