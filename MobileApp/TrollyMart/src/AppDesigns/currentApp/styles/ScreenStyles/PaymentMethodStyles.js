import { StyleSheet, Dimensions, Platform } from 'react-native';
import {colors} from '../styles.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const window = Dimensions.get('window');

export default StyleSheet.create({
  menuWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    flex: 1
  },
  superparent: {
    flex: 1, 
    backgroundColor: '#fff',
    paddingBottom:hp(6.5),
  },
  parent: {
    backgroundColor: '#fff', 
    // marginBottom: "15%",
    // minHeight: 750,
  },
  width160: {
    width: 160
  },
  orderbrdr:{
    // flex:1,
    // flexDirection:"row",
    // backgroundColor: "red",
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    // paddingBottom:15,
    paddingHorizontal:hp(5),
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  flx7:{
    flex:0.9
  },
  flx3:{
    // flex:0.9,
    flexDirection:"row",
    height:hp(7),
    paddingHorizontal:wp(1),
    backgroundColor:'#F9F9F9',
    marginBottom:hp(2),
    borderRadius:5,
    alignItems:'center',
    elevation:4
  },
  catimg: {
    height: 200, width: 160,
  },
  peroff: {
    backgroundColor: '#666', 
    position: 'absolute', 
    bottom: "5%", 
    borderWidth: 1,
    padding: 3, 
    borderColor: '#666', 
    borderRadius: 5, 
    color: '#fff', 
    marginLeft: 10
  },
  padvert: {
    paddingVertical: 10,
  },
  buttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
  },
  prodtitle: {
    fontSize: 12, fontFamily: "Montserrat-SemiBold", color: '#333'
  },
  free: {
    fontSize: RFPercentage(2.2), fontFamily: "Montserrat-SemiBold", color: '#000',marginLeft:10
  },
  freeL2: {
    fontSize: RFPercentage(1.8), fontFamily: "Montserrat-Regular", color: '#A6A6A6',marginLeft:10
  },
  radiobtn: {
    fontSize: RFPercentage(2.2),padding:0,margin:0
  },
  prodname: {
    flex: 1, fontSize: 13, flexWrap: "wrap", fontFamily: "Montserrat-Regular", color: '#666', paddingVertical: 5
  },
  rs: {
    flexDirection: "row", 
    marginTop: 3
  },
  rsicn: {
    marginTop: 5, 
    marginRight: 3
  },
  rsprice: {
    textDecorationLine: 'line-through', 
    fontSize: 12, 
    fontFamily: "Montserrat-SemiBold", 
    marginLeft: 10
  },
  iconvw: {
    justifyContent: 'center', 
    backgroundColor: "#f00", 
    width: 25, height: 25, 
    borderRadius: 25, 
    overflow: 'hidden'
  },
  wishlist: {
    backgroundColor: "#f1f1f1", 
    width: 160, borderWidth: 1, 
    borderColor: '#f1f1f1', 
    flexDirection: 'row',
  },
  vwwishlist: {
    marginBottom: '10%',
    alignItems:"center",
    height:hp(28),
    //  backgroundColor:'red',
    justifyContent:'center'
  },
  imgwdht:{
    width: wp(40),
    height: hp(28),
    resizeMode:'contain',
  },
  totaldata: {
    fontSize:14,fontFamily:"Montserrat-SemiBold", color:'#333',
  },
  cardlist: {
    fontSize:14,fontFamily:"Montserrat-SemiBold", color:'#333',
    borderBottomWidth : 1,
    borderBottomColor : '#ccc',marginTop: 15,
  },
  placeonvw: {
    flex: 1, marginBottom: "30%"
  },
  imageMenuWraper: {
    borderWidth: 1, borderColor: '#f1f1f1', 
    borderRadius: 5, width: 150, height: 85, 
    backgroundColor: '#ccc', marginRight: 15
  },
  formWrapper: {
    // paddingHorizontal: 15
  },
  categoryTitle: {
    color: '#333', textAlign: 'center', 
    marginTop: 5, marginBottom: 10, 
    fontSize: 13, fontFamily: "Montserrat-Regular", 
    flexWrap: 'wrap'
  },
  catImage: {
    flex: 0.5, marginRight: 10, 
    backgroundColor: '#ccc', borderWidth: 0, 
    borderColor: '#f1f1f1', height: 200
  },
  catTitle: {
    fontSize: 14, fontFamily: "Montserrat-SemiBold", textAlign: 'center', marginTop: 10
  },
  mg10: {
    marginRight: 10
  },
  button: {
    marginRight: 10,
    backgroundColor: colors.buttonORANGE,
    height: 35,

  },
  buttonText: {
    color: colors.buttonText,
    fontFamily: "Montserrat-Regular",
    fontSize: 11,

  },
  buttonContainer: {
    marginTop: 15,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        justifyContent: 'center',


      },
      android: {
        alignItems: 'center',

      }
    })
  },
  button1: {
    backgroundColor: colors.button1,
    height: 45,
    width: "100%",



  },
  buttonText1: {
    color: colors.buttonText,
    fontFamily: "Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize: 13

  },
  iconImg:{
    height:hp(5),
    width:wp(5),
    resizeMode:'cover'
  },
  iconImgCash:{
    height:hp(7),
    width:wp(7),
    resizeMode:'cover'
  },
  buttonContainer1: {
    padding:25,
    marginTop: 15,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        justifyContent: 'center',


      },
      android: {
        alignItems: 'center',
      }
    })
  },

  label:{
    color:"#F9F9F9",fontFamily:"Montserrat-Regular",fontSize:RFPercentage(2.3),opacity:0.7
  },
  label1:{
    color:"#F9F9F9",fontFamily:"Montserrat-Regular",fontSize:RFPercentage(2.3)
  },
  text:{
    color:"#F9F9F9",fontFamily:"Montserrat-SemiBold",fontSize:RFPercentage(2.5)
  },
  label2:{
    fontFamily:"Montserrat-Medium",color: "#000000",fontSize:RFPercentage(2.1)
  },
  label3:{
    fontFamily:"Montserrat-Bold",color: "#000000",fontSize:RFPercentage(2.1)
  }

})
