const express = require('express');
const router = express.Router();
const path = require('path');
const cache = require('../cache');
const config = require('../config');
const utils = require('./utils');

const serverRoot = path.join('.', config.SERVER_ROOT);

// Checks if graphics magick is installed.
router.use('/', function(req, res, next) {
  if(!req.app.locals.hasGM) {
    console.err('Graphics Magic is not installed.')
    res.status(500).send('Graphics Magic is not installed.');
  } else {
    next();
  }
});

router.use('/', cache({ max: config.CACHE_MAX_SIZE, maxAge: config.CACHE_MAX_AGE }));

/* 
Generate resized image by adding ?f=path/to/file&w=width[&h=heigth&o=GraphicsMagickOption]
For the possible option for GraphicsMagickOption see http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
*/
router.get('/resize', function(req, res) {
  const query = req.query;
  
  if (query.f !== undefined && query.w !== undefined) {
    const p = path.join(serverRoot, query.f)
    utils.imageOpen(p).then((image) => {
      image = image.resize(query.w, query.h || null, query.o);
      utils.imageSend(res, image);
    }).catch((err) => {
      console.warn(err);
      res.status(400).send('Failed to open file or file is not an image.');
    });
  } else {
    console.warn(req.url + ' missing query arguments.');
    res.status(400).send('Missing query arguments.');
  }
});

/* Generate thumbnail */
router.get('/generatethumb', function(req, res) {
  const query = req.query;
  if (query.f !== undefined) {
    const p = path.join(serverRoot, query.f)
    utils.imageOpen(p).then((image) => {
      image = image
        .resize(query.w || '200', query.h || '200', '^')
        .gravity('Center')
        .crop(query.w || '200', query.h || '200');
      utils.imageSend(res, image);
    }).catch((err) => {
      console.warn(err);
      res.status(400).send('Failed to open file or file is not an image.').end();
    });
  } else {
    console.warn(req.url + ' missing query arguments.');
    res.status(400).send('Missing query arguments.').end();
  }
});

module.exports = router;