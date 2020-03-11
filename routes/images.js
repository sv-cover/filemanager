const express = require('express');
const router = express.Router();
const gm = require('gm');
const cache = require('../cache');
const config = require('../config');
const jobQueue = require('./jobQueue');

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

function imageSend(res) {
  return (result) => {
    let image = gm(result.image);
    res.setHeader('content-type', 'image/' + result.format);
    image.stream().pipe(res);
  };
};

function addToQueue(res, method, query) {
  jobQueue.addJobToQueue(method, query).then(imageSend(res)).catch((err) => {
    console.warn(err);
    res.status(400).send('Failed to start image process job');
  });
}

/* 
Generate resized image by adding ?f=path/to/file&w=width[&h=heigth&o=GraphicsMagickOption]
For the possible option for GraphicsMagickOption see http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
*/
router.get('/resize', function(req, res) {
  const query = req.query;
  
  if (query.f !== undefined && query.w !== undefined) {
    addToQueue(res, 'resize', query);
  } else {
    console.warn(req.url + ' missing query arguments.');
    res.status(400).send('Missing query arguments.');
  }
});

/* Generate thumbnail */
router.get('/generatethumb', function(req, res) {
  const query = req.query;
  if (query.f !== undefined) {
    addToQueue(res, 'generatethumb', query);
  } else {
    console.warn(req.url + ' missing query arguments.');
    res.status(400).send('Missing query arguments.').end();
  }
});

module.exports = router;