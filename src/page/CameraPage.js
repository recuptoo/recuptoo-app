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
} from 'react-native';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';

class CameraPage extends Component {
  state = {
    coordinates: null
  }
  takePicture(navigator) {
    setTimeout(() => {
      this.camera.capture()
        .then((data) => {
          navigator.parentNavigator.push({
            id: 'CropImagePage',
            name: 'CropImage',
            sceneConfig: Navigator.SceneConfigs.PushFromRight,
            passProps: {
              image: data.path,
              coordinates: this.state.coordinates,
            }
          });
        })
        .catch(err => console.error(err));
    }, 200);
  }
  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({coordinates: position.coords});
      },
      error => console.log('ERROR : getCurrentPosition', error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
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
    let cameraButtonStyle = [styles.cameraButton];
    let cameraIconColor = '#16a085';
    if (!this.state.coordinates) {
      cameraButtonStyle.push(styles.cameraButtonDisabled);
      cameraIconColor = '#ccc';
    }
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          captureTarget={Camera.constants.CaptureTarget.disk}
          aspect={Camera.constants.Aspect.fill}>
          <TouchableOpacity style={cameraButtonStyle} onPress={this.takePicture.bind(this, navigator)}>
            <Icon name="camera" size={30} color={cameraIconColor} />
          </TouchableOpacity>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: '#16a085'
  },
  cameraButtonDisabled: {
    borderColor: '#ccc',
    backgroundColor: 'rgba(256, 256, 256, 0.4)',
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
          Prendre une photo
        </Text>
      </TouchableOpacity>
    );
  }
};

module.exports = CameraPage;