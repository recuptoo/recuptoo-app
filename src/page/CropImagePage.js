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
  Image
} from 'react-native';
import {ImageCrop} from 'react-native-image-cropper';

const { width, height } = Dimensions.get('window');
const imageSize = (width - 20);

class CropImagePage extends Component {
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
        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
          <ImageCrop
            ref={ref => { this.cropper = ref; }}
            image={this.props.image}
            cropHeight={imageSize}
            cropWidth={imageSize}
            zoom={0}
            maxZoom={80}
            minZoom={20}
            panToMove={true}
            pinchToZoom={true} />
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
            this.cropper.crop().then((base64) => {
              navigator.parentNavigator.push({
                id: 'FormPage',
                name: 'Form',
                sceneConfig: Navigator.SceneConfigs.PushFromRight,
                passProps: {
                  image: base64,
                  coordinates: this.props.coordinates,
                }
              });
            })
          }}>
            <Text style={{color: '#fff'}}>Continuer</Text>
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
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#16a085',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
          Prendre une photo
        </Text>
      </TouchableOpacity>
    );
  }
};

module.exports = CropImagePage;