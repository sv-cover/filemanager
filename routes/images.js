const express = require('express');
const router = express.Router();
const path = require('path');
const gm = require('gm');
const config = require('../config');
const utils = require('./utils');

const serverRoot = path.join('.', config.SERVER_ROOT);

router.use('/', function(req, res, next) {
  if (!req.app.locals.hasGM) {
    res.status(500).send('Graphics Magic is not installed.');
  } else {
    next();
  }
});

/* 
Generate resized image by adding ?f=path/to/file&w=width[&h=heigth&o=GraphicsMagickOption]
For the possible option for GraphicsMagickOption see http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
*/
router.get('/resize', function(req, res) {
  const query = req.query;
  
  if (query.f !== undefined && query.w !== undefined) {
    res.setHeader("content-type", "image/png");

    let image = gm(path.join(serverRoot, query.f));
    if (query.o !== undefined) {
      image = image.resize(query.w, query.h || null, query.o);
    } else {
      image = image.resize(query.w, query.h || null);
    }
    image.stream('png').pipe(res);
  } else {
    res.status(400).send('Missing query arguments.')
  }
});

/* Generate thumbnail */
router.get('/generatethumb', function(req, res) {
  const query = req.query;
  if (query.f !== undefined) {
    res.setHeader("content-type", "image/png");
  
    gm(path.join(serverRoot, query.f))
    .resize(query.width || '200', query.height || '200', '^')
    .gravity('Center')
    .crop(query.width || '200', query.height || '200')
    .stream('png')
    .pipe(res);
  } else {
    res.status(400).send('Missing query arguments.')
  }
});

module.exports = router;