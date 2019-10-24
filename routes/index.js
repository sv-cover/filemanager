const express = require('express');
const router = express.Router();
const config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  const loggedin = req.session == null ? false : true;
  const fullUrl = encodeURI(req.protocol + '://' + req.get('host') + req.originalUrl);
  if (loggedin) {
    res.render('index', { 
      title: 'Cover Fileman',
      loggedin: loggedin,
      loginURL: config.COVER_LOGIN_URL + '&referrer=' + fullUrl,
      logoutURL: config.COVER_LOGOUT_URL + '&referrer=' + fullUrl
    });
  } else {
    res.render('login', { 
      title: 'Cover Fileman',
      loggedin: loggedin,
      loginURL: config.COVER_LOGIN_URL + '&referrer=' + fullUrl,
      logoutURL: config.COVER_LOGOUT_URL + '&referrer=' + fullUrl
    });
  }
});

module.exports = router;
