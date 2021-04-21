import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image, 
} from 'react-native';
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/ForgotPasswordStyles.js';
import RootForgotPassword           from './RootForgotPassword.js';
import ValidationComponent          from "react-native-form-validator";

export default class ForgotPasswordOTP1 extends ValidationComponent {
  render() {
    const { navigate} = this.props.navigation;
    return (
      <React.Fragment>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" >
         <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={styles.container} resizeMode="cover" >
          <View style={{paddingHorizontal:20}}>
          <View style={styles.fpopacity}>
                   {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop:-63}}>
                        <Image
                        resizeMode="contain"
                        source={require("../../../AppDesigns/currentApp/images/Background_2.png")}
                        style={{ width: '50%' }}
                        />
                   </View> */}
                  <View style={styles.fpimgvw}>
                        <Image
                        resizeMode="contain"
                        source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                        style={styles.fpimglogo}
                        />
                  </View>
                  <RootForgotPassword navigation={navigate} />
              </View>
          </View>
          </ImageBackground>
        </ScrollView>
      </React.Fragment>
    );
  }
}