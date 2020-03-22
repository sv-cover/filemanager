var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var path = require('path');
var sizeOf = require('image-size');
var multer  = require('multer');
var archiver = require('archiver');
const customDiskStorage = require('./diskStorage');
const config = require('../config');
const utils = require('./utils');

const serverRoot = path.join('.', config.SERVER_ROOT);

// A middleware function to check if the user is in a cover committee.
router.use('/', function(req, res, next) {
  if (utils.isCommitteeMember(req.session)) {
    next();
  } else {
    console.warn('ID' + req.session.id + 'tried to access the filemanager and has no access.');
    res.status(403).send('You are not allowed to access to the Cover Fileman API');
  }
});

// A middleware function that checks if you have access to the file or directory in the query.
function fDAccessControl(req, res, next) {
  if (!(req.query.f && req.query.d) && utils.fileFolderAccess(req.session, req.query.f || req.query.d) ) {
    next();
  } else {
    res.status(403).send('You are not allowed access to this file or folder');
  }
}

// A middleware function that checks if you have access to the new location in the query
function nAccessControl(req, res, next) {
  if (utils.fileFolderAccess(req.session, req.body.n) ) {
    next();
  } else {
    res.status(403).send('You are not allowed create files or folders in this folder');
  }
}

// Adds the fDAccessControl middleware to all routes in fileman.js except for dirlist and upload
//router.use('/', utils.unless(fDAccessControl, '/dirlist', '/upload'));

/* 
Return the directory tree.
For admins it returns the route.
For committee members only there committee folders.
*/
router.post('/dirlist', function(req, res) {
  let response = [];
  let filesRoot = config.UPLOADS_FOLDER;
  let committees = req.session.user.committees;

  if (utils.isAdmin(req.session)) {
    getDirectories(filesRoot, response);
  } else {
    for (committeeID in committees) {
      let responseTemp = [];
      
      getDirectories(path.join(filesRoot, committeeID), responseTemp);
      response = response.concat(responseTemp);
    }
  }

  res.send(response);
});

/* List files in a directory */
router.post('/fileslist', function(req, res) {
  var response = [];
  var pathDir = path.join(serverRoot, req.body.d);

  fs.readdirSync(pathDir).map(function(file) {
    var fileDir = path.join(pathDir, file);
    var info = fs.statSync(fileDir); 
    if(info.isFile()){
        var size = null;
        try { size = sizeOf(fileDir); } catch(err) { size = {}; }
        response.push({ 
            p: path.join(req.body.d, file).replace(/\\/g, '/'), 
            s: info.size,
            t: (info.mtime.getTime() / 1000).toFixed(0),
            w: size.width,
            h: size.height
        });
    }
  });
  
  res.send(response);
});

/* Copying a file or directory */
router.route('/copy').post(nAccessControl).post( function(req, res) {
  fs.copy(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, req.body.n))
  .then(function() {
    res.send({ res: "ok", msg: "Success" });
  }).catch(function(err) {
    console.warn(err);
    res.status(500).send({ res:"error", msg: 'Copying the file failed.' });
  });
});

/* Create directory */
router.post('/createdir', function(req, res) {
  fs.mkdir(path.join(serverRoot, req.body.d, req.body.n))
  .then(function() {
    res.send({ res: "ok", msg: "Success" });
  }).catch(function(err) {
    console.warn(err);
    res.status(500).send({ res:"error", msg: 'Creating the directory failed.' });
  });
});

/* Delete a file or directory */
router.post('/delete', function(req, res) {
  fs.remove(path.join(serverRoot, req.body.f || req.body.d))
  .then(function() {
    res.send({ res: "ok", msg: "Success" });
  }).catch(function(err) {
    console.warn(err);
    res.status(500).send({ res:"error", msg: 'Deleting the file failed.' });
  });
});

/* Download file */
router.get('/download', function(req, res) {
  res.download(path.join(serverRoot, req.query.f));
});

/* Download directory */
router.get('/downloaddir', function(req, res) {
  res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(req.query.d) + '.zip');
  
  var archive = archiver('zip');
  archive.pipe(res);
  archive.glob('**/*', {
    expand: true,
    cwd: path.join(serverRoot, req.query.d)
  });
  archive.finalize();
});

/* Move a file or directory */
router.route('/move').post(nAccessControl).post(function(req, res) {
  fs.move(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, req.body.n))
  .then(function() {
    res.send({ res: "ok", msg: "Success" });
  }).catch(function(err) {
    console.warn(err)
    res.status(500).send({ res:"error", msg: 'Moving the file failed.' });
  });
});

/* Rename a file or directory */
router.post('/rename', function(req, res) {
  var pathDir = path.dirname(req.body.f || req.body.d);
  fs.rename(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, pathDir, req.body.n))
  .then(function() {
    res.send({ res: "ok", msg: "Success" });
  }).catch(function(err) {
    console.warn(err)
    res.send({ res:"error", msg: 'Renaming the file failed.' });
  })
});

/* Upload files */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(serverRoot, req.body.d));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
storage._handleFile = customDiskStorage;

// Filters files based on access and upload list in config
function fileFilter(req, file, cb) {
  const fileType = path.extname(file.originalname).replace(/^./, '').toLowerCase();
  if(!utils.fileFolderAccess(req.session, req.body.d)) {
    cb(new Error('Upload directory not allowed.'));
  } else if(config.ALLOWED_UPLOADS !== undefined && config.ALLOWED_UPLOADS !== '' && !config.ALLOWED_UPLOADS.includes(fileType)) {
    cb(new Error('File extension on not allowed uploads list.'));
  } else if (config.FORBIDDEN_UPLOADS !== undefined && config.FORBIDDEN_UPLOADS !== '' && config.FORBIDDEN_UPLOADS.includes(fileType)) {
    cb(new Error('File extension on forbidden uploads list.'));
  }
  cb(null, true);
}

var upload = multer({ storage: storage, fileFilter: fileFilter }).array('files[]');
router.post('/upload', function(req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.warn(err);
      res.send({ res:"error", msg: err.toString() });
    }
    else{
      res.send({ res: "ok", msg: "Success" });  
    }
  })  
});

const getDirectories = function(srcpath, response) {
  const info = {
    p: srcpath.replace(/\\/g, '/'),
    f: 0,
    d: 0,
    c: []
  };
  response.push(info);
  
  fs.readdirSync(path.join(serverRoot, srcpath)).map(function(file) {
    var pathDir = path.join(srcpath, file);
    if(fs.statSync(path.join(serverRoot, pathDir)).isDirectory()){
        info.d++;
        getDirectories(pathDir, info.c);
    }else{
        info.f++;
    }
  });
};

module.exports = router;