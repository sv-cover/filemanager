const express = require('express');
const router = express.Router();
const utils = require('./utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session) {
    res.render('index');
  } else {
    res.render('login');
  }
});

router.get('/fileman', function(req, res, next) {
  if (utils.isCommitteeMember) {
    res.render('fileman');
  } else {
    res.status(403).send('You are not a member of a committee therefore you have no access Cover Fileman');
  }
});

module.exports = router;
