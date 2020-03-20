import { ToastProgrammatic as Toast } from "buefy";

export function APIError({ message, url, status, response }) {
  this.name = "APIError";
  this.message = message;
  this.url = url;
  this.status = status;
  this.response = response;
  this.stack = new Error().stack;
  this.toString = () => {
    var representation = this.name;

    if (this.message !== undefined) representation += ": " + String(message);

    if (this.url !== undefined) representation += "\nUrl: " + String(url);

    if (this.status !== undefined)
      representation += "\nStatus: " + String(status);
    return representation;
  };
}

export function fetchData(url, method = "POST", body = null, expectJSON = true) {
  /**
   * Wrapper function for fetch. If expectJSON is true or unset, the result is expected to be json.
   */
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var init = {
    method: method,
    headers: headers
  };

  if (body) init["body"] = JSON.stringify(body);

  return fetch(url, init).then(response => {
    var contentType = response.headers.get("content-type");
    if (!response.ok)
      throw new APIError({
        url,
        status: response.status,
        response: expectJSON ? response.json() : response.text()
      });
    if (!expectJSON) return response.text();
    if (contentType && contentType.includes("application/json"))
      return response.json();
    throw new APIError({
      message:
        "Expected JSON, but response does not have application/json content type",
      url,
      status: response.status,
      response: response.text()
    });
  });
}

export function errorToast(err) {
  console.error(err);
  Toast.open({
    message: "Error: " + err.toString(),
    type: "is-danger"
  });
}

export function formatApiUrL(url, parameters) {
  url = url + "?";
  for (const [key, value] of Object.entries(parameters)) {
    console.log(key, value);
    url = url + encodeURIComponent(key) + "=" + value;
  }
  console.log(url);
  return url;
}

export function formatFileDate(date) {
  return new Date(date * 1000).toLocaleString();
}

export function formatFileSize(sizeInBytes) {
  const byteUnits = [
    "B",
    "kB",
    " MB",
    " GB",
    " TB",
    "PB",
    "EB",
    "ZB",
    "YB"
  ];
  let i = 0;
  for (i = 0; i < byteUnits.length; i++) {
    if (sizeInBytes < 1024) break;
    sizeInBytes = sizeInBytes / 1024;
  }
  return sizeInBytes.toFixed(2) + " " + byteUnits[i];
}

export function isImage(fileType) {
  return fileType.toLowerCase().match('(jpeg|jpg|gif|png)') != null;
}

export default { APIError, fetchData, errorToast, formatApiUrL, formatFileDate, formatFileSize, isImage };
