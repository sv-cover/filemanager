const config = require('../config/');
const coverAPI = require('./coverapi');

const coverapi = function (req, res, next) {
    req.session = null;
    
    if (config.COVER_COOKIE in req.cookies) {
        coverAPI(req.cookies[config.COVER_COOKIE]).then(function(repos) {
            req.session = repos;
            next();
        }).catch(function(err) {
            console.log(err);
            res.status(403).send('Something went wrong with the CoverAPI');
        });
    } else {
        next();
    }
}

module.exports = coverapi;