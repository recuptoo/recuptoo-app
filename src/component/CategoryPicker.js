import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'underscore';

class CategoryPicker extends Component {
  static defaultProps = {
    multiple: true,
    categories: [],
    selectedCategories: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedCategories: props.selectedCategories || [],
    };
  }
  getCategories() {
    return this.state.selectedCategories;
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
      <TouchableOpacity
        onPress={() => {
          let selectedCategories = this.state.selectedCategories;
          if (_.contains(selectedCategories, category.id)) {
            selectedCategories = _.without(selectedCategories, category.id);
          } else {
            if (this.props.multiple) {
              selectedCategories.push(category.id);
            } else {
              selectedCategories = [category.id];
            }

          }
          this.setState({selectedCategories});
        }}>
        <View style={styles.row}>
          <Text style={styles.rowText}>{category.name}</Text>
          {icon}
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View>
        <ListView
          enableEmptySections
          dataSource={dataSource.cloneWithRows(this.props.categories)}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  rowText: {},
  rowCheck: {
    position: 'absolute',
    right: 10,
  }
});

module.exports = CategoryPicker;