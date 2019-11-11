const express = require('express');
const router = express.Router();
const config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  const fullUrl = encodeURI(req.protocol + '://' + req.get('host') + req.originalUrl);
  const options = {
    loginURL: req.app.locals.config.COVER_LOGIN_URL + '&referrer=' + fullUrl,
    logoutURL: req.app.locals.config.COVER_LOGOUT_URL + '&referrer=' + fullUrl
  }
  if (res.locals.session) {
    res.render('index', options);
  } else {
    res.render('login', options);
  }
});

router.get('/fileman', function(req, res, next) {
  console.log(res.locals.session);
  if (!res.locals.session || Array.isArray(res.locals.session.user.committees) || res.locals.session.user.committees.length == 0) {
    res.status(403).send('You are not a member of a committee therefore you have no access Cover Fileman');
  } else {
    res.render('fileman');
  }
});

module.exports = router;
