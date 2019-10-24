const crypto = require('crypto');
const rp = require('request-promise-native');
const config = require('../config/');
const querystring = require('querystring');
const dns = require('dns');

app = config.COVER_API_APP;
secret = config.COVER_API_SECRET;
url = config.COVER_API_URL;

function getCoverSession(sessionID) {
    return new Promise(function(resolve, reject) {
        const sha1 = crypto.createHash('sha1');
        let session_id = sessionID;
        let params = {
            method: 'session_get_member',
            session_id: session_id
        };
        checksum = sha1.update(secret).digest('hex');
        options = {
            url: url + '?' + querystring.stringify(params),
            headers: {
                'X-App': app,
                'X-Hash': checksum
            },
            json: true
        };
        rp(options).then(function (repos) {
            if (repos.succes == false) {
                reject(repos);
            } else {
                resolve({
                    sessionID: sessionID,
                    user: repos.result
                });
            }
        }).catch(function (err) {
            reject(err);
        })
    });
}

module.exports = getCoverSession;