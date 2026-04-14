const express = require('express');
const currentUser = require('../controllers/currentUser');
const { ensureAuthenticated } = require('../middlewares/ensureAuthenticated');

const router = express.Router();

router.get('/current-user', ensureAuthenticated, currentUser.currentUser);

module.exports = router;