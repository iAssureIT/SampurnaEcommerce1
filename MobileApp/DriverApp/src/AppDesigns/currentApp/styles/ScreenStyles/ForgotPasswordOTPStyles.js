import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
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
        width: '100%',
        paddingHorizontal: 15,
 
    },
    labelText:{
        top:6,
        paddingLeft:2,
    },
    otpvopacity:{
        width: '100%', backgroundColor:'#fff',borderColor:"#ccc",shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 8,
      },
    button:{
        width:'100%',
        backgroundColor: colors.button,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:5
    },
    marginTB:{
        marginVertical: 10,
    },
    otpvimgvw:{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center' 
    },
    otpvimglogo:{
        width: '50%',height:80 
    },
    otpvtitle:{
        fontSize: 25, color:colors.theme, fontFamily: 'Montserrat-SemiBold',textAlign:'center' 
    },
    otpvsubtitle:{
        fontSize: 17, fontFamily: 'Montserrat-Regular' 
    },
    buttonText:{
        color: colors.buttonText,
        fontSize: 15,
        fontFamily:"Montserrat-SemiBold",
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
    formWrapper:{
        
    },
    otpText:{
        fontFamily:"Montserrat-Regular",
        fontSize: 15
    },
    otpInputWrap:{
        flexDirection:'row',
        paddingTop:10,
        justifyContent:'center',
        alignContent :'center',
        alignItems:'center'

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
    buttonContainer:{
        ...Platform.select({
            ios:{
                justifyContent:'center',

            },
            android : {
                justifyContent:'center',

            }
        })
    },
    marginBottom20:{
        marginBottom : 20
    },
    button1Container:{
        ...Platform.select({
            ios:{
                justifyContent:'center',

            },
            android : {
              
            }
        })
    },
    modalGreen1:{
      backgroundColor: colors.buttonGreen,
      height: 45,
      width:"100%",
      },
    yesmodalbtn: {
        marginTop: 15,
        marginBottom: 0,
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
  },
    buttonSignUp:{
        width:'75%',
        backgroundColor: colors.buttonSignUp,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:50,
        borderWidth:1,
        borderColor:'#333'
    },
    buttonSignInText:{
        color: colors.buttonText1,
        borderRadius:50,
        fontSize:13,
        fontFamily:"Montserrat-Regular",
    },
    textTitleWrapper:{
        paddingHorizontal: 15, marginTop: 15, marginBottom:15,textAlign:'center',
    },
    textStyle:{
        textAlign:'center',
    },
    buttonText1:{
    color: colors.buttonTextt,
     fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
  },
  button1:{
    width:'100%',
    backgroundColor: colors.buttonn,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:50
  },
  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color:"#333"
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});



// import { StyleSheet, Dimensions,Platform } from 'react-native';
// import {colors} from '../styles.js';
// const window = Dimensions.get('window');

// export default StyleSheet.create({
//     container:{
//     backgroundColor: '#fff',
//     minHeight:'100%',
//     justifyContent:"center"
//   },
//     formInputView: {
//         width: '100%',
//         paddingHorizontal: 15
//     },
//     labelText:{
//         top:6,
//         paddingLeft:2,
//     },
    
//     marginTB:{
//         marginVertical: 10,
//     },

//     linkWrap:{
//         width: '100%',
//         flexDirection:'row',
//         justifyContent:'space-between',
//     }, 
//     linkText:{
//         fontSize: 15,
//         fontFamily:"Montserrat-Regular",
//     },
   
//     otpWrap:{
//         marginBottom:30,
//     },
//     otpText:{
//         fontFamily:"Montserrat-Regular",
//         fontSize: 15
//     },
//     otpInputWrap:{
//         flexDirection:'row',
//         paddingTop:10
//     },

//     otpInput:{
//         width:40,
//         height:40,
//         borderWidth:1,
//         borderColor:colors.border,
//         borderRadius: 3,
//         marginRight: 5,
//     },
//     loginTitleTxt:{
//         fontSize: 22,
//         color:'#333',
//         fontFamily:"Montserrat-Bold",
//     },
   
//     marginBottom20:{
//         marginBottom : 20
//     },

//     textTitleWrapper:{
//         paddingHorizontal: 15, marginTop: 15, marginBottom:15
//     },
//     button:{
//     width:'100%',
//     backgroundColor: colors.button,
//     height: 45,
//     alignSelf: 'center',
//     justifyContent: 'center',
//     borderRadius:5

//   },
//   buttonText:{
//     color: colors.buttonText,
//     fontSize: 15,
//     fontFamily: "Montserrat-SemiBold",
//   },
//   buttonContainer:{
    
//     ...Platform.select({
//       ios:{
//         justifyContent:'center',
//       },
//       android : {
        
//       }
//     })
//   },
//    button1:{
//     width:'100%',
//     backgroundColor: colors.buttonn,
//     height: 45,
//     alignSelf: 'center',
//     justifyContent: 'center',
//     borderRadius:5
//   },
//   buttonText1:{
//     color: colors.buttonTextt,
//     fontSize: 15,
//         fontFamily: "Montserrat-SemiBold",
//     alignItems:"center"
//   },
//   buttonContainer1:{
//     marginBottom:15,
//     ...Platform.select({
//       ios:{
//         justifyContent:'center',
//       },
//       android : {
//         justifyContent:'center'
//       }
//     })
//   },
// });