var express = require('express');
var router = express.Router();
var config = require('../config/fileman');

router.use('/', function(req, res, next) {
  if (req.session == null || req.session == undefined) {
    res.status(403).send('You are not allowed to access Cover Fileman');
  } else {
    next()
  }
});

router.get('/', function (req, res) {
    res.json(config);
});

module.exports = router;