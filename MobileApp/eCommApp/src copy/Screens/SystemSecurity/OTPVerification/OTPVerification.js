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
import RootOTPVerification from './RootOTPVerification.js';
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/OTPVerificationStyles.js';
import { colors, sizes }   from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import axios                      from 'axios';

export default class OTPVerification extends Component {
  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <React.Fragment>
        <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={styles.container} resizeMode="cover" >
        <View style={{paddingHorizontal:20}}>
          <View style={styles.otpvopacity}>
               {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop:-63}}>
                    <Image
                    resizeMode="contain"
                    source={require("../../../AppDesigns/currentApp/images/Background_2.png")}
                    style={{ width: '50%' }}
                    />
               </View> */}
               <View style={styles.otpvimgvw}>
                    <Image
                    resizeMode="contain"
                    source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                    style={styles.otpvimglogo}
                    />
               </View>
           <RootOTPVerification navigation={navigate} />
          </View>
        </View>
        </ImageBackground>
      </React.Fragment>
    );
  }
}

