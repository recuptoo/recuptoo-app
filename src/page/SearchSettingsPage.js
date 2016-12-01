import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Slider,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'underscore';

const API = require('../API');
const CategoryPicker = require('../component/CategoryPicker');

const DEFAULT_SETTINGS = {
  distanceValue: 500,
  selectedCategories: [],
};

class SearchSettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      settings: DEFAULT_SETTINGS
    };
  }
  componentWillMount() {
    API.getCategories().then(categories => this.setState({categories}));

    AsyncStorage.getItem('@SearchSettings')
      .then((json, error) => {
        if (!error && json) {
          return JSON.parse(json);
        }
        return DEFAULT_SETTINGS;
      })
      .then((settings) => {
        console.log('Restoring stored settings', settings);
        this.setState({settings});
      });
  }
  storeSettings() {
    var settings = {
      selectedCategories: this.categoryPicker.getCategories(),
      distanceValue: this.state.settings.distanceValue
    }

    console.log('Storing search settings', settings);

    return AsyncStorage.setItem('@SearchSettings', JSON.stringify(settings));
  }
  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator}
        navigationBar={
          <Navigator.NavigationBar style={{backgroundColor: '#16a085'}}
              routeMapper={NavigationBarRouteMapper} />
        } />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <View>
          <View>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Distance</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10}}>
              <Text style={{flex: 1}}>{this.state.settings.distanceValue} m</Text>
              <Slider
                style={{flex: 2}}
                minimumValue={500}
                maximumValue={2000}
                step={500}
                value={this.state.settings.distanceValue}
                onValueChange={(value) => {
                  let settings = {
                    ...this.state.settings,
                    distanceValue: value,
                  };
                  this.setState({settings});
                }} />
            </View>
          </View>
          <View>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Catégories</Text>
            </View>
            <CategoryPicker
              ref={ref => { this.categoryPicker = ref; }}
              selectedCategories={this.state.settings.selectedCategories}
              categories={this.state.categories} />
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
            this.storeSettings().then(() => {
              console.log('Settings stored')
              this.props.onSearchClick();
              navigator.parentNavigator.pop();
            });
          }}>
            <Icon name="search" size={20} color="#fff" />
            <Text style={{marginLeft: 10, color: '#fff'}}>Rechercher</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'stretch',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#16a085',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd'
  },
  headingText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  rowText: {
  },
  rowCheck: {
    position: 'absolute',
    right: 10,
  }
});

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>
          Annuler
        </Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Recherche
        </Text>
      </TouchableOpacity>
    );
  }
};

module.exports = SearchSettingsPage;