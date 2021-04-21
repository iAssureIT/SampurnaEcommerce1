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
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/SignupStyles.js';
import { colors, sizes }            from '../../../AppDesigns/currentApp/styles/CommonStyles.js';


const window = Dimensions.get('window');

export default class Signup1 extends Component {
  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <React.Fragment>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" >
        {/* <ImageBackground source={require("../../../AppDesigns/currentApp/images/loginModal.png")} style={styles.container} resizeMode="cover" > */}
           <View style={{paddingHorizontal:20,marginBottom:40,}}>
              <View style={styles.signupopacity}>
                   {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop:-63}}>
                        <Image
                        resizeMode="contain"
                        source={require("../../../AppDesigns/currentApp/images/Background_2.png")}
                        style={{ width: '50%' }}
                        />
                   </View> */} 
                   <View style={styles.signuplogovw}>
                        <Image
                          resizeMode="contain"
                          source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                          style={styles.signuplogoimg}
                        />
                   </View>
               <RootSignup navigation={navigate} />
              </View>
            </View>
          {/* </ImageBackground> */}
        </ScrollView>
      </React.Fragment>
    );

  }
}

