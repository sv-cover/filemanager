var express = require('express');
var router = express.Router();
var config = require('../config/fileman.js');

router.get('/', function (req, res) {
    console.log(config);
    res.json(config);
});

module.exports = router;