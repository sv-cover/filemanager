const express = require('express');
const router = express.Router();
const config = require('../config/fileman');

router.get('/', function (req, res) {
    res.json(config);
});

module.exports = router;