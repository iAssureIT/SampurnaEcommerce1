import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Input, Button, Icon, colors} from 'react-native-elements';
import {
  Text,
  
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
export const FormInput = props => {

  const {errors, touched, name, inputRef} = props;
  return (
    <Input
      placeholderTextColor={'#bbb'}
      ref = {inputRef}
      errorMessage={touched[name] && errors[name] ? errors[name] : ''}
      label={
        <Text style={{fontFamily:'Montserrat-Medium',color:'#000', fontSize: RFPercentage(1.8)}}>
          <Text>{props.labelName}</Text>{' '}
          <Text style={{color: 'red', fontSize: RFPercentage(1.8)}}>
            {props.required && '*'}
          </Text>
        </Text>
      }
      leftIcon={props.iconName ?<Icon name={props.iconName} size={20} color="black" type={props.iconType} /> : null}
      {...props}
      // containerStyle={{height:500}}
      inputContainerStyle= {styles.containerStyle}
      // leftIconContainerStyle={styles.leftIconContainerStyle}
      errorStyle={{ color: 'red' ,margin:0,fontSize:RFPercentage(1.8),fontFamily:"Montserrat-Regular"}}
      inputStyle={styles.inputPlace}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle:{
    // borderWidth:1,
    borderRadius:5,
    height:hp(4),
    // marginBottom:20,
    // marginVertical:5,
    borderColor:"#ccc",
    paddingHorizontal:0,
    
  },

  inputPlace:{
    fontSize:14,
    fontFamily:'Montserrat-Medium',
    textAlignVertical: "top",
    color:"#333"
  },

  leftIconContainerStyle:{
    // borderRightWidth:1,
    // borderColor:"#ccc",
    paddingLeft:15,
    paddingRight:15,
    margin:0,
  }
  
});