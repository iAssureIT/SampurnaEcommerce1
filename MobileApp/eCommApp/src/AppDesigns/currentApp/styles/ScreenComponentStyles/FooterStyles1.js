import { StyleSheet,Platform } from 'react-native';
import { colors } from '../styles';

export default StyleSheet.create({
  footer: {
    ...Platform.select({
      ios: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 70,
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        },
        elevation: 24,
        borderColor: '#f1f1f1',
        justifyContent: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      },
      android: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        },
        elevation: 24,
        borderColor: '#f1f1f1',
        justifyContent: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
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
    backgroundColor: "#ed3c55",
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
    textAlign: 'center', fontFamily: "Montserrat-SemiBold", fontSize: 12
  },
  iconOuterWrapper: {
    flex: 0.5, backgroundColor: '#fff', borderTopLeftRadius: 25, padding: 10
  },
  notificationText: {

    ...Platform.select({
      ios: {
        position: 'absolute',
        right: 15,
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
        backgroundColor: colors.theme,
        fontFamily: "Montserrat-SemiBold",
      },
      android: {
        position: 'absolute',
        right: 18,
        top: -10,
        borderRadius: 9,
        width: 16,
        height: 18,
        textAlign: 'center',
        color: '#fff',
        fontSize: 10,
        paddingTop: 2,
        backgroundColor: colors.theme,
        fontFamily: "Montserrat-SemiBold",

      }
    })
  },

  iconOuterWrapper2: {
    flex: 0.5, backgroundColor: '#fff', borderTopRightRadius: 25, padding: 10
  }
});