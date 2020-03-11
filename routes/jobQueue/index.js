const path = require('path');
const Bull = require('bull');
const gm = require('gm');
const config = require('../../config');

const serverRoot = path.join('.', config.SERVER_ROOT);
const imageQueue = new Bull('image transcoding', {redis: {
  port: config.REDIS_PORT,
  host: config.REDIS_HOST,
  db: config.REDIS_DB,
  password: config.REDIS_PASSWORD
}});

const results = {};

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

function resize(image, query) {
  return image.resize(query.w, query.h || null, query.o);
}

function generatethumb(image, query) {
  return image.resize(query.w || '200', query.h || '200', '^')
    .gravity('Center')
    .crop(query.w || '200', query.h || '200');
}

async function processImage(job, done) {
  const query = job.data.query;
  const method = job.data.method;
  const filepath = path.join(serverRoot, query.f)

  imageOpen(filepath).then((file) => {
    switch (method) {
      case 'resize':
        file.image = resize(file.image, query);
        break;
      case 'generatethumb':
        file.image = generatethumb(file.image, query);
        break;
    }
    file.image.toBuffer((err, buffer) => {
      if (err) return done(err);
      results[job.id] = {format: file.format, image: buffer};
      done(null, job.id);
    });
  }).catch((err) => {
    done(err);
  });
}

imageQueue.process('processImage', config.TRANSCODING_PROCESSES, processImage);

function addJobToQueue(method, query) {
  return new Promise(function(resolve, reject) {
    imageQueue.add('processImage', {method: method, query: query}).then((job) => {
      job.finished().then((jobID) => {
        const result = results[jobID];
        delete results[jobID];
        console.log(results);
        resolve(result);
      }).catch(reject);
    }).catch(reject);
  });
}

module.exports = {
  addJobToQueue: addJobToQueue
};