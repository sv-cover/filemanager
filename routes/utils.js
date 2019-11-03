const fs = require('fs-extra');
const path = require('path');
const gm = require('gm');
const config = require('../config');

const utils = {};

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

utils.fileFolderAccessControl = function(res, session, p) {
  console.log(p);
  let filesRoot = config.UPLOADS_FOLDER;
  let committees = session.user.committees;
  let commiteePath = '';
  let response = false;
  if (this.isAdmin(session)) {
    response = true;
  } else {
    for (committeeID in committees) {
      commiteePath = path.join(filesRoot, committeeID);
      if (p.startsWith(commiteePath)) {
        response = true;
      }
    }
  }
  if (!response) {
    res.status(403).send('You are not allowed to access this file/folder.').end();
  }
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
  console.log(p);
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
  res.setHeader("content-type", "image/png");
  image.stream('png').pipe(res);
};

module.exports = utils;