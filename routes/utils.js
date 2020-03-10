const fs = require('fs-extra');
const path = require('path');
const gm = require('gm');
const config = require('../config');

let utils = {};

// Calls the middleware function unless the path is in the paths argument.
utils.unless = function(middleware, ...paths) {
  return function(req, res, next) {
    const pathCheck = paths.some(path => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};

// Checks if cover member in session is a committee member
utils.isCommitteeMember = function(session) {
  return session && !Array.isArray(session.user.committees) && Object.entries(session.user.committees).length;
}

// Checks if the cover member in session is an admin. Admins are defined in the config file.
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

// Checks if the cover member in session has access to the path p.
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

module.exports = utils;