var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var path = require('path');
var sizeOf = require('image-size');
var multer  = require('multer');
var archiver = require('archiver');
const config = require('../config');
const utils = require('./utils');

const serverRoot = path.join('.', config.SERVER_ROOT);

router.use('/', function(req, res, next) {
  if (req.session === undefined || req.session === null || Array.isArray(req.session.user.committees) || req.session.user.committees.length == 0) {
    res.status(403).send('You are not allowed to access to the Cover Fileman API');
  } else {
    next()
  }
});

/* List directory tree */
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
  utils.fileFolderAccessControl(res, req.session, req.body.d);
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
router.post('/copy', function(req, res) {
  utils.fileFolderAccessControl(res, req.session, req.body.f || req.body.d);
  utils.fileFolderAccessControl(res, req.session, req.body.n);
  const basename = path.basename(req.body.f || req.body.d);
  try {
    fs.copySync(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, req.body.n, basename));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    console.log(err);
    res.send({ res:"error", msg: err });
  }
});

/* Create directory */
router.post('/createdir', function(req, res) {
  utils.fileFolderAccessControl(res, req.session, req.body.d);
  utils.fileFolderAccessControl(res, req.session, req.body.n);
  try {
    fs.mkdirsSync(path.join(serverRoot, req.body.d, req.body.n));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    res.send({ res:"error", msg: err });
  }
});

/* Delete a file or directory */
router.post('/delete', function(req, res) {
  utils.fileFolderAccessControl(res, req.session, req.body.f || req.body.d);
  try {
    fs.removeSync(path.join(serverRoot, req.body.f || req.body.d));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    res.send({ res:"error", msg: err });
  }
});

/* Download file */
router.get('/download', function(req, res) {
  utils.fileFolderAccessControl(res, req.session, req.query.f);
  res.download(path.join(serverRoot, req.query.f));
});

/* Download directory */
router.get('/downloaddir', function(req, res) {
  utils.fileFolderAccessControl(res, req.session, req.query.d);
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
router.post('/move', function(req, res) {
  utils.fileFolderAccessControl(res, req.session, req.body.f || req.body.d);
  utils.fileFolderAccessControl(res, req.session, req.body.n);
  fs.move(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, req.body.n), function (err) {
    if (err) {
      console.log(err);
      res.send({ res:"error", msg: err.toString() });
    }
    else{
      res.send({ res: "ok", msg: "Success" });
    }
  });
});

/* Rename a file or directory */
router.post('/rename', function(req, res) {
  utils.fileFolderAccessControl(res, req.session, req.body.f || req.body.d);
  var pathDir = path.dirname(req.body.f || req.body.d);
  try {
    fs.renameSync(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, pathDir, req.body.n));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    res.send({ res:"error", msg: err });
  }
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

var upload = multer({ storage: storage }).array('files[]');
router.post('/upload', function(req, res) {
  console.log(req);
  upload(req, res, function (err) {
    if (err) {
      res.send({ res:"error", msg: err });
    }
    else{
      res.send({ res: "ok", msg: "Success" });  
    }
  })  
});

var getDirectories = function(srcpath, response) {
  var info = {
    p: srcpath.replace(/\\/g, '/'),
    f: 0,
    d: 0
  };
  response.push(info);
  
  fs.readdirSync(path.join(serverRoot, srcpath)).map(function(file) {
    var pathDir = path.join(srcpath, file);
    if(fs.statSync(path.join(serverRoot, pathDir)).isDirectory()){
        info.d++;
        getDirectories(pathDir, response);
    }else{
        info.f++;
    }
  });
};

module.exports = router;