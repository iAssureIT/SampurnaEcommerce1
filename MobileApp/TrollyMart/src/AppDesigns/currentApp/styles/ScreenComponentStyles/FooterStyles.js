import { StyleSheet,Platform } from 'react-native';
import {colors} from '../styles.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { trackEvent } from 'appcenter-analytics';

export default StyleSheet.create({
  footer: {
    ...Platform.select({
      ios: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 100,
      },
      android: {
        width: '100%',
        position: 'absolute',
        // backgroundColor:"#fff",
        bottom: 0,
        height: hp(10.5),
        // flexDirection: 'row',
        // backgroundColor:"#fff",
        // // backgroundColor: colors.footerColor,
        // // shadowRadius: 2,
        // // shadowOffset: {
        // //   width: 0,
        // //   height: -3,
        // // },
        // // shadowColor: '#000000',
        // // borderColor: '#eee',
        // justifyContent: 'center',
        // // borderTopLeftRadius: 25,
        // // borderTopRightRadius: 25,
        // // borderWidth:1,
        // // elevation:23
      }
    }),
  },

  outerWrapper: {
    borderWidth: 1,
    borderColor: '#ed3c55',
    backgroundColor: '#ed3c55',
    padding: 10,
    borderRadius: 50,
  },

  Wrapper: {
    justifyContent:'center',
    backgroundColor: colors.theme,
    alignSelf: "center",
    position: "absolute",
    zIndex: 100,
    bottom: 25,
    borderWidth: 10,
    borderColor: '#DCDCDC',
    borderRadius: 100,
    padding: 5,
  },

  footerTitle: {
    textAlign: 'center', fontFamily: "Montserrat-SemiBold", fontSize: RFPercentage(1.5)
  },

  notificationText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: RFPercentage(1.5),
    fontFamily: "Montserrat-SemiBold",
    alignSelf:"center"
  },
  notificationView:{
    position: 'absolute',
    right:  hp(-1),
    top: hp(-2),
    borderRadius: hp(2),
    width: hp(2.5),
    height: hp(2.5),
    justifyContent: 'center',
    backgroundColor: colors.red,
  },

  iconOuterWrapper: {
    flex: 0.2, 
    backgroundColor: colors.cart, 
    marginTop:hp(3),
    alignItems:'center',
    justifyContent:'center'
  },
});