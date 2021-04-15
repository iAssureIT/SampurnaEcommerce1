import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
const window = Dimensions.get('window');

export default StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
    justifyContent:"center"
  },
  formInputView: {
    width:'100%',
    paddingHorizontal:15,
  },
  button:{
    width:'100%',
    backgroundColor: colors.button,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:5,

  },
  buttonText:{
    color: colors.buttonText,
     fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
  },
  buttonContainer:{
    ...Platform.select({
      ios:{
        justifyContent:'center',
      },
      android : {
        
      }
    })
  },
   button1:{
    width:'100%',
    backgroundColor: colors.buttonn,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:50

  },
  buttonText1:{
    color: colors.buttonTextt,
     fontSize: 13,
        fontFamily: "Montserrat-SemiBold",
    alignItems:'flex-start'
  },
  buttonContainer1:{
    marginTop:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
        

      },
      android : {
        justifyContent:'center'
      }
    })
  },
  textTitleWrapper:{
    paddingHorizontal: 15, marginTop: 15, marginBottom:15
  },
  linkLightText:{
    color: colors.textLight,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },
  loginopacity:{
    width: '100%', backgroundColor:'#fff',marginTop:20,borderColor:"#ccc",shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
  },
  loginlogo:{
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center' 
  },
  loginlogoimg:{
    width: '50%',
  },
  loginemail:{
    borderWidth:1,borderColor:"#ccc",fontFamily: 'Montserrat-Regular'
  },
  logintitle:{
    fontSize: 25, fontFamily: 'Montserrat-SemiBold',textAlign:'center' 
  },
  linkText:{
    color: colors.textLight,
    fontSize: 15,
    fontFamily:"Montserrat-SemiBold",
    textDecorationLine: 'underline'
  },

  marginBottom30: {
    marginBottom: 30,
  },

  marginTop30:{
    marginTop: 30
  },

  marginBottom20:{
    marginBottom: 20
  },

  errorWrapper:{
    width:'100%',
    marginBottom:-15
  },
  errorText:{
    color:'#dc3545',
    fontSize:12,
    marginTop:3,
    paddingLeft:25,
    fontFamily:'Montserrat-Regular'
  },
  eyeWrapper:{
    width:'30%',
    justifyContent:'center',
    alignItems:'center',
  },
});
