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
}

module.exports = API;