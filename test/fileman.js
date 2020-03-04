var Fileman = function(url, funcShow, funcClose) {
  // Set the url to the fileman app
  var filemanURL = url;
  var imageResizeURL = filemanURL + '/images/resize';

  function _nothing() { return };

  this._funcShow = funcShow;
  this._funcSelect = _nothing;
  this._funcClose = funcClose;
  
  // Initialise the api by adding a listener for the message event
  window.addEventListener('message', event => {
    if (event.origin === filemanURL) {
      const file = JSON.parse(event.data);
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
 this.connect = function(funcSelect) {
    console.log(this);
    return (event) => {
      event.preventDefault();
      this._funcSelect = funcSelect;
      this._funcShow();
    }
  };

  this.connectInputOnClick = function(input, options) {
    document.querySelectorAll(input).forEach(elem => {
      elem.addEventListener('click', this.connect(file => {
        elem.value = this.createUrl(file, options);
      }));
    });
  };
}