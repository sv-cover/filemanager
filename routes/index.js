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

router.get('/fileman', function(req, res, next) {
  if (req.session === undefined || req.session === null || Array.isArray(req.session.user.committees) || req.session.user.committees.length == 0) {
    res.status(403).send('You are not a member of a committee therefore you have no access Cover Fileman');
  } else {
    res.render('fileman', { title: 'Cover File Manager' });
  }
});

module.exports = router;
