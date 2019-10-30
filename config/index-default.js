config = {
    /* Cover API */
    'COVER_API_URL': 'http://localhost:8080/api.php',
    'COVER_LOGIN_URL': 'http://localhost:8080/api.php?view=login',
    'COVER_LOGOUT_URL': 'http://localhost:8080/api.php?view=logout',
    'COVER_COOKIE': 'cover_session_id',
    'COVER_API_APP': 'test-app',
    'COVER_API_SECRET': 'ultrasecrethashkey',
    /* General */
    'SERVER_ROOT': 'public',
    'UPLOADS_FOLDER': 'uploads',
    'ADMINS': ['nico@svcover.nl'],
    'ADMIN_COMMITTEES': ['board']
}

module.exports = config