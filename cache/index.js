'use strict';

const devnull = require('dev-null');
const fs = require('fs-extra');
const path = require('path');
const sanatize = require('sanitize-filename');
const config = require('../config');
const DriveCache = require('./lib/drivecache');

const serverRoot = path.join('.', config.SERVER_ROOT);

const defaultOptions = {
  type: 'mem',
  max: 1024*1024,
  maxAge: 60*1000,
  cacheableHttpStatusCodes: [200, 304]
};

const isResponseUncacheable = function(opts, res) {
  return opts.cacheableHttpStatusCodes.indexOf(res.statusCode) === -1 || res.nocache;
};

const cache = function(options = {}) {
  if(!config.CACHE_USE) {
    return function(req, res, next) { res.cache = devnull(); next(); }
  }
  options = Object.assign({}, defaultOptions, options)
  let cache = null;

  cache = DriveCache(options);

  const middleware = function(req, res, next) {
    const key = sanatize(req.url);

    fs.stat(path.join(serverRoot, req.query.f))
    .then(info => {
      const fileLastUpdated = info.mtimeMs;
      let readStream =  cache.get(key);
      let metadata = cache.getMetadata(key);

      if (!readStream || (metadata && metadata.fileLastUpdated !=  fileLastUpdated)) {
        console.log('Cache miss for: ' + key);
        cache.setMetadata(key, {});
        res.on('pipe', (src) => {
          src.pipe(cache.set(key));
          console.log(res.get('Content-Type'))
          cache.setMetadata(key, {
            contentType: res.get('Content-Type'),
            fileLastUpdated: fileLastUpdated
          });
        });
        
        res.on('finish', function () {
          console.log('Finished writing')
          if (isResponseUncacheable(options, res)) {
            console.log('Error response');
            cache.del(key);
          }
        });

        next();
      } else {
        console.log('Read cached data for: ' + key);
        res.setHeader('content-type', metadata.contentType);
        return readStream.pipe(res);
      }
    }).catch(err => {
      console.log('File did not exist while caching: ' + err);
      next();
    });
  }

  middleware.cache = cache;
  return middleware;
};

module.exports = cache;