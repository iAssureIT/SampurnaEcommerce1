import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
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
        paddingHorizontal: 30, marginTop: 10, marginBottom:40
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
        flexDirection: 'row', alignItems: "center",justifyContent:"center", marginHorizontal:20,height:180
    },
    syslogoimg1:{
        width: '50%',
        height:100,
    },
    syslogo:{
        flexDirection: 'row', alignItems: "flex-start", marginHorizontal:20,height:200
    },
    textLine1:{
        fontFamily:"Montserrat-Regular",
        fontSize: 14,
        color:'#000',
    },
    syslogoimg:{
        width: '50%',
        height:150
    },
});
