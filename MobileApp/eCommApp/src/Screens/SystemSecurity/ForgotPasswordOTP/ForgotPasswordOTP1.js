import React from 'react';
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
import Modal                        from "react-native-modal";
import ValidationComponent          from "react-native-form-validator";

import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/ForgotPasswordOTPStyles.js';
import RootForgotPasswordOTP        from './RootForgotPasswordOTP.js';

export default class ForgotPasswordOTP1 extends ValidationComponent {
  render() {
    const { navigate,} = this.props.navigation;
    return (
      <React.Fragment>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" >
          <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={styles.container} resizeMode="cover" >
          <View style={{paddingHorizontal:20}}>
          <View style={{ 
               width: '100%', backgroundColor:'#fff',marginTop:10,borderColor:"#ccc",shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.8,
               shadowRadius: 2,
               elevation: 8,}}>
               {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop:-63}}>
                    <Image
                    resizeMode="contain"
                    source={require("../../../AppDesigns/currentApp/images/Background_2.png")}
                    style={{ width: '50%' }}
                    />
               </View> */}
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                    resizeMode="contain"
                    source={require("../../../AppDesigns/currentApp/images/KokilaBookstoreLogo.png")}
                    style={{ width: '50%',height:80 }}
                    />
               </View>
            <RootForgotPasswordOTP navigation={navigate} />
          </View>
        </View>
        </ImageBackground>
        </ScrollView>
      </React.Fragment>
    );
  }
}

