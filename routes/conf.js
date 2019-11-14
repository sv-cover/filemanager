var express = require('express');
var router = express.Router();
var config = require('../config/fileman');

// Returns config/fileman.js as a json file.
router.get('/', function (req, res) {
    res.json(config);
});

module.exports = router;