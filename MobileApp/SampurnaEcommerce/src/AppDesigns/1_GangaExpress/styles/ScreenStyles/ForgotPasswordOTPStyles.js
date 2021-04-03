import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
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
    labelText:{
        top:6,
        paddingLeft:2,
    },
    
    marginTB:{
        marginVertical: 10,
    },

    linkWrap:{
        width: '100%',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    linkText:{
        fontSize: 15,
        fontFamily:"Montserrat-Regular",
    },
   
    otpWrap:{
        marginBottom:30,
    },
    otpText:{
        fontFamily:"Montserrat-Regular",
        fontSize: 15
    },
    otpInputWrap:{
        flexDirection:'row',
        paddingTop:10
    },

    otpInput:{
        width:40,
        height:40,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius: 3,
        marginRight: 5,
    },
    loginTitleTxt:{
        fontSize: 22,
        color:'#333',
        fontFamily:"Montserrat-Bold",
    },
   
    marginBottom20:{
        marginBottom : 20
    },

    textTitleWrapper:{
        paddingHorizontal: 15, marginTop: 15, marginBottom:15
    },
    button:{
    width:'100%',
    backgroundColor: colors.button,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:5

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
    borderRadius:5
  },
  buttonText1:{
    color: colors.buttonTextt,
    fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
    alignItems:'flex-start'
  },
  buttonContainer1:{
    marginBottom:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
      },
      android : {
        justifyContent:'center'
      }
    })
  },
});