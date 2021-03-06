
import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  menuWrapper:{
    marginTop:20,
    flexDirection:'row',
    flex:1
  },
  imageMenuWraper:{ 
  borderWidth:1,borderColor:'#f1f1f1',borderRadius:5,width: 150, height:85, backgroundColor: '#ccc',marginRight:15
  },
  formWrapper:{
  	paddingHorizontal:15,
    marginTop:15

  },
  categoryTitle:{
   color:'#333',textAlign:'center',marginTop:5,marginBottom:10,fontSize:RFPercentage(1.9),fontFamily:"Montserrat-Regular",flexWrap: 'wrap' 
  },
  catImage:{
    flex:0.5,marginRight:10,backgroundColor:'#ccc',borderWidth:0,borderColor:'#f1f1f1', height:200
  },
  catTitle:{
    fontSize:RFPercentage(2.2),fontFamily:"Montserrat-SemiBold",textAlign:'center',marginTop:10
  },
  padhr15:{
    paddingHorizontal:15
  },
  marTp15:{
    marginTop:15
  },
  acceditbtn:{
    flexDirection:'row',marginTop:15
  },
  profileparent:{
    flex:1,backgroundColor:'#f1f1f1',padding:15
  },
  container:{
    backgroundColor:'#fff',marginTop:0,marginBottom:15
  },
  profiltitle:{
    fontSize:RFPercentage(1.9),fontFamily:"Montserrat-SemiBold",
    color:'#333',paddingHorizontal:15
  },
  acceditbtns:{
    flex:0.5,paddingHorizontal:15,
  },
  accmobnumber:{
    flex:0.7,fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  accusermob:{
    fontSize:RFPercentage(1.9),fontFamily:"Montserrat-Regular",color:'#666'
  },
  padhr18:{
    paddingHorizontal:wp(4.5)
  },
  contactname:{
    flex:1 , marginBottom:20,
  },
  accusermobinfo:{
    flexDirection:'row',
    alignItems:'center',
    height:50
  },
  accuseraddress:{
    fontSize:12,fontFamily:"Montserrat-Regular",
    color:'#666',flexWrap:'wrap'
  },
  accusername:{
    fontSize:13,
    fontFamily:"Montserrat-SemiBold",marginTop:15
  },
  accnameuser:{
    flexDirection:'row',
    paddingHorizontal:15,
    paddingVertical:10
  },
  acccontactinfo:{
    paddingHorizontal:18,fontSize:13,
    fontFamily:"Montserrat-SemiBold",textAlign:'center',
    paddingVertical:10,marginTop:15,backgroundColor:'#f1f1f1',
    borderWidth:1,borderColor:'#f1f1f1',
  },
  buttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
  },
  accuserinfo:{
    backgroundColor:'#fff',
    marginTop:0,
    minHeight:400,
    paddingBottom:15,
  },
  acdashparent:{
    paddingHorizontal:43,
    marginBottom:'20%',
    backgroundColor:"#fff"
  },
  acdashsuperparent:{
    flex:1,
    backgroundColor:'#fff',
    padding:wp(5),
  },
  button:{
    marginRight:10,
    backgroundColor: colors.button,
    height: 35,

  },
  buttonText:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    fontSize:13,

  },
  buttonContainer:{
    marginTop:15,
    marginBottom:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
      

      },
      android : {
        alignItems:'center',
      }
    })
  },
  button1:{
    backgroundColor: colors.button1,
    height: 45,
    width:"100%",
  },
  buttonText1:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13

  },
  buttonContainer1:{
    width:'100%',
    marginTop:15,
    marginBottom:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
      

      },
      android : {
        alignItems:'center',
      }
    })
  },
   textContainer:{
    height:'auto',
    paddingLeft:10,
  },
  textInputContainer:{
    backgroundColor:'transparent',
    paddingLeft:5,
    // fontFamily:"Montserrat-Regular",
    borderBottomColor: "transparent"
  },
    inputTextWrapper : {
    width:'88%'
  },
  textTitle:{
    fontFamily:"Montserrat-Regular",
    top:0, 


  },
  textStyle:{
    fontFamily:"Montserrat-Regular",
    backgroundColor:'transparent',
    paddingTop:0,
    marginTop:-6,


  },
  textLabel:{
    backgroundColor:'#fff',
    fontFamily:"Montserrat-Regular",
    top:-7,

  },
  errorWrapper:{
    width:'100%',
    marginBottom:-15
  },
  errorText:{
    color:'#dc3545',
    fontSize:12,
    marginTop:3,
    paddingLeft:25,
    fontFamily:'Montserrat-Regular'
  },
  eyeWrapper:{
    width:'15%',
    justifyContent:'center',
    alignItems:'center',
  },
  inputWrapper : {
    width:'100%',
    borderColor:'#666',
    borderWidth:1,
    flexDirection:'row',
    borderRadius: 5,
  },
    formInputView: {
    width:'100%',
  },

  marginBottom20:{
    marginBottom: 20
  },
    inputImgWrapper : {
    width:'10%',
    justifyContent:'center',
    alignItems:'center',
    borderRightWidth:1,
    borderColor: colors.textLight,
    marginVertical:15
  },
   inputText2Wrapper:{
    width:'74%',
    justifyContent:'center'
  },
  buttonORANGE:{
    backgroundColor: colors.buttonORANGE,
    height: 45,
    width:"100%",
  },
  buttonTextEDIT:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:12,
  },
  yesmodalbtn:{
    marginTop:15,
  },
  buttonContainerEDIT:{
    width:'100%',
    marginTop:15,
    marginBottom:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
      

      },
      android : {
        alignItems:'center',
      }
    })
  },
  buttonS:{
    backgroundColor: 'rgb(251, 189, 101)',
    height: 45,
    width:"100%",
  },
  buttonTextS:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13

  },
  buttonContainerS:{
    width:'100%',
    marginTop:15,
    marginBottom:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
      

      },
      android : {
        alignItems:'center',
      }
    })
  },

  creditTitle:{
    fontSize:RFPercentage(2.7),
    fontFamily:"Montserrat-Bold",
    color:'#000',
  },

  headerText1:{
    color:"#033554",
    fontSize:RFPercentage(1.8),
    fontFamily:"Montserrat-Medium",
  },

  headerText2:{
    color:"#707070",
    fontSize:RFPercentage(1.5),
    fontFamily:"Montserrat-Medium",
  },

  cardCredit:{
    // height:43,
    paddingVertical:hp(1),
    color:'#000',
    // backgroundColor:'red',
    // borderBottomWidth:1,
    // borderColor:'#ccc',
  },

  iconImg:{
    height:hp(3),
    width:hp(3),
    resizeMode:'cover',
  },

  copyRightText:{
    color:'#000',
    fontSize:RFPercentage(1.5),
    fontFamily:"Montserrat-Regular",
    opacity: 0.5,
  },

  noPointsText:{
    color:'#DC1919',
    fontSize:20,
    fontFamily:"Montserrat-Medium",
    textAlign:'center'
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor:'#000',
    color:"#000"
  },

  otpLastText:{
    color: '#aaa',
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  otpLastText1:{
    color: '#033554',
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },

  otpTitle:{
    color: '#033554',
    fontSize: 22,
    fontFamily: "Montserrat-Bold",
  },

  underlineStyleHighLighted: {
    // borderColor: "#03DAC6",
    borderColor: "#033554",

  },

  header1:{
    fontSize:RFPercentage(2.5),
    fontFamily:"Montserrat-Bold",
    color:'#000',
    lineHeight:RFPercentage(3.2),
  },
})
