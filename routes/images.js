const express = require('express');
const router = express.Router();
const path = require('path');
const Bull = require('bull');
const gm = require('gm');
const cache = require('../cache');
const config = require('../config');
const utils = require('./utils');

const serverRoot = path.join('.', config.SERVER_ROOT);
const imageQueue = new Bull('image transcoding', 'redis://host.docker.internal:6379');

// Returns a promise that tries to open path p in graphics magick.
imageOpen = function(p) {
  return new Promise((resolve, reject) => {
    try {
      let image = gm(p);
      image.identify(function(err, value) {
        if (err) {
          reject(err);
        } else {
          resolve({image: image, indentify: value});
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Sends an gm image object by converting it into a stream.
imageSend = function(res) {
  return (result) => {
    let image = gm(Buffer.from(result.image.data));
    res.setHeader('content-type', 'image/' + result.format);
    image.stream().pipe(res);
  };
};

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
    imageQueue.add({
      method: 'resize',
      query: query
    }).then((job) => {
      job.finished().then(imageSend(res)).catch((err) => {
        console.warn(err);
        res.status(400).send('Failed to open file or file is not an image.');
      });
    }).catch((err) => {
      console.warn(err);
      res.status(400).send('Failed to start image process job');
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
    imageQueue.add({
      method: 'generatethumb',
      query: query
    }).then((job) => {
      job.finished().then(imageSend(res)).catch((err) => {
        console.warn(err);
        res.status(400).send('Failed to open file or file is not an image.');
      });
    }).catch((err) => {
      console.warn(err);
      res.status(400).send('Failed to start image process job');
    });
  } else {
    console.warn(req.url + ' missing query arguments.');
    res.status(400).send('Missing query arguments.').end();
  }
});

imageQueue.process(async (job, done) => {
  const query = job.data.query;
  const filepath = path.join(serverRoot, query.f)

  imageOpen(filepath).then((file) => {
    let image = null;
    let format = file.indentify.format;

    switch (job.data.method) {
      case "resize":
        image = file.image.resize(query.w, query.h || null, query.o);
        break;
      case "generatethumb":
        image = file.image
          .resize(query.w || '200', query.h || '200', '^')
          .gravity('Center')
          .crop(query.w || '200', query.h || '200');
        break;
      default:
        done(new Error('Method does not exist in this process.'))
        break;
    }
    image.toBuffer(function(err, buffer) {
      if (err) return done(err);
      done(null, {format: format, image: buffer});
    });
  }).catch((err) => {
    done(err);
  });
});

module.exports = router;