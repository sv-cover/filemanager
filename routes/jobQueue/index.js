const Bull = require('bull');
const gm = require('gm');
const config = require('../../config');

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
          resolve({image: image, format: value.format, size: value.size});
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

function maxSize(file) {
  if(file.size.width > config.MAX_IMAGE_WIDTH || file.size.height > config.MAX_IMAGE_HEIGHT) {
    return file.image.resize(config.MAX_IMAGE_WIDTH, config.MAX_IMAGE_HEIGHT);
  } 
  return file.image
}

async function processImage(job, done) {
  const query = job.data.query;
  const method = job.data.method;
  const filepath = job.data.filepath;

  imageOpen(filepath).then((file) => {
    switch (method) {
      case 'resize':
        file.image = resize(file.image, query);
        break;
      case 'generatethumb':
        file.image = generatethumb(file.image, query);
        break;
      case 'maxSize':
        file.image = maxSize(file);
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

function addJobToQueue(method, filepath, query) {
  return new Promise(function(resolve, reject) {
    imageQueue.add('processImage', {method: method, filepath: filepath, query: query}).then((job) => {
      job.finished().then((jobID) => {
        const result = results[jobID];
        delete results[jobID];
        resolve(result);
      }).catch(reject);
    }).catch(reject);
  });
}

module.exports = {
  addJobToQueue: addJobToQueue
};