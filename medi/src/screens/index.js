import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useAsyncStorage } from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

export default class CheckScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      uri: this.props.navigation.getParam('uri'),
      form_data: this.props.navigation.getParam('form_data'),
      getImg: '../../img/loginMain.png',
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
          height: window.height * 0.9,
          width: window.width - 40,
          marginLeft: 20,
          alignItems: 'center',
          marginTop: getStatusBarHeight(),
        }}
      >
        <ScrollView
          style={{
            height: window.height * 0.8,
          }}
        >
          <Image
            style={{
              width: window.width - 40,
              height: window.width - 40,
              borderRadius: 50,
              marginTop: verticalMargin,
            }}
            source={{ uri: this.state.getImg }}
          />

          <Text
            style={{
              fontSize: 20,
              color: '#313131',
              fontWeight: 'bold',
              marginTop: '5%',
              marginBottom: '5%',
              textAlign: 'center',
            }}
          >
            ?????? ????????????
          </Text>

          {/* -- ??? ?????? ?????? ??? -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>??? ??????</Text>

            <TextInput
              style={styles.textInputStyle}
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
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>??????/??????</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="??????/????????? ???????????????!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(effectValue) => this.setState({ effect: effectValue })}
              defaultValue={this.state.effect}
            />
          </View>

          {/* -- ??????/?????? ?????? ?????? ??? -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>??????/??????</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="??????/????????? ???????????????!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(capacityValue) => this.setState({ capacity: capacityValue })}
              defaultValue={this.state.capacity}
            />
          </View>

          {/* -- ???????????? ?????? ?????? ??? -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>????????????</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="??????????????? ???????????????!"
              placeholderTextColor={'gray'}
              maxLength={30}
              onChangeText={(validityValue) => this.setState({ validity: validityValue })}
              defaultValue={this.state.validity}
            />
          </View>

          {/* -- ?????? ?????? -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
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
                  backgroundColor: '#76a991',
                  borderRadius: window.height * 0.075,
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
  textInputBox: {
    marginBottom: verticalMargin,
    borderBottomWidth: 1,
    borderBottomColor: '#76a991',
    borderStyle: 'solid',
    width: window.width - 40,
    paddingBottom: window.height * 0.015,
  },
  textInputTitle: {
    fontSize: 18,
    fontWeight: '200',
    color: '#626262',
    paddingLeft: 5,
  },
  textInputStyle: {
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    fontSize: 16,
    width: window.width - 60,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
  },
});