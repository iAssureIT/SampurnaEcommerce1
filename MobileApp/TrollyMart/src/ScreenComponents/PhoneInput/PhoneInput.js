import React, {useState,useRef} from 'react';
import {StyleSheet,Text,View,TouchableOpacity} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import PhoneInput from "react-native-phone-number-input";

export const FormPhoneInput = props => {
  const {errors, touched, name} = props;
  const phoneInput        = useRef(null);
  const [valid, setValid] = useState(false);
  const [value, setValue] = useState('');
  return (
      <View style={{marginHorizontal:10,marginVertical:5}}>
        <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 14,paddingVertical:2}}>
            <Text>{props.labelName}</Text>{' '}
            <Text style={{color: 'red', fontSize: 12}}>
            {props.required && '*'}
            </Text>
        </Text>
        <PhoneInput
            ref={phoneInput}
            defaultValue={""}
            defaultCode="AE"
            layout="first"
            // withDarkTheme
            // withShadow
            autoFocus
            containerStyle= {styles.containerStyle}
            textContainerStyle={styles.textContainerStyle}
            textInputStyle={styles.textInputStyle}
            errorStyle={{ color: 'red' ,margin:0}}
            inputStyle={{textAlignVertical: "top"}}
            onChangeFormattedText={(text) => {
                console.log("text",text);
                setValue(text)
                const checkValid = phoneInput.current?.isValidNumber(text);
                console.log("checkValid",checkValid);
                setValid(checkValid)
              }}
              {...props}
        />   
        <Text style={{fontSize:12,marginTop:2,color:"#f00"}}>{value ? !valid && "Enter a valid mobile number" :touched[name] && errors[name] ? errors[name] : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
 containerStyle:{
    borderWidth:1,
    borderRadius:5,
    width:"100%",
    borderColor:"#ccc",
    backgroundColor:"#fff"
  },
  textInputStyle:{
      height:50,
      paddingTop:15,
      backgroundColor:"#fff"
  },
  textContainerStyle:{
    height:50,
    padding:0,
    backgroundColor:"#fff"
  },
});