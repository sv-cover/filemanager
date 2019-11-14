'use strict';

const fs = require('fs-extra');
const LRU = require('lru-cache');
const path = require('path');

const defaults = {
  cacheRoot: 'cachestorage',
  cacheJSON: 'cache.json',
  noDisposeOnSet: true,
    length: function(n) {
      return n.length ? n.length : 0;
    },
  dispose: function(key, n) {
    console.info('Dispose of: ' + key);
    try {
      fs.unlinkSync(n.path);
    } catch (error) {
      console.error(error);
    }
  }
};

// Creates a drivecache controller object
function DriveCache(options) {
  this.cache = new LRU(options);
  this.options = options;
  this.save = path.join(this.options.cacheRoot, this.options.cacheJSON);

  this.saveCache = function() {
    fs.writeJson(this.save, this.cache.dump(), err => {
      if (err) console.error(err);
    });
  }

  // Tries to load an existing saved cache
  this.loadCache = function() {
    fs.readJson(this.save, (err, packageObj) => {
      if (err) {
        console.warn(err)
      } else {
        this.cache.load(packageObj)
      }
    })
  }

  this.loadCache();

  /*
  Gets the cached stream for key. If the key does not exist
  the function will return undefined.
  */
  this.get = function(key) {
    let hit = this.cache.get(key);

    if (!hit) {
        return undefined;
    }

    if (hit.status === 'PENDING') {
      console.log('PENDING'); // Todo: fix if stream exists
      return undefined;
    }

    try {
      if(fs.existsSync(hit.path)) {
        let stream = fs.createReadStream(hit.path, { flags: 'r' });
  
        return stream;
      }
      throw new Error('File ' + hit.path + ' does not exist.')
      
    } catch (error) {
      console.warn(error);
      return undefined
    }
  }

  /*
  Returns a writable stream for key.
  */
  this.set = key => {
    const p = path.join(this.options.cacheRoot, key);
    let stream = fs.createWriteStream(p);
    let metadata = this.getMetadata(key) || {};
    this.cache.set(key, { length: 0, status: 'PENDING', metadata: metadata });

    stream.on('finish', () => {
      let metadata = this.getMetadata(key) || {};
      this.cache.set(key, { path: p, length: stream.bytesWritten, status: 'FINISHED', metadata: metadata });
      this.saveCache();
    });

    return stream;
  }

  // Gets the metadata for key.
  this.getMetadata = function(key) {
    var hit = this.cache.get(key);

    return hit && hit.metadata ? hit.metadata : null;
  }

  // Sets the metadata for key.
  this.setMetadata = function(key, metadata) {
    var data = Object.assign({}, this.cache.get(key), { metadata: metadata })
    this.cache.set(key, data);
    this.saveCache();
  }

  // Deletes the stored stream and metadata for key
  this.del = function(key) {
    this.cache.del(key);
    this.saveCache();
  }
};

const driveCache = function (options) {
  options = Object.assign({}, defaults, options);
  return new DriveCache(options);
};

module.exports = driveCache;