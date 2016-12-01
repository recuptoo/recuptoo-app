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
const CategoryPicker = require('../component/CategoryPicker');

const { width, height } = Dimensions.get('window');
const imageSize = ((width / 2) - 20);

class FormPage extends Component {
  state = {
    categories: [],
    description: '',
    error: false,
    errorMessage: '',
  };
  componentWillMount() {
    API.getCategories().then(categories => this.setState({categories}));
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

    let alert = <View />
    if (this.state.error) {
      alert = (
        <View style={styles.alert}>
          <Text style={styles.alertText}>{this.state.errorMessage}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={{padding: 10}}>
          <Image
            style={{width: imageSize, height: imageSize, resizeMode: Image.resizeMode.contain}}
            source={{uri: this.props.image}} />
          {alert}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={{height: 40}}
              onChangeText={(description) => this.setState({description})}
              value={this.state.description}
              placeholder={'Armoire, chaise, table basse…'} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Catégorie</Text>
            <CategoryPicker
              ref={ref => { this.categoryPicker = ref; }}
              multiple={false}
              categories={this.state.categories} />
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
            this.setState({
              error: false,
              errorMessage: '',
            });

            let categories = this.categoryPicker.getCategories();
            if (categories.length === 0) {
              this.setState({
                error: true,
                errorMessage: 'Veuillez sélectionner une catégorie',
              });
              return;
            }

            let data = {
              category: '/api/categories/' + categories[0],
              description: this.state.description,
              coordinates: this.props.coordinates,
              image: this.props.image,
            }
            API.createObject(data, this.props.image)
              .then((object) => {
                console.log('Object created!', object);
                navigator.parentNavigator.resetTo({id: 'MapPage', name: 'Map'})
              })
              .catch((error) => {
                if (error['@type'] && error['@type'] === 'ConstraintViolationList') {
                  this.setState({
                    error: true,
                    errorMessage: 'Veuillez compléter le formulaire',
                  });
                } else {
                  this.setState({
                    error: true,
                    errorMessage: "Une erreur s'est produite",
                  });
                }
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
  },
  alert: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 5,
    borderColor: '#c0392b',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
  },
  alertText: {
    color: '#fff'
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