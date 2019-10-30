const path = require('path');
const exec = require('child_process').exec;
const config = require('../config');

const utils = {};

utils.hasGraphicsMagick = function(req, res, next) {
  exec("gm -help", function (err) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'GraphicsMagick is not installed' })
    } else {
      next();
    }
  });
};

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
    res.status(403).send('You are not allowed to access this file/folder.');
  }
};

module.exports = utils;