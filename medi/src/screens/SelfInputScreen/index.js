import React, { Component, useEffect, useState } from 'react';
import react from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlightBase,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class CheckScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      uri: this.props.navigation.getParam('uri'),
      form_data: this.props.navigation.getParam('form_data'),
      getImg: '../../images/loginMain.png',
      medicineName: '',
      effect: '',
      capacity: '',
      validity: '',
      imgS3Uri: null,
      update: this.props.navigation.getParam('update'),
      item: this.props.navigation.getParam('item'),
      clickedDate: this.props.navigation.getParam('clickedDate'),
    };
  }

  async componentDidMount() {
    const getImg = await FileSystem.getInfoAsync(this.state.uri);
    console.log(getImg['uri']);
    this.setState({ getImg: getImg['uri'] });
  }

  redirectToAlarmScreen() {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios
          .post('http://127.0.0.1:5000/medicines/upload', this.state.form_data, {
            headers: {
              'content-type': 'multipart/form-data',
              Authorization: token,
            },
          })
          .then((res) => {
            console.log(res.data.results);
            this.setState({
              imgS3Uri: res.data.results,
            });
          })
          .then(() => {
            if (this.state.update === true) {
              this.props.navigation.navigate('AlarmUpdateScreen', {
                alarmMedicine: {
                  name: this.state.medicineName,
                  image_dir: this.state.imgS3Uri,
                  camera: false,
                  title: null,
                  effect: this.state.effect,
                  capacity: this.state.capacity,
                  validity: this.state.validity,
                },
                item: this.state.item,
                clickedDate: this.state.clickedDate,
              });
            } else {
              this.props.navigation.navigate('Alarm', {
                alarmMedicine: {
                  name: this.state.medicineName,
                  image_dir: this.state.imgS3Uri,
                  camera: false,
                  title: null,
                  effect: this.state.effect,
                  capacity: this.state.capacity,
                  validity: this.state.validity,
                },
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Alert.alert(
              '????????? ??????????????????!',
              '?????? ??????????????????',
              [
                {
                  text: '??????????????????',
                  onPress: () => this.redirectToAlarmScreen(),
                },
              ],
              { cancelable: false },
            );
          });
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          '????????? ??????????????????!',
          '?????? ??????????????????',
          [
            {
              text: '??????????????????',
              onPress: () => this.redirectToAlarmScreen(),
            },
          ],
          { cancelable: false },
        );
      });
  }

  render() {
    return (
      <View
        style={{
          height: window.height * 0.92 - 1,
          width: window.width - 40,
          marginLeft: 20,
          alignItems: 'center',
        }}
      >
        <ScrollView
          style={{
            height: window.height * 0.8,
            marginTop: 50,
          }}
        >
          <Image
            style={{
              width: window.width - 40,
              height: window.width - 40,
              borderRadius: 50,
            }}
            source={{ uri: this.state.getImg }}
          />
          <Text
            style={{
              fontSize: 20,
              color: '#313131',
              fontWeight: 'bold',
              marginTop: '5%',
              textAlign: 'center',
            }}
          >
            ?????? ????????????
          </Text>

          {/* -- ??? ?????? ?????? ??? -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.seclectText}>??? ??????</Text>
            <TextInput
              style={{
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 5,
                fontSize: 20,
                width: window.width - 40,
                paddingBottom: 5,
              }}
              placeholder="??? ????????? ??????????????? :)"
              placeholderTextColor={'gray'}
              maxLength={10}
              onChangeText={(medicineNameValue) =>
                this.setState({ medicineName: medicineNameValue })
              }
              defaultValue={this.state.medicineName}
            />
          </View>

          {/* -- ??????/?????? ?????? ?????? ??? -- */}
          <View style={styles.viewBox}>
            <Text style={styles.seclectText}>??????/??????</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="??????/????????? ???????????????!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(effectValue) => this.setState({ effect: effectValue })}
              defaultValue={this.state.effect}
            />
          </View>

          {/* -- ??????/?????? ?????? ?????? ??? -- */}
          <View style={styles.viewBox}>
            <Text style={styles.seclectText}>??????/??????</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="??????/????????? ???????????????!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(capacityValue) => this.setState({ capacity: capacityValue })}
              defaultValue={this.state.capacity}
            />
          </View>

          {/* -- ???????????? ?????? ?????? ??? -- */}
          <View style={styles.viewBox}>
            <Text style={styles.seclectText}>????????????</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="??????????????? ???????????????!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(validityValue) => this.setState({ validity: validityValue })}
              defaultValue={this.state.validity}
            />
          </View>

          {/* -- ?????? ?????? -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20, marginLeft: -20 }}>
            <TouchableOpacity
              onPress={() => {
                this.redirectToAlarmScreen();
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#6a9c90',
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>????????? ??????!</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  viewBox: {
    marginBottom: window.height * 0.005,
    width: window.width - 40,
    borderBottomWidth: 1,
    borderBottomColor: '#6A9C90',
    borderStyle: 'solid',
  },
  seclectText: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  inputBox: {
    textAlign: 'left',
    marginBottom: window.height * 0.015,
    marginTop: 5,
    fontSize: 18,
    width: window.width - 40,
    padding: 5,
    borderWidth: 1,
    borderColor: '#D7E4E1',
    borderStyle: 'solid',
  },
});