import { ToastProgrammatic as Toast } from "buefy";

function APIError({ message, url, status, response }) {
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

function fetchData(url, method = "POST", body = null, expectJSON = true) {
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

  console.log(body)

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

function errorToast(err) {
  console.error(err);
  Toast.open({
    message: "Error: " + err.toString(),
    type: "is-danger"
  });
}

function formatApiUrL(url, parameters) {
  url = url + "?";
  for (const [key, value] of Object.entries(parameters)) {
    console.log(key, value);
    url = url + encodeURIComponent(key) + "=" + value;
  }
  console.log(url);
  return url;
}

export { APIError, fetchData, errorToast, formatApiUrL };
