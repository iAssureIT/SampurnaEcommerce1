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
        borderColor:"#d8ab46",
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
        backgroundColor: colors.button,
        height: 45,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius:50
    },
    buttonText1:{
        color: colors.buttonText,
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

    //Error Style
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

    // Common Text Styles
    headerText:{
        fontSize: 25, color:colors.theme, fontFamily: 'Montserrat-SemiBold',textAlign:'center'
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
});
