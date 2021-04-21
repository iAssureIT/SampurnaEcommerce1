import React, {component} from 'react';
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

import RootResetPassword    from './RootResetPassword.js';
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/ResetPasswordStyles.js';
import { colors, sizes }    from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import ValidationComponent  from "react-native-form-validator";

const window = Dimensions.get('window');

export default class ResetPassword1 extends ValidationComponent {
  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <React.Fragment>
         <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" >
            <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={styles.container} resizeMode="cover" >
            <View style={{paddingHorizontal:20}}>
              <View style={styles.resetopacity}>
                   {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop:-63}}>
                        <Image
                        resizeMode="contain"
                        source={require("../../../AppDesigns/currentApp/images/Background_2.png")}
                        style={{ width: '50%' }}
                        />
                   </View> */}
                   <View style={styles.resetimgvw}>
                        <Image
                        resizeMode="contain"
                        source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                        style={styles.resetimg}
                        />
                   </View>
              <RootResetPassword navigation = {navigate} />
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </React.Fragment>
    );
  }
}

