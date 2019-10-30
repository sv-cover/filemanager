const express = require('express');
const router = express.Router();
const path = require('path');
const gm = require('gm');
const config = require('../config');
const utils = require('./utils');

const serverRoot = path.join('.', config.SERVER_ROOT);

/* 
Generate resized image by adding ?f=path/to/file&w=width[&h=heigth&o=GraphicsMagickOption]
For the possible option for GraphicsMagickOption see http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
*/
router.route('/resize').get(utils.hasGraphicsMagick).get(function(req, res) {
  const query = req.query;
  if (query.f !== undefined && query.w !== undefined) {
    let image = gm(path.join(serverRoot, query.f));
    if (query.o !== undefined) {
      image = image.resize(query.w, query.h || null, query.o);
    } else {
      image = image.resize(query.w, query.h || null);
    }
    image.stream().pipe(res);
  } else {
    res.status(400).send('Missing query arguments.')
  }
});

module.exports = router;