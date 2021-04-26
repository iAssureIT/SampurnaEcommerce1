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

    textTitleWrapper:{
        paddingHorizontal: 15, marginTop: 15, marginBottom:15
    },

    boxOpacity:{
        width: '100%',borderColor:"#ccc",shadowColor: '#000',backgroundColor:"#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 8,
    },
    boxOpacity1:{
        width: '100%',borderColor:"#ccc",shadowColor: '#000',backgroundColor:"#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 8,
    },
    syslogo:{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center' 
    },
    syslogoimg:{
        width: '50%',height:80
    },
});
