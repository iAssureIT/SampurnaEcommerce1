import { StyleSheet,Platform } from 'react-native';
import {colors} from '../styles.js';
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
        height: 70,
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
    textAlign: 'center', fontFamily: "Montserrat-SemiBold", fontSize: 10
  },

  iconOuterWrapper: {
    flex: 0.2, 
    backgroundColor: colors.cart, 
    marginTop:20,
    alignItems:'center',
    justifyContent:'center'
  },

  notificationText: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        right: 2,
        top: -10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 0,
        overflow: 'hidden',
        width: 16,
        height: 18,
        textAlign: 'center',
        color: '#fff',
        fontSize: 10,
        paddingTop: 2,
        backgroundColor: colors.red,
        fontFamily: "Montserrat-SemiBold",
      },
      android: {
        position: 'absolute',
        right: -5,
        top: -10,
        borderRadius: 9,
        width: 16,
        height: 18,
        textAlign: 'center',
        color: '#fff',
        fontSize: 10,
        paddingTop: 2,
        backgroundColor: colors.red,
        fontFamily: "Montserrat-SemiBold",
      }
    })
  },

  iconOuterWrapper: {
    flex: 0.2, 
    backgroundColor: 
    colors.cart, 
    marginTop:20,
    alignItems:'center',
    justifyContent:'center'
  },
});