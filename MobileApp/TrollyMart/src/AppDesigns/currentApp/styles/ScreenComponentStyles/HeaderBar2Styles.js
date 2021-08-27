import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../styles.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const window = Dimensions.get('window');

export default StyleSheet.create({
  bellIcon: {
    paddingRight: 10,
  },

  whitename: {
    // backgroundColor:"#ff0",
    // marginTop:20,
    height: 40,
    width:120,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between"
    // alignSelf:'center'
  },

  searchvw: {
    flex:.65,
    // marginTop:10,
    paddingRight: 10,
  },

  notificationText: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        right: 4,
        top: -15,
        borderRadius: 29,
        width: 15,
        height: 15,
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
        backgroundColor: colors.theme,
        fontFamily: "Montserrat-Regular",


      },
      android: {
        position: 'absolute',
        right: -4,
        top: -10,
        borderRadius: 9,
        width: 18,
        height: 18,
        textAlign: 'center',
        color: colors.theme,
        fontSize: 12,
        backgroundColor: colors.white,
        fontFamily: "Montserrat-Regular",

      }
    })
  },

  notificationbell: {
    flexDirection: 'row',
    paddingLeft: 20,
    alignSelf: 'center',
    marginRight: 20,
  },

  flxdir: {
    flexDirection: 'row'
  },

  title: {
    color: '#fff',
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },

  container: {
    backgroundColor: colors.theme,
    borderBottomColor:colors.theme,
    justifyContent:'center',
    marginTop:5,
    alignItems:'center',
    ...Platform.select({
      ios: {
        minHeight: 110,
        // paddingTop: 25,
      },
      android: {
        borderTopWidth: 3,
        borderTopColor: colors.theme,
        minHeight: 55,
      }
    })
  },

  header2main: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: colors.theme,
    flexDirection:"row",
    ...Platform.select({
      ios: {
        alignItems:'center',
        justifyContent:'center',
        height:hp(8),
        // paddingTop: 25,
      },
      android: {
      alignItems:'center',
      justifyContent:'center',
      height:hp(10),
        // borderTopWidth: 3,
        // borderTopColor: colors.theme,
        // minHeight: 55,
      }
    })
  },

  leftside: {
    paddingHorizontal: 15,
    // marginTop:15
  },

  center: {
    //  paddingLeft: 0, paddingRight: 0,
     justifyContent:"center",
     alignItems:'center'
  },

  rightside: {
    //  paddingHorizontal: 15,
    //  justifyContent:"flex-end",
    //  alignItems:"flex-end"
    marginTop:5
  },

  searchContainer: {
    width: '100%',
    padding: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: colors.theme,
    justifyContent:'center'
  },

  flex1: {
    flex: 1,
  },

  flex09: {
    flex: 0.98
  },

  searchInputContainer: {
    backgroundColor: "#E7E7E7",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    height: hp(6),
  },

  searchInput: {
    fontSize: RFPercentage(2),
    fontFamily: "Montserrat-Regular",
    backgroundColor:'#E7E7E7'
  },

  location:{
    flex:.3,
    height:hp(6),
    padding:hp(1),
    backgroundColor:'#E7E7E7',
    borderRadius:5,
    // paddingHorizontal:5,
    flexDirection:"row",
    justifyContent:"space-between",
    ...Platform.select({
      ios: {
        // marginBottom:10,
        // paddingTop: 25,
      },
      android: {
        // borderTopWidth: 3,
        // borderTopColor: colors.theme,
        // minHeight: 55,
      }
    })
  },
  cancelbtn:{
    flexDirection:'row',marginTop:20,paddingRight:10
  },
  buttonRED:{
    backgroundColor: colors.buttonRED,
    height: 45,
    width:"100%",
  },
  ordervwbtn:{
    flex:0.5,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
  },
  cancelvwbtn:{
    flex:0.5,marginRight:10,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  button1:{
    backgroundColor: colors.button1,
    height: 45,
    width:"100%",
  },
  
});
