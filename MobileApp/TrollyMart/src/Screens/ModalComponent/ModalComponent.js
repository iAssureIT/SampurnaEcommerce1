import React from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert
} from 'react-native';
import styles from './styles.js';
import Ripple from 'react-native-material-ripple';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import Loading from '../../layouts/Loading/Loading.js';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get('window');

export default class ModalComponent extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  

  render() {


    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
          <View>
               <Modal isVisible={this.state.openModal}
                    onBackdropPress={() => this.setState({ openModal: false })}
                    coverScreen={true}
                    hideModalContentWhileAnimating={true}
                    style={{ paddingHorizontal: '5%', zIndex: 999 }}
                    animationOutTiming={500}>
                    <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10 }}>
                         <View style={{ justifyContent: 'center', backgroundColor: "#34be34", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
                              <Icon size={30} name='check' type='fontAwesome5' color='#fff' style={{}} />
                         </View>
                         <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                              Congratulations! Account Created
                         </Text>
                         <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center' }}>
                              Let's get to work.
                         </Text>
                         <View style={{borderBottomRightRadius: 500, marginTop: 15, flexDirection: 'row' }}>
                              <Button
                              onPress={this.goToLogin.bind(this)}
                              titleStyle={styles.buttonText}
                              title="Let's Go!"
                              buttonStyle={{ width: '100%', height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                              containerStyle={styles.buttonContainer}
                              />
                         </View>
                    </View>
               </Modal>
          </View>
     </ScrollView>
    );
  }
}
