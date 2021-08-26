import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from './styles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const window = Dimensions.get('window');

export default StyleSheet.create({
    // Screen Container
    container:{
        height:"100%",
        width: window.width,
        backgroundColor:"#fff",
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
        fontSize: 15, fontFamily: 'Montserrat-SemiBold',color:"#333",lineHeight:19
    },
    text :{
        fontSize: 15, fontFamily: 'Montserrat-Regular',color:"#333"
    },
    linkText:{
        color: colors.cartButton,
        fontSize: 10,
        fontFamily:"Montserrat-SemiBold",
        // textDecorationLine: 'underline'
    },
    linkLightText:{
        color: colors.textLight,
        fontSize: 15,
        fontFamily:"Montserrat-Regular",
    },
    noDataFound :{
        fontSize: 20, fontFamily: 'Montserrat-SemiBold',alignSelf:"center",color:"#333"
    },
    screenHeader:{
        fontSize:18,
        fontFamily:"Montserrat-Bold",
        color:'#000',
        lineHeight:22
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

    formWrapper:{
        paddingHorizontal:20,
    },
    addBtnContainer:{
        // marginTop:15,
        paddingVertical:15
        // alignSelf:'fl'
        // alignSelf:'center',
    },
    card1:{
        backgroundColor: '#E5EAEE',   
        borderRadius:7,
    },
    cardTop:{
        flexDirection:'row',
        borderTopLeftRadius:7,
        borderTopRightRadius:7,
        marginBottom:5,
        backgroundColor:'#033554',
        height:44,
        alignItems:'center',
        paddingHorizontal:15
    },
    cardBottom:{
        flexDirection:"row",
        marginBottom:5,      
    },
    cardTopText:{
        fontFamily: "Montserrat-SemiBold",
        color:'#fff',
        fontSize:RFPercentage(2.2)
    },
    cardTopText2:{
        fontFamily: "Montserrat-SemiBold",
        color:'#fff',
        fontSize:RFPercentage(1.8)
    },
    boxLine1:{
        color:'#033554',
        fontFamily: "Montserrat-Regular",
        fontSize:RFPercentage(1.8),
    },    
    boxLine1W:{
        color:'#fff',
        fontFamily: "Montserrat-Regular",
        fontSize:RFPercentage(1.8),
    },
    boxLine2:{
        color:'#033554',
        fontFamily: "Montserrat-Regular",
        fontSize:RFPercentage(1.8),
        alignSelf:'flex-end'
    },
    boxLine1C:{
        color:'#033554',
        fontFamily: "Montserrat-SemiBold",
        fontSize:RFPercentage(2.2),
    },
    boxLine2C:{
        color:'#033554',
        fontFamily: "Montserrat-Regular",
        fontSize:14,
        alignSelf:'flex-end'
    },
    CardBS1:{
        flex:0.5,
        paddingLeft:15,
        paddingRight:7,
        borderRightWidth:0.25,
        borderColor:'#ccc'
    },
    CardBS2:{
        flex:0.5,
        paddingLeft:7,
        paddingRight:15,
        borderLeftWidth:0.25,
        borderColor:'#ccc'
    },
    completeDate:{
        color:'#000',
        fontFamily: "Montserrat-Bold",
        fontSize:15,
        opacity: 0.5
    },
    totalcount:{
        color:'#000',
        fontFamily: "Montserrat-Bold",
        fontSize:15,
    },
    completeBlueText:{
        color:'#033554',
        fontFamily: "Montserrat-SemiBold",
        fontSize:13,
    },
    completeBlueTextB:{
        color:'#033554',
        fontFamily: "Montserrat-SemiBold",
        fontSize:16,
    }
});