let fileman = require('./fileman');

const config = {...{
    /* Cover API */
    'COVER_API_URL': 'http://host.docker.internal:8080/api.php',
    'COVER_LOGIN_URL': 'http://localhost:8080/api.php?view=login',
    'COVER_LOGOUT_URL': 'http://localhost:8080/api.php?view=logout',
    'COVER_COOKIE': 'cover_session_id',
    'COVER_API_APP': 'test-app',
    'COVER_API_SECRET': 'ultrasecrethashkey',
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
}, ...fileman}

module.exports = config;