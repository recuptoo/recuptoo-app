import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

const API = require('../API');

const { width, height } = Dimensions.get('window');

const LATITUDE_DELTA = 0.0722;
const LONGITUDE_DELTA = 0.0221;

const COURIER_COORDS = {
  latitude: 48.872178,
  longitude: 2.331797
};

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        ...COURIER_COORDS,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      position: undefined,
      loading: false,
      loadingMessage: 'Chargement…',
    };
  }
  get navigationBarRouteMapper() {
    let onSearchClick = () => this.searchObjects();

    return {
      LeftButton(route, navigator, index, navState) {
        return (
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
              onPress={() => {}}>
            <Text style={{color: 'white', margin: 10}}>Retour</Text>
          </TouchableOpacity>
        );
      },
      RightButton(route, navigator, index, navState) {
        return (
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', paddingRight: 10}}
            onPress={() => {
              navigator.parentNavigator.push({
                id: 'SearchSettingsPage',
                name: 'SearchSettings',
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                passProps: {
                  onSearchClick: onSearchClick
                }
              });
            }}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        );
      },
      Title(route, navigator, index, navState) {
        return (
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: 'white', margin: 10, fontSize: 16}}>
              Coursiers
            </Text>
          </TouchableOpacity>
        );
      }
    };
  }
  onRegionChange(region) {
    this.setState({region});
  }
  searchObjects() {
    this.setState({loading: true});
    API.getObjects().then((objects) => {
      let markers = [];
      objects.forEach((object) => {
        markers.push({
          key: 'object#' + object.id,
          identifier: 'object#' + object.id,
          coordinate: object.coordinates,
          pinColor: 'green',
          title: 'Foo',
          description: object.description,
        });
      });
      this.setState({
        loading: false,
        markers: markers
      });
    });
  }
  componentDidMount() {
    this.searchObjects();
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={styles.navigationBar}
                routeMapper={this.navigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {

    let loader = <View />;

    if (this.state.loading) {
      loader = (
        <View style={styles.loader}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{this.state.loadingMessage}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            initialRegion={this.state.region}
            region={this.state.region}
            onRegionChange={this.onRegionChange.bind(this)}
            zoomEnabled
            showsUserLocation
            loadingEnabled
            loadingIndicatorColor={"#666666"}
            loadingBackgroundColor={"#eeeeee"}>
            {this.state.markers.map(marker => (
              <MapView.Marker
                identifier={marker.identifier}
                key={marker.key}
                coordinate={marker.coordinate}
                pinColor={marker.pinColor}
                title={marker.title}
                description={marker.description} />
            ))}
            <MapView.Polyline
              coordinates={this.state.polylineCoords}
              strokeWidth={4}
              strokeColor="#19B5FE"
             />
          </MapView>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => {
            navigator.parentNavigator.push({
              id: 'CameraPage',
              name: 'Camera',
              sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
              passProps: {

              }
            });
          }}>
            <Icon name="camera" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        {loader}
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
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: '#16a085',
    paddingVertical: 10,
    alignItems: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  navigationBar: {
    backgroundColor: '#16a085'
  }
});

module.exports = MapPage;