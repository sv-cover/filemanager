const devnull = require('dev-null');
const fs = require('fs-extra');
const path = require('path');
const gm = require('gm');
const config = require('../config');

let utils = {};

utils.unless = function(middleware, ...paths) {
  return function(req, res, next) {
    const pathCheck = paths.some(path => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};

utils.isCommitteeMember = function(session) {
  return session && !Array.isArray(session.user.committees) && Object.entries(session.user.committees).length;
}

utils.isAdmin = function(session) {
  let email = session.user.email;
  let committees = session.user.committees;

  if (config.ADMINS.indexOf(email) != -1) {
    return true;
  }
  for (let committee in committees) {
    if (config.ADMIN_COMMITTEES.indexOf(committee) != -1) {
      return true;
    }
  }

  return false;
};

utils.fileFolderAccess = function(session, p) {
  let filesRoot = config.UPLOADS_FOLDER;
  let committees = session.user.committees;
  let commiteePath = '';
  let response = false;
  if(p) {
    if(this.isAdmin(session)) {
      response = true;
    } else {
      for (committeeID in committees) {
        commiteePath = path.join(filesRoot, committeeID);
        if (p.startsWith(commiteePath)) {
          response = true;
        }
      }
    }
  }
  return response;
};

utils.checkIfFileExists = function(res, f) {
  fs.access(f, fs.constants.F_OK)
  .then(function() { return })
  .catch(function(err) {
    console.log('File does not exist: ' + f);
    res.status(404).send('File does not exist.').end();
  });
};

utils.imageOpen = function(p) {
  return new Promise((resolve, reject) => {
    try {
      let image = gm(p);
      image.identify(function(err, value) {
        if (err) {
          reject(err);
        } else {
          resolve(image);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

utils.imageSend = function(res, image) {
  res.setHeader('content-type', 'image/' + image.format().data.format);
  var stream = image.stream();
  stream.pipe(res);
};

module.exports = utils;