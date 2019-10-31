'use strict';

var StreamingCache = require('streaming-cache');

var defaults = {
    length: function (cachedObject) {
        return cachedObject && cachedObject.data ? cachedObject.data.length : 0;
    }
};

const cache = function (config) {
    var options = Object.assign({}, defaults, config);
    return new StreamingCache(options);
};

module.exports = cache;