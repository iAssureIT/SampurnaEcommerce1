import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from './styles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
const window = Dimensions.get('window');

export default StyleSheet.create({
    // Screen Container
    container:{
        minHeight:'100%',
        width: window.width,
        justifyContent:"center"
    },

    //Form Input Style
    formInputView: {
        width:'100%',
        paddingHorizontal:15,
    },
    inputContainer:{
        borderWidth:1,
        borderColor:colors.inputBorderColor,
        fontFamily: 'Montserrat-Regular',
        backgroundColor:colors.inputBackgroundColor
    },
    labelStyle:{
        color:colors.labelStyle
    },

    //Button Style
    button:{
        width:'100%',
        backgroundColor: colors.button,
        height: 45,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius:0,
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
        backgroundColor: colors.button,
        height: 45,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius:0
    },
    buttonText1:{
        color: colors.buttonText,
        fontSize: 13,
        fontFamily: "Montserrat-Medium",
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

    //Error Style
    errorWrapper:{
        width:'100%',
        marginBottom:-15
    },
    errorText:{
        color:'#dc3545',
        fontSize:12,
        marginTop:3,
        fontFamily:'Montserrat-Regular'
    },
    eyeWrapper:{
        width:'30%',
        justifyContent:'center',
        alignItems:'center',
    },
    successText:{
        color: colors.success,
        fontSize: 12,
        fontFamily:"Montserrat-Regular",
      },
      errorText:{
        color: colors.errorText,
        fontSize: 12,
        fontFamily:"Montserrat-Regular",
      },

    // Common Text Styles
    headerText:{
        fontSize: 17, fontFamily: 'Montserrat-SemiBold',alignSelf:'center',paddingVertical:5,color:"#333"
    },
    subHeaderText :{
        fontSize: 15, fontFamily: 'Montserrat-SemiBold',alignSelf:"center",color:"#333"
    },
    label :{
        fontSize: 15, fontFamily: 'Montserrat-SemiBold',color:"#333"
    },
    text :{
        fontSize: 15, fontFamily: 'Montserrat-Regular',color:"#333"
    },
    linkText:{
        color: colors.textLight,
        fontSize: 15,
        fontFamily:"Montserrat-SemiBold",
        textDecorationLine: 'underline'
    },
    linkLightText:{
        color: colors.textLight,
        fontSize: 15,
        fontFamily:"Montserrat-Regular",
    },
    noDataFound :{
        fontSize: 20, fontFamily: 'Montserrat-SemiBold',alignSelf:"center",color:"#333"
    },


    //add Button Style
    addBtnStyle: {
		backgroundColor: colors.cartButton,
		minHeight: 30,
		width: "100%",
    },
    addBtnText:{
        fontFamily:"Montserrat-Regular",
        fontSize  : 12
    },
    addBtnContainer:{
        // marginTop:15,
        padding:15
        // alignSelf:'fl'
        // alignSelf:'center',
    } 
});
