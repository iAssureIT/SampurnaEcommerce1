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
import { KeyboardAwareScrollView }  from 'react-native-keyboard-aware-scroll-view';
import RootSignup                   from './RootSignup.js';
import commonStyles    from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import styles          from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';


const window = Dimensions.get('window');

export default class Signup1 extends Component {
  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <React.Fragment>
        <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={commonStyles.container} resizeMode="cover" >
        <ScrollView contentContainerStyle={[commonStyles.container]} keyboardShouldPersistTaps="always" >
           <View style={{paddingHorizontal:20,marginBottom:40,marginTop:40}}>
              <View style={styles.boxOpacity}>
                   <View style={styles.syslogo}>
                        <Image
                          resizeMode="contain"
                          source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                          style={styles.syslogoimg}
                        />
                   </View>
               <RootSignup navigation={navigate} />
              </View>
            </View>
        </ScrollView>
          </ImageBackground>
      </React.Fragment>
    );

  }
}

