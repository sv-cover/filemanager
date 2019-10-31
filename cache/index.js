'use strict';

const devnull = require('dev-null');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const newCache = require('./lib/cache');

const serverRoot = path.join('.', config.SERVER_ROOT);

const options = {
  max: config.CACHE_MAX_SIZE,
  maxAge: config.CACHE_MAX_AGE,
  cacheableHttpStatusCodes: [200, 304]
};

const isResponseUncacheable = function(opts, res) {
  return opts.cacheableHttpStatusCodes.indexOf(res.statusCode) === -1 || res.nocache;
};

const cache = function() {
  if(!config.CACHE_USE) {
    return function(req, res, next) { next(); }
  }

  let cache = newCache(options);

  const middleware = function(req, res, next) {
    const key = req.url;

    fs.stat(path.join(serverRoot, req.query.f))
    .then(function(info) {
      const fileLastUpdated = info.mtimeMs;

      if (cache.exists(key)) {
        let metaData = cache.getMetadata(key);
        let stream = cache.get(key);
  
        if (metaData.fileLastUpdated === fileLastUpdated && stream) {
          return stream.pipe(res);
        }
      }
      
      // Cache miss for the url
      console.log('Cache miss for: ' + key);
      let newStream = cache.set(key);
      let metaData = cache.getMetadata(key);
  
      let _write = res.write.bind(res);
  
      res.write = function (chunk, encoding) {
        newStream.write(chunk, encoding);
        return _write(chunk, encoding);
      };
  
      res.on('finish', function () {
        newStream.end();
        newStream.pipe(devnull());
  
        if (!metaData) {
          console.log('cache item was immediately expired: ' + req.url);
        } else {
          // Set metadata
          metaData.fileLastUpdated = fileLastUpdated;
        }
  
        if (isResponseUncacheable(options, res)) {
          cache.del(key);
        }
      });
  
      next();
    }).catch(function(err) {
      console.log('File did not exist while caching: ' + err);
      next();
    });
  }

  middleware.cache = cache;
  return middleware;
};

module.exports = cache;