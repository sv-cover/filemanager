var fs = require('fs')
var path = require('path')
const gm = require('gm');
const config = require('../../config');

/* 
Replace the _handlefile function of multer diskStorage with this function.
The function adds image rescaling to the diskStorage function.
*/
const handleFile = function(req, file, cb) {
  var that = this;

  that.getDestination(req, file, function (err, destination) {
    if (err) return cb(err);

    that.getFilename(req, file, function (err, filename) {
      if (err) return cb(err);

      let finalPath = path.join(destination, filename);

      if( config.MAX_IMAGE_HEIGHT != 0 && config.MAX_IMAGE_WIDTH != 0
      && file.mimetype.split('/')[0] === 'image' ) {
        let tmpPath = path.join(config.TMP_FOLDER, filename);
        let outTmpStream = fs.createWriteStream(tmpPath);

        file.stream.pipe(outTmpStream);
        outTmpStream.on('error', cb);
        outTmpStream.on('finish', function () {
          gm(tmpPath).size(function(err, size) {
            if(err) cb(err);
            let image = this;
            if(size.width > config.MAX_IMAGE_WIDTH || size.height > config.MAX_IMAGE_HEIGHT) {
              image = this.resize(config.MAX_IMAGE_WIDTH, config.MAX_IMAGE_HEIGHT);
            }
            image.write(finalPath, function(err) {
              if(err) cb(err);
              cb(null, {
                destination: destination,
                filename: filename,
                path: finalPath
              });
            });
          });
        });
      } else {
        let outStream = fs.createWriteStream(finalPath);
  
        file.stream.pipe(outStream);
        outStream.on('error', cb);
        outStream.on('finish', function () {
          cb(null, {
            destination: destination,
            filename: filename,
            path: finalPath,
            size: outStream.bytesWritten
          })
        });
      }
    })
  })
}

module.exports = handleFile;