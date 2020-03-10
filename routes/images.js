const express = require('express');
const router = express.Router();
const path = require('path');
const Bull = require('bull');
const gm = require('gm');
const cache = require('../cache');
const config = require('../config');

const serverRoot = path.join('.', config.SERVER_ROOT);
const imageQueue = new Bull('image transcoding', {redis: {
  port: config.REDIS_PORT,
  host: config.REDIS_HOST,
  db: config.REDIS_DB,
  password: config.REDIS_PASSWORD
}});

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

// Sends an gm image object by converting it into a stream.
function imageSend(res) {
  return (result) => {
    let image = gm(Buffer.from(result.image.data));
    res.setHeader('content-type', 'image/' + result.format);
    image.stream().pipe(res);
  };
};

function addToQueue(res, method, query) {
  imageQueue.add(method, query).then((job) => {
    job.finished().then(imageSend(res)).catch((err) => {
      console.warn(err);
      res.status(400).send('Failed to open file or file is not an image.');
    });
  }).catch((err) => {
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

// Returns a promise that tries to open path p in graphics magick.
function imageOpen(p) {
  return new Promise((resolve, reject) => {
    try {
      let image = gm(p);
      image.identify(function(err, value) {
        if (err) {
          reject(err);
        } else {
          resolve({image: image, format: value.format});
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function bufferImage(format, done) {
  return (err, buffer) => {
    if (err) return done(err);
    done(null, {format: format, image: buffer});
  }
}

resize = async function(job, done) {
  const query = job.data;
  const filepath = path.join(serverRoot, query.f)

  imageOpen(filepath).then((file) => {
    file.image = file.image.resize(query.w, query.h || null, query.o);
    file.image.toBuffer(bufferImage(file.format, done));
  }).catch((err) => {
    done(err);
  });
}

generatethumb = async function(job, done) {
  const query = job.data;
  const filepath = path.join(serverRoot, query.f)

  imageOpen(filepath).then((file) => {
    file.image = file.image
      .resize(query.w || '200', query.h || '200', '^')
      .gravity('Center')
      .crop(query.w || '200', query.h || '200');
    file.image.toBuffer(bufferImage(file.format, done));
  }).catch((err) => {
    done(err);
  });
}

imageQueue.process('resize', config.TRANSCODING_PROCESSES, resize);
imageQueue.process('generatethumb', config.TRANSCODING_PROCESSES, generatethumb);

module.exports = router;