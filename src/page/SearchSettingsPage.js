import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ListView,
  Slider,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'underscore';

const API = require('../API');

class SearchSettingsPage extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      categories: [],
      categoriesDataSource: dataSource.cloneWithRows([]),
      selectedCategories: [],
      distanceValue: 500
    };
  }
  componentWillMount() {
    AsyncStorage.getItem('@Categories')
      .then((json, error) => {
        if (!error && json) {
          console.log('Categories already cached.');
          return JSON.parse(json);
        }

        return API.getCategories().then((categories) => {
          AsyncStorage.setItem('@Categories', JSON.stringify(categories));
          return categories;
        });
      })
      .then((categories) => {
        console.log('Loaded categories.', categories);
        this.setState({
          categories: categories,
          categoriesDataSource: this.state.categoriesDataSource.cloneWithRows(categories)
        });
      });

    AsyncStorage.getItem('@SearchSettings')
      .then((json, error) => {
        if (!error && json) {
          return JSON.parse(json);
        }
        return {};
      })
      .then((settings) => {
        let selectedCategories = [];
        let distanceValue = 500;
        let state = {};
        if (settings.selectedCategories) {
          state.selectedCategories = settings.selectedCategories;
        }
        if (settings.distanceValue) {
          state.distanceValue = settings.distanceValue;
        }
        this.setState(state);
      });


  }
  storeSettings() {
    var settings = {
      selectedCategories: this.state.selectedCategories,
      distanceValue: this.state.distanceValue
    }

    return AsyncStorage.setItem('@SearchSettings', JSON.stringify(settings));
  }
  renderRow(category) {
    let icon = <View />
    if (_.contains(this.state.selectedCategories, category.id)) {
      icon = (
        <View style={styles.rowCheck}>
          <Icon name="check" size={20} color="#000" />
        </View>
      );
    }
    return (
      <TouchableHighlight
        onPress={() => {
          let selectedCategories = this.state.selectedCategories;
          if (_.contains(selectedCategories, category.id)) {
            selectedCategories = _.without(selectedCategories, category.id);
          } else {
            selectedCategories.push(category.id);
          }
          this.setState({selectedCategories});
        }}>
        <View style={styles.row}>
          <Text style={styles.rowText}>{category.name}</Text>
          {icon}
        </View>
      </TouchableHighlight>
    );
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
        <View style={{}}>
          <View>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Distance</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10}}>
              <Text style={{flex: 1}}>{this.state.distanceValue} m</Text>
              <Slider
                style={{flex: 2}}
                minimumValue={500}
                maximumValue={2000}
                step={500}
                value={this.state.distanceValue}
                onValueChange={(value) => this.setState({distanceValue: value})} />
            </View>
          </View>
          <View>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Catégories</Text>
            </View>
            <ListView
              enableEmptySections
              dataSource={this.state.categoriesDataSource}
              renderRow={this.renderRow.bind(this)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
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