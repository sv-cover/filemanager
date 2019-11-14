var Fileman = function(url) {
  // Set the url to the fileman app
  var filemanURL = url;
  var imageResizeURL = filemanURL + '/images/resize';

  function _nothing() { return };

  this._funcShow = _nothing;
  this._funcSelect = _nothing;
  this._funcClose = _nothing;
  
  // Initialise the api by adding a listener for the message event
  window.addEventListener('message', event => {
    if (event.origin === filemanURL) {
      const file = JSON.parse(event.data);
      console.log(file);
      this._funcSelect(file);
      this._funcClose();
    }
  }, false);
  
  this.createUrl = function(file, options) {
    var url = null;
    if (options) {
      url = imageResizeURL + '?f=' + file.fullPath;
      for(key in options) {
        url = url + '&' + key + '=' + options[key];
      }
      return url;
    }
    return filemanURL + '/' + file.fullPath;
  }

  /* 
    The function funcShow should display the element containing the fileman iframe.
    The function funcShow should close the element containing the fileman iframe.
    The function funcSelect(file) gets the selected fileMetadata from the fileman app.
  */
 this.connect = function(funcShow, funcClose, funcSelect) {
    return () => {
      this._funcShow = funcShow;
      this._funcClose = funcClose;
      this._funcSelect = funcSelect;
      this._funcShow();
    }
  };

  this.connectInputOnClick = function(funcShow, funcClose, input, options) {
    document.querySelectorAll(input).forEach(elem => {
      elem.addEventListener('click', this.connect(funcShow, funcClose, file => {
        elem.value = this.createUrl(file, options);
      }));
    });
  };

  this.connectImgOnClick = function(funcShow, funcClose, img, options) {
    document.querySelectorAll(img).forEach(elem => {
      elem.onclick = this.connect(funcShow, funcClose, file => {
        elem.src = this.createUrl(file, options);
      });
    });
  };

  this.connectPictures = function(funcShow, funcClose, img, widths) {
    document.querySelectorAll(img).forEach(elem => {
      elem.onclick = this.connect(funcShow, funcClose, file => {
        var html = '';
        var w = null;
        var i = 0;

        for(i = 0; i < (widths.length -1); i = i + 1) {
          w = widths[i];
          html = html + '<source media="(min-width: ' + w.toString() + 'px)" srcset="' + _createUrl(file, {w: w}) + '">';
        }
        w = widths[widths.length - 1];
        html = html + '<img src="' + _createUrl(file, {w: w}) + '" alt="' + file.name + '" style="width:auto;"">';

        elem.innerHTML = html;
      });
    });
  };
}