import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Image,
} from 'react-native';
import RootLogin       from './RootLogin.js';
import commonStyles    from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import styles          from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';

export default class Login1 extends Component {

  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <View style={{backgroundColor : "red"}}>
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
              <RootLogin navigation={navigate} />
              </View>
            </View>
          </ImageBackground>
      </View>
    );
  }
}

