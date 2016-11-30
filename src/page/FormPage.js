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
  Image,
  TextInput,
} from 'react-native';
import {ImageCrop} from 'react-native-image-cropper';

const API = require('../API');

const { width, height } = Dimensions.get('window');
const imageSize = ((width / 2) - 20);

class FormPage extends Component {
  state = {
    description: ''
  };
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
        <View style={{padding: 10}}>
          <Image
            style={{width: imageSize, height: imageSize, resizeMode: Image.resizeMode.contain}}
            source={{uri: this.props.image}} />
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={{height: 40}}
              onChangeText={(description) => this.setState({description})}
              value={this.state.description}
              placeholder={'Armoire, chaise, table basse…'} />
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
            let data = {
              category: '/api/categories/1',
              description: this.state.description,
              coordinates: this.props.coordinates,
            }
            console.log('Creating object with data', data);
            API.createObject(data, this.props.image).then((object) => {
              console.log('Object created!', object);
            });
          }}>
            <Text style={{color: '#fff'}}>Envoyer</Text>
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
  formGroup: {
    paddingVertical: 10,
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 10
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

module.exports = FormPage;