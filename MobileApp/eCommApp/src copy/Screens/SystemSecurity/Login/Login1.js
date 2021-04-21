import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image, TextInput,
  Platform,
  Alert,
  AsyncStorage
} from 'react-native';
import RootLogin                    from './RootLogin.js';
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/LoginStyles.js';

export default class Login1 extends Component {

  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <View style={{backgroundColor : "red"}}>
          <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={styles.container} resizeMode="cover" >
          <View style={{paddingHorizontal:20}}>
              <View style={styles.loginopacity}>
                   {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop:-63}}>
                        <Image
                        resizeMode="contain"
                        source={require("../../../AppDesigns/currentApp/images/Background_2.png")}
                        style={{ width: '50%' }}
                        />
                   </View> */}
                   <View style={styles.loginlogo}>
                        <Image
                        resizeMode="contain"
                        source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                        style={styles.loginlogoimg}
                        />
                   </View>
              <RootLogin navigation={navigate} />
              </View>
            </View>
          </ImageBackground>
      </View>
    );
  }
}

