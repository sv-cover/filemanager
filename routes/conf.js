var express = require('express');
var router = express.Router();
var config = require('../config/fileman');

router.get('/', function (req, res) {
    res.json(config);
});

module.exports = router;