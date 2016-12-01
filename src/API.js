import CacheStore from 'react-native-cache-store';

let Config = require('./Config');

class API {
  static getCategories() {
    return CacheStore.get('categories').then((categories) => {
      if (!categories) {
        console.log('Categories cache is expired or empty, fetching data from API...');
        return fetch(Config.API_BASEURL + '/categories')
          .then((response) => response.json())
          .then((data) => {
            console.log('Storing categories in cache');
            let categories = data['hydra:member'];
            return CacheStore.set('categories', categories, 10).then(() => categories);
          })
          .catch((err) => {console.log('ERROR', err)});
      }

      return categories;
    });
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

    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json().then(json => response.ok ? resolve(json) : reject(json));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

module.exports = API;