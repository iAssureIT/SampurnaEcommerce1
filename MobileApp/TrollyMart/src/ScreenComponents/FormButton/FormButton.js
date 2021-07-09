import React  from 'react';
import {StyleSheet}       from 'react-native';
import {Button}           from 'react-native-elements';
import { colors }         from '../../AppDesigns/currentApp/styles/styles.js';
export const FormButton = props => {
  const {title,background,...rest} = props;
  return (
    <Button
      title           = {title}
      containerStyle  = {styles.containerStyle}  
      buttonStyle     = {background ? styles.buttonStyle : styles.buttonStyle2}
      titleStyle      = {background ? styles.titleStyle : styles.titleStyle2}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle:{
    width :'100%',
    alignSelf:"center",
    // marginVertical:15,
  },
  buttonStyle:{
    backgroundColor:"#033554",
    // backgroundColor:colors.theme,
    borderRadius:9,
  },
   buttonStyle1:{
    backgroundColor:colors.white,
    // borderRadius:100,
    borderWidth:1,
    borderColor:colors.theme,
    color:colors.theme,
  },
  buttonStyle2:{
    backgroundColor:"#033554",
    // backgroundColor:colors.theme,
    borderRadius:4,
  },
  titleStyle:{
    fontSize:12,
    color:colors.white
  },
  titleStyle1:{
    fontSize:18,
    color:colors.theme
  },
  titleStyle2:{
    fontSize:12,
    color:colors.white
  }
  
});