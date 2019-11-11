'use strict';

const StreamingCache = require('streaming-cache');

const defaults = {
    length: function (cachedObject) {
        return cachedObject && cachedObject.data ? cachedObject.data.length : 0;
    }
};

const memCache = function (options) {
    options = Object.assign({}, defaults, options);
    return new StreamingCache(options);
};

module.exports = memCache;