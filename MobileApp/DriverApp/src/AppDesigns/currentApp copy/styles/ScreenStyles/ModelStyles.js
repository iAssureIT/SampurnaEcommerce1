import { StyleSheet, Dimensions, Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

    container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    justifyContent:"center"
  },
    formInputView: {
        width: '100%',
        paddingHorizontal: 15
    },
    loginTitleTxt: {
        fontSize: 22,
        color: '#333',
        fontFamily: "Montserrat-Bold",
    },
    modvw: {
        paddingHorizontal: '5%', 
        zIndex: 999 
    },
    modparent: {
        backgroundColor: "#fff", alignItems: 'center',
        borderRadius: 20, paddingVertical: 30,
        paddingHorizontal: 10 
    },
    modicn: {
        justifyContent: 'center', backgroundColor: "#34be34", 
        width: 50, height: 50, borderRadius: 25, overflow: 'hidden'
    },
    icnmod: {
        justifyContent: 'center', backgroundColor: "#ec971f",
         width: 50, height: 50, borderRadius: 25, overflow: 'hidden'
    },
    icnmodel: {
        justifyContent: 'center', backgroundColor: "#FAD162",
        width: 50, height: 50, borderRadius: 25, overflow: 'hidden' 
    },
    modmsghead: {
        fontFamily: 'Montserrat-Bold', fontSize: 16,
        textAlign: 'center', justifyContent: 'center', marginTop: 20
    },
    modsubhead: {
        fontFamily: 'Montserrat-Bold', fontSize: 16,
        textAlign: 'center', justifyContent: 'center', marginTop: 10 
    },
    modbtn: {
        borderBottomRightRadius:500,marginTop:15,flexDirection:'row'
    },
    modbtnstyle: {
        width:'100%',height:45,alignItems:'center',justifyContent:'center',borderRadius:50
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#aaa',
        height: 40,
        paddingLeft: 10,
        textAlignVertical: 'center',
        paddingTop: 0,
        paddingBottom: 0,
    },
    labelText: {
        top: 6,
        paddingLeft: 2,
    },
    button: {
        width: '75%',
        backgroundColor: colors.button,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    marginTB: {
        marginVertical: 20,
        // marginBottom: 20,
    },
    buttonText: {
        color: colors.buttonText,
        fontSize: 13,
        fontFamily: "Montserrat-Regular",
    },
    linkWrap: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    marginBottom30: {
        marginBottom: 30,
    },
    marginBottom20: {
        marginBottom: 20,
    },

    buttonContainer1: {
        width: '100%',
        ...Platform.select({
          ios:{
            justifyContent:'center',
          },
          android : {
            alignItems:'center'
          }
        }),
      
    },
    
    linkText: {
        fontSize: 15,
        fontFamily: "Montserrat-Regular",
    },
    errorWrapper: {
        width: '100%',
        marginBottom: -15
    },
    errorText: {
        color: '#dc3545',
        fontSize: 13,
        fontFamily: 'Montserrat-Regular'
    },
   
    button2: {
        width: '88%',
        backgroundColor: colors.buttonSignUp,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#f1f1f1',

    },
    buttonSignInText: {
        color: colors.buttonText1,
        borderRadius: 50,
        fontSize: 13,
        fontFamily: "Montserrat-Regular",
    },
    textTitleWrapper:{
        paddingHorizontal: 15, marginTop: 15, marginBottom:15
    },
   
});