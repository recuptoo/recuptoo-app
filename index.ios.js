/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
} from 'react-native';

const CameraPage = require('./src/page/CameraPage');
const MapPage = require('./src/page/MapPage');
const SearchSettingsPage = require('./src/page/SearchSettingsPage');
const CropImagePage = require('./src/page/CropImagePage');
const FormPage = require('./src/page/FormPage');

export default class RecuptooApp extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{id: 'MapPage', name: 'Map'}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }} />
    );
  }

  renderScene(route, navigator) {
    var routeId = route.id;
    if (routeId === 'CameraPage') {
      return (
        <CameraPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'MapPage') {
      return (
        <MapPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'SearchSettingsPage') {
      return (
        <SearchSettingsPage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'CropImagePage') {
      return (
        <CropImagePage navigator={navigator} {...route.passProps} />
      );
    }
    if (routeId === 'FormPage') {
      return (
        <FormPage navigator={navigator} {...route.passProps} />
      );
    }

    return this.noRoute(navigator);
  }

  noRoute(navigator) {
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigator.pop()}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>NOT FOUND</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('RecuptooApp', () => RecuptooApp);
