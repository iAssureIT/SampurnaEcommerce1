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
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';
import commonStyles                 from '../../../AppDesigns/currentApp/styles/commonStyles.js';
import RootForgotPassword           from './RootForgotPassword.js';
import ValidationComponent          from "react-native-form-validator";

export default class ForgotPasswordOTP1 extends ValidationComponent {
  render() {
    const { navigate} = this.props.navigation;
    return (
      <React.Fragment>
        <ScrollView contentContainerStyle={commonStyles.container} keyboardShouldPersistTaps="always" >
         <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={commonStyles.container} resizeMode="cover" >
          <View style={{paddingHorizontal:20}}>
          <View style={styles.boxOpacity}>
                <View style={styles.syslogo}>
                      <Image
                      resizeMode="contain"
                      source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                      style={styles.syslogoimg}
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