const coverapi = require('./coverapi');
const fileman = require('./fileman');

const config = { ...{
    /* General */
    'SERVER_ROOT': 'public',
    'UPLOADS_FOLDER': 'uploads',
    'ADMINS': ['nico@svcover.nl'],
    'ADMIN_COMMITTEES': ['board'],
    /* Images */
    "MAX_IMAGE_WIDTH": "2000",
    "MAX_IMAGE_HEIGHT": "2000",
    /* Caching */
    'CACHE_USE': true,
    'CACHE_MAX_SIZE': 100*1024*1024, /* In bytes. */
    'CACHE_MAX_AGE': 24*60*60*1000 /* In miliseconds */
}, ...coverapi, ...fileman }

module.exports = config;