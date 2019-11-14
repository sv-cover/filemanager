const config = require('../config/');
const coverAPI = require('./coverapi');

/* 
Hastily made middleware function to connect with the cover api.
The results are stored in the req.session object.

*/
const coverapi = function (req, res, next) {
    const fullUrl = encodeURI(req.protocol + '://' + req.get('host') + req.originalUrl);
    req.session = null;
    res.locals.loggedin = false;
    res.locals.loginURL = config.COVER_LOGIN_URL + '&referrer=' + fullUrl;
    res.locals.logoutURL = config.COVER_LOGOUT_URL + '&referrer=' + fullUrl;
    
    if (config.COVER_COOKIE in req.cookies) {
        coverAPI(req.cookies[config.COVER_COOKIE]).then(function(repos) {
            req.session = repos;
            res.locals.loggedin = true;
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