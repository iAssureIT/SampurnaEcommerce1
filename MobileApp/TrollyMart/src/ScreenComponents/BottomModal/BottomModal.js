import React, {useState} from 'react';
import {
  Modal,
  Text, 
  Dimensions,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Linking
} from 'react-native';
import {Header, Button, CheckBox, Icon} from 'react-native-elements';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles';
import {FormButton} from '../../ScreenComponents/FormButton/FormButton';
import DeviceInfo from 'react-native-device-info';
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher'
const window = Dimensions.get('window');
const pkg = DeviceInfo.getBundleId();
export const BottomModal = (props) => {
  const { visible, closeModal,navigation} = props;
  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    } else {
      IntentLauncher.startActivity({
        action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
        data: 'package:' + pkg
      })
    }
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          return closeModal();
        }}
        onDismiss={() => {
          return closeModal();
        }}
        transparent={true}
        visible={visible}>
          <TouchableOpacity
          activeOpacity={1}
          // onPress={() => {
          //   return closeModal();
          // }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
            padding: 0,
          }}>
          <View style={styles.topContainer}>
            <SafeAreaView forceInset={{bottom: 'always'}}>
              <View style={styles.titleContainer}>
                <Text style={CommonStyles.subHeaderText}>Turn On Location Services to Allow</Text>
                <Text style={CommonStyles.subHeaderText}>"KnockKnock" to Determine Your Location</Text>
                {/* <Icon name="md-close-circle" type="ionicon" color="#f00" /> */}
              </View>
              <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                <View style={{flex:0.48}}>
                  <FormButton
                    title       = {'Settings'}
                    onPress     = {()=>openAppSettings()}
                    background  = {false}
                    // icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                    // loading     = {btnLoading}
                    />
                </View>
                <View style={{flex:0.48}}>  
                   <FormButton
                    title       = {'Select Manually'}
                    onPress     = {()=>navigation.navigate('Location',{type:'Manual'})}
                    background  = {false}
                    // icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                    // loading     = {btnLoading}
                    />
                </View>    
              </View>  
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sortText: {
    // ...getFontStyleObject(),
    fontSize: 14,
  },
  topContainer: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 0.8,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    padding:15,
    paddingBottom:50
  },
  titleContainer: {
    // paddingHorizontal: `${3}%`,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.6,
    paddingVertical: `${10}%`,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems:"center"
  },
  body: {
    paddingHorizontal: `${2}%`,
    paddingVertical: `${2}%`,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});