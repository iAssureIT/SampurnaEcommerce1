import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

  container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
    justifyContent:"center"
  },
  formContainer:{
    width:'100%',
    paddingHorizontal:15
  },
  formInputView: {
    width:'100%',
    paddingHorizontal:15,
  },
  signupopacity: {
    width: '100%', backgroundColor:'#fff',marginTop:80,borderColor:"#ccc",shadowColor: '#000',
                   shadowOffset: { width: 0, height: 2 },
                   shadowOpacity: 0.8,
                   shadowRadius: 2,
                   elevation: 8,
  },
  signuplogoimg:{
    width: '50%',height:80
  },
  signuplogovw:{
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center' 
  },
  signuptitle:{
    fontSize: 25, color:colors.theme, fontFamily: 'Montserrat-SemiBold',textAlign:'center',paddingVertical:10
  },
  signupemail:{
    borderWidth:1,borderColor:"#ccc",fontFamily: 'Montserrat-Regular',
  },
  headertitle:{
     fontSize: 20,
     marginTop:20
  },
    linkText:{
    color: colors.textLight,
    fontSize: 17,
    fontFamily:"Montserrat-Bold",
    fontWeight:600,
    textDecorationLine: 'underline'
  },
    linkLightText:{
    color: colors.textLight,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },
    loginTitleTxt:{
    fontSize: 22,
    color:'#333',
    fontFamily:"Montserrat-Bold",
  },
  marginTB:{
    marginVertical: 5,
  },
  linkWrap:{
    width: '100%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  linkText:{
    color: colors.primary,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
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
    marginBottom:-10
  },
  errorText:{
    color:'#dc3545',
    fontSize:12,
    fontFamily:'Montserrat-Regular',
  
  },
  successText:{
    color:'#28a745',
    fontSize:13,
    fontFamily:'Montserrat-Regular'
  },
  eyeWrapper:{
    width:'30%',
    justifyContent:'center',
    alignItems:'center',
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
     fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
  },
  buttonContainer1:{
    ...Platform.select({
      ios:{
        justifyContent:'center',
      },
      android : {
        justifyContent:'center'
      }
    })
  }
  
  
});
