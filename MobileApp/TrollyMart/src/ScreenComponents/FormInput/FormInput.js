import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import {
  Text,
  
} from 'react-native';
export const FormInput = props => {
  const {errors, touched, name} = props;
  return (
    <Input
      placeholderTextColor={'#bbb'}
      inputStyle={[styles.inputPlace]}
      errorMessage={touched[name] && errors[name] ? errors[name] : ''}
      label={
        <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 12,}}>
          <Text>{props.labelName}</Text>{' '}
          <Text style={{color: 'red', fontSize: 12}}>
            {props.required && '*'}
          </Text>
        </Text>
      }
      leftIcon={props.iconName ?<Icon name={props.iconName} size={20} color="black" type={props.iconType} /> : null}
      {...props}
      inputContainerStyle= {styles.containerStyle}
      // leftIconContainerStyle={styles.leftIconContainerStyle}
      errorStyle={{ color: 'red' ,margin:0}}
      inputStyle={{textAlignVertical: "top"}}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle:{
    // borderWidth:1,
    borderRadius:5,
    height:30,
    // marginBottom:20,
    // marginVertical:5,
    // borderColor:"#ccc",
    paddingHorizontal:0,
    
  },

  inputPlace:{
    fontSize:8,
    fontFamily:'Montserrat-SemiBold'
  },

  leftIconContainerStyle:{
    // borderRightWidth:1,
    // borderColor:"#ccc",
    paddingLeft:15,
    paddingRight:15,
    margin:0,
  }
  
});