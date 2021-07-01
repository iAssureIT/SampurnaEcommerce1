import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../styles.js';
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
    // alignSelf:'center'
  },

  searchvw: {
    marginBottom: 10,
    height: 40,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between"
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
    backgroundColor: colors.theme,
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
  },

  flex1: {
    flex: 1,
  },

  flex09: {
    flex: 0.98
  },

  searchInputContainer: {
    backgroundColor: colors.white,
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
    height: 40
  },

  searchInput: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },

  location:{
    height:30,
    backgroundColor:colors.lightGrey,
    alignItems:"center",
    paddingHorizontal:5,
    flexDirection:"row",
    justifyContent:"space-between",
  },
  tabWrap:{
    width:120,
    flexDirection: 'row',
    height:35,
    alignSelf:"flex-end"
  },
  activeTabView:{
    flex:0.5,
    padding: 5,
    justifyContent:'center',
    alignItems:"center",
    backgroundColor: colors.cartButton,
    elevation: 6,
  },
  
  tabView:{
    flex:0.5,
    padding: 5,
    justifyContent:'center',
    alignItems:"center",
    backgroundColor: colors.lightGrey,
    elevation: 6,
  },
  
  tabBorder:{
    borderRightWidth:1,
    borderColor: colors.primary,
  },
  tabText:{
    fontSize: 12,
    color: colors.white,
    fontFamily: 'Roboto-Regular',
    marginLeft: 5
  },
  tabText1:{
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    marginLeft: 5
  },
  borderRadiusLeft:{
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  borderRadiusRight:{
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
