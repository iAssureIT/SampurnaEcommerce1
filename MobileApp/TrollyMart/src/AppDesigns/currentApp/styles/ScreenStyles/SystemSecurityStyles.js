/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const window = Dimensions.get('window');

export default StyleSheet.create({
    marginBottom30: {
        marginBottom: 30,
    },

    marginTop30:{
        marginTop: 30
    },

    marginBottom20:{
        marginBottom: 20
    },

    inputBoxStyle:{
        paddingHorizontal: 15,
    },
    textTitleWrapper:{
        paddingHorizontal: wp(7),marginTop: Platform.OS==="ios" ? hp(3) : hp(3), marginBottom:hp(5.5)
    },
    boxOpacity:{
        width: '100%',borderColor:colors.theme,shadowColor: colors.theme,
        // backgroundColor:'#fff',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 8,
    },
    boxOpacity1:{
        width: '100%',borderColor:colors.theme,shadowColor: colors.theme,
        borderWidth:2,
        borderRadius:15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 8,
    },

    signupTitle:{
        fontSize:22,
        marginHorizontal:25,
        fontFamily:"Montserrat-Bold",
        color:"#000000",
        position:'absolute',
        top:-40,
    },

    syslogo1:{
        flexDirection: 'row', alignItems: "center",justifyContent:"center", marginHorizontal:wp(6),height:hp(17),marginTop:Platform.OS==="ios" ?10:0
    },
    syslogoimg1:{
        width: '50%',
        height:hp(11),
        alignSelf:'flex-start'
    },
    syslogo:{
        flexDirection: 'row', alignItems: "flex-start",alignSelf:'flex-start', marginHorizontal:wp(6),height:100,
    },
    syslogoLoginNEW:{
        flexDirection: 'row',marginTop:Platform.OS==='ios'?55:hp(3.5),marginHorizontal:20
    },
    textLine1:{
        fontFamily:"Montserrat-Regular",
        fontSize: RFPercentage(1.9),
        color:'#000',
    },
    syslogoimg:{
        width: '50%',
        height:80,        
    },
    syslogoimgLogin:{
        width: '50%',
        height:hp(14),        
    },
});
