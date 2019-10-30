const express = require('express');
const router = express.Router();
const path = require('path');
var gm = require('gm');

const serverRoot = './public/';

function resize(query, res, image) {
  if (typeof query.w != undefined) {
    if (typeof query.a != undefined) {
      sendImage(res, image.resize(query.w, query.h || null, query.a));
    } else {
      sendImage(res, image.resize(query.w, query.h || null));
    }
  } else {
    res.status(400).send('Missing the width parameter')
  }
}

function sendImage(res, image) {
  image.stream().pipe(res);
}

router.get('/:method', function(req, res, next) {
  const method = req.params.method;
  const query = req.query;
  console.log({
    method: method,
    query: query
  });
  if (typeof method != undefined && typeof query.f != undefined) {
    let image = gm(path.join(serverRoot, query.f));
    switch(method) {
      case 'resize':
        resize(query, res, image);
        break;
      default:
        res.status(400).send('The requested method does not exist.');
    }
    
  } else {
    res.status(400).send('The request is missing essential queries. Please look at the documentation on how to make an request.');
  }
});

module.exports = router;