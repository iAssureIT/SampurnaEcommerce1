import React  from 'react';
import {StyleSheet}       from 'react-native';
import {Button}           from 'react-native-elements';
import { colors }         from '../../AppDesigns/currentApp/styles/styles.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
    marginVertical:hp(1),
  },
  buttonStyle:{
    backgroundColor:"#033554",
    height:hp(4.5),
    borderRadius: 8,
    // backgroundColor:colors.theme,
    // borderBottomRightRadius:0
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
    fontSize:RFPercentage(2.2),
    color:colors.white,
    opacity: 1,
    fontFamily:"Montserrat-Regular",
  },
  titleStyle1:{
    fontSize:RFPercentage(2.8),
    color:colors.theme,
    fontFamily:"Montserrat-Regular",
  },
  titleStyle2:{
    fontSize:RFPercentage(1.8),
    fontFamily:"Montserrat-Regular",
    color:colors.white
  }
  
});