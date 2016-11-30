let Config = require('./Config');

class API {
  static getCategories() {
    return fetch(Config.API_BASEURL + '/categories')
      .then((response) => response.json())
      .then((json) => json['hydra:member'])
      .catch((err) => {console.log('ERROR', err)});
  }
  static getObjects() {
    return fetch(Config.API_BASEURL + '/objects')
      .then((response) => response.json())
      .then((json) => json['hydra:member'])
      .catch((err) => {console.log('ERROR', err)});
  }
  static createObject(data, image) {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    var request = new Request(Config.API_BASEURL + '/objects', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: headers,
    });

    return fetch(request)
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  }
}

module.exports = API;