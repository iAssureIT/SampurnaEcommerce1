import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export default StyleSheet.create({
  
  button2:{
    // backgroundColor: colors.button2,
    height: 40,
    backgroundColor:'#fff'
// 
    // width:"80%",
  },
  buttonText2:{
    color: colors.buttonText2,
    fontFamily:"Montserrat-SemiBold",
    // textTransform: 'uppercase',
    fontSize:11

  },
  buttonContainer2:{
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
  cartdetails:{
    flex:1,
    // paddingHorizontal:15,
    // marginTop:15
    // ,marginBottom:"20%"
  },
  details:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",
    color:'#333',marginTop: 10,
  },
  flxdir:{
    flexDirection:'row'
  },
superparent:{
  flex:1,backgroundColor:'#f1f1f1'
  },
  flxpd:{
    flex:0.25,paddingHorizontal:5
  },
  imgwdht:{
    width: hp(10), height:hp(10),
  },
  cartlogoimg:{
     width:'70%',height:40,
  },
  cartlogo:{
    height:100,marginTop:10,
  },
  flxmg:{
    flex:0.4,marginTop:10,
  },
  flxmg2:{
    flex:0.3,marginTop:10
  },
  QText:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Medium",
    color:'#858585',
  },
  QNum:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Regular",
    color:'#000',
  },
  prodnamedets:{
    flex:1
  },
  productname:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap:'wrap'
  },
  productname1:{
    fontSize:RFPercentage(2.2),fontFamily:"Montserrat-Medium",flexWrap:'wrap',color:'#000',
  },
  tomorroworder:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap:'wrap',marginTop:10,
  },
  prodqtyunit:{
    fontSize:14,fontFamily:"Montserrat-Regular",flexWrap:'wrap'
  },
  custtname:{
    fontSize:16,fontFamily:"Montserrat-SemiBold",flexWrap:'wrap',padding:10,
  },
  custaddress:{
    fontSize:13,fontFamily:"Montserrat-Regular",flexWrap:'wrap',
  },
  purchasep:{
    fontSize:16,fontFamily:"Montserrat-SemiBold",marginTop:10
  },
  freshnsecuretxt:{
    fontSize:12,fontFamily:"Montserrat-Regular",color:'#ff7900',alignItems:"flex-start",
  },
  productdets:{
    flexDirection:'row',marginTop:7,
    marginBottom: 10,
  },
  productdetsprice:{
    flexDirection:'row',marginTop:5,
    // marginBottom: 10,
  },
  custmobdet:{
    flexDirection:'row',paddingLeft:10,
    // marginBottom: 10,
  },
  adddetails:{
    flex:1,
    paddingHorizontal:15,
    marginTop:15,
    // marginBottom:"20%"
  },
  proddelete:{
    flexDirection:'row',marginTop:10,
    marginBottom: 10,alignItems:"flex-end",flex:1,
  },
  mincircle:{
    borderWidth:1,borderColor:"#ccc",
    padding:5,borderTopLeftRadius:5,height:50,
    borderBottomLeftRadius:5
  },
  icnstyle:{
    marginTop:10,marginRight:3,paddingHorizontal:5
  },
  productqty:{
    borderWidth:1,borderColor:"#ccc",padding:5,height:50
  },
  productqtyicn:{
    borderWidth:1,borderColor:"#ccc",padding:5,
    borderTopRightRadius:5,height:50,borderBottomRightRadius:5
  },
  productdel:{
    flexDirection:'row',marginTop:15,paddingRight:10
  },
  productdelopacity:{
    flex:0.4,marginRight:10,
    borderWidth:1,borderColor:"#ccc",
    borderRadius:3,shadowColor: '#f1f1f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  mvtolist:{
    flex:0.8,borderRadius:3,
    borderWidth:1,borderColor:"#ccc",
    shadowColor: '#f1f1f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  productsoldby:{
    fontSize:12,fontFamily:"Montserrat-Regular", color:'#666'
  },
  totaldata1:{
    fontSize:RFPercentage(2.2),fontFamily:"Montserrat-Bold", color:'#000'
  },
  totaldata1G:{
    fontSize:RFPercentage(2.4),fontFamily:"Montserrat-Bold", color:'#000'
  },
  totaldata:{
    fontSize:RFPercentage(2),fontFamily:"Montserrat-Medium", color:'#000'
  },
  totalsubtxt:{
    fontSize:13,fontFamily:"Montserrat-Regular", color:'#999',
    // textAlign:'center'
  },
  flxdata:{
    flex:1,flexDirection:"row",paddingVertical:5
  },
  orderbrdr:{
    flex:1,flexDirection:"row",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom:15,
    borderStyle: 'dotted',
  },
  amountpay:{
    flex:1,flexDirection:"row",
    marginTop:15,
  },
  totaldetails1:{
    backgroundColor:'#FFF',
    borderColor:"#ddd",
    paddingLeft:6,
    paddingRight:6,
    paddingVertical:15,
    borderRadius:7,
    // marginTop:10
    // borderTopWidth:1
  },
  vendorTotal:{
    flex:0.8,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    marginHorizontal:6,
    marginRight:15
  },
  totaldetails:{
    backgroundColor:'#fff',
    borderColor:"#ddd",
    // paddingLeft:15,
    // paddingRight:15,
    marginHorizontal:6,
    borderRadius:7,
    marginTop:5
    // borderTopWidth:1
  },
  productsoldurl:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#3090C7'
  },
  securetxt:{
    fontSize:9,fontFamily:"Montserrat-SemiBold", color:'#999',textAlign:'center',
  },
  iconstyle:{
    marginTop:5,marginRight:3
  },
  rupeeicn:{
    flexDirection:"row",justifyContent:'flex-end',
  },
  padhr15:{
    marginTop:10,marginBottom:15,
  },
  addcmpchkbx:{
    backgroundColor:'#fff',marginTop:10,marginBottom:15,
    // flex:0.8,
  },
  proddeletes:{
    alignItems: "flex-end",
    marginTop:4,
    paddingRight: 10,
  },
  padhr18:{
    // paddingHorizontal:10,
  },
  margTp20:{
    marginTop:20
  },
  margTp10:{
    marginTop:10
  },
  savings:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333',
  },

  totalpriceincart:{
    marginTop:-2,
    fontSize:13,
    fontFamily:"Montserrat-SemiBold", 
    color:'#333',
  },
  freshnsecuretxt:{
    fontSize:15,fontFamily:"Montserrat-SemiBold", color:'#333',
  },
  ogprice: {
		fontSize: 12, fontFamily: "Montserrat-SemiBold", marginLeft: 2, color: '#333', alignItems: 'center',
	},
  discountpr:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#c10000',fontStyle:"italic",marginLeft:10
  },
  proddetprice:{
    // textDecorationLine: 'line-through',
    fontSize:14,fontFamily:"Montserrat-SemiBold",
  },
  proprice:{
    // textDecorationLine: 'line-through',
    fontSize:17,fontFamily:"Montserrat-SemiBold",
  },

  proddetails1:{
    borderWidth:1,borderColor:'#E7E7E7',
    backgroundColor:"#fff",
    minHeight:80,
    borderRadius:4,
    paddingHorizontal:5,
    paddingVertical:10,
    marginBottom:10,
    marginHorizontal:6,
  },
  proddetails:{
    backgroundColor:"#fff",
    minHeight:80,
    marginBottom:10,
    marginHorizontal:6,
  },
  buttonContainer1:{

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
  mobilenum:{
    flex:0.4,fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  removeparent:{
    flex:0.5,paddingHorizontal:15,
  },
  flx7:{
    flex:0.7
  },
  flx3:{
    flex:0.3
  },
  endrow:{
    flexDirection: "row", justifyContent: 'flex-end' ,marginTop:10
  },
  padhr15:{
    paddingHorizontal:15
  },
  padhr18:{
    paddingHorizontal:50
  },
  addcmpbtn:{
    flex:0.5,paddingHorizontal:0
  },
  addcmpchkbx:{
    backgroundColor:'#fff',marginTop:0,marginBottom:15,
    // flex:0.8,
  },
  addcmporder:{
    backgroundColor:'#fff',marginTop:hp(2.5),paddingHorizontal:wp(1)
  },
  flx8:{
    flex:0.8,
  },
  flx5:{
    flex:0.5,
  },
  proddeletes:{
    alignItems: "flex-end",
    marginTop:14,
    paddingRight: 10,
  },
  chkvw:{
    flex:0.2,
  },
  nameofcontact:{
    flex:0.7,
  },
  addchkbx:{
    flexDirection:'row',paddingHorizontal:2,paddingVertical:2,
  },
  orderaddchkbx:{
    flexDirection:'row',alignItems:'center'
  },
  chkbox:{
    fontSize:15,fontFamily:"Montserrat-Regular",color:'#666'
  },
  flxrow:{
    flexDirection:'row'
  },
  blueDot:{
    height:hp(1),
    width:hp(1),
    borderRadius:50,
    // flex:0.2,
    backgroundColor:'#033554',
  },
  addname:{
    fontSize:RFPercentage(2.5),
    fontFamily:"Montserrat-Medium",
    // flex:0.7,
    // alignItems:"flex-start",
    color:"#000000",
    opacity: 1
  },
  address:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Medium",
    color:'#9B9B9B',
    // opacity: 0.5
  },
  mobflx:{
    flexDirection:'row',
    // marginTop:8,
    marginBottom:18
  },
  addoffice:{
    flex:0.3,alignItems:'flex-end',
    marginTop:10,
    paddingTop:8,
    textAlign:'center',backgroundColor:'#f1f1f1',
    height:35,color:'#333',borderWidth:1,
    borderColor:'#f1f1f1',borderRadius:3,
    fontSize:12,fontFamily:"Montserrat-SemiBold",
  },
  marTp15:{
    marginTop:15
  },

  imageMenuWraper:{ 
    borderWidth:1,borderColor:'#f1f1f1',borderRadius:5,width: 150, height:85, backgroundColor: '#ccc',marginRight:15
    },
    formWrapper:{
      // paddingHorizontal:15,
      // marginTop:15
  
    },
    categoryTitle:{
     color:'#333',textAlign:'center',marginTop:5,marginBottom:10,fontSize:13,fontFamily:"Montserrat-Regular",flexWrap: 'wrap' 
    },
    catImage:{
      flex:0.5,marginRight:10,backgroundColor:'#ccc',borderWidth:0,borderColor:'#f1f1f1', height:200
    },
    catTitle:{
      fontSize:14,fontFamily:"Montserrat-SemiBold",textAlign:'center',marginTop:10
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
      height: hp(7),
      width:"100%",
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
      paddingLeft:10
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
      fontSize:12
    },
    textStyle:{
      fontFamily:"Montserrat-Regular",
      backgroundColor:'transparent',
      paddingTop:0,
      marginTop:-6,
      fontSize:11,
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
     flex:0.4,
     height:hp(4),
      // marginLeft:10,
      // borderColor:'#666',
      // borderColor:colors.theme,
      // borderWidth:1,
      // borderColor:'#707070',
      flexDirection:'row',
      borderRadius: 5,
    },
      formInputView: {
      width:'100%',
    },
  
    marginBottom20:{
      marginBottom: 20
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
      fontSize:13
  
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
  
    ddContainer:{
      backgroundColor:'transparent',
      paddingLeft:4
      // fontFamily:"Montserrat-Regular"
    },
    ddItemText:{
      fontFamily:"Montserrat-Medium",
      fontSize:RFPercentage(1.5)
    },
    ddInputContainer:{
      // /borderWidth: 0,
      // width:20,
    },
    ddLabelText:{
      backgroundColor:'#fff',
      top:0,
      // left:5,
      fontFamily:"Montserrat-Regular",
      fontSize:RFPercentage(2.2),
      paddingHorizontal:2,
    },
    ddStyle:{
      fontFamily:"Montserrat-Regular",
      backgroundColor:"#fff",
      height:hp(2.5),
      width:wp(35),
      fontSize:RFPercentage(1.5),
      borderWidth:1,
      borderColor:'#707070',
      borderRadius:4,
      alignItems:'center'
    },
    addsuperparent:{
      flex:1,backgroundColor:'#f1f1f1'
    },
    flxdir1:{
      flex:1,flexDirection: "row"
    },
    addparent:{
      backgroundColor:'#fff',paddingVertical:20,paddingHorizontal:15,
    },
    addtype:{
      backgroundColor:'#fff',paddingVertical:20,paddingHorizontal:15,
    },
    addcanclebtn:{
      backgroundColor:'#fff',paddingVertical:20,paddingHorizontal:15,
    },
    addresstype:{
      fontSize:15,fontFamily:"Montserrat-Regular",color:'#666',marginBottom:15
    },
    addcanclebtn:{
      flexDirection:'row',marginBottom:85
    },
    canclebtn:{
      flex:0.5,paddingHorizontal:15,marginTop:10
    },
    editparent:{
      flex:0.5,paddingHorizontal:15,
    },
    confirmbtn:{
      flex:0.5
    },
    mobileno:{
      flex:0.2,fontSize:13,fontFamily:"Montserrat-Regular",color:'#666'
    },
    discountpricecut: {
      fontSize: 12, fontFamily: "Montserrat-SemiBold",
      textDecorationLine: 'line-through',
  
    },
    cancelbtn:{
      flexDirection:'row',marginTop:20,justifyContent:'space-between'
    },
    cancelvwbtn:{
      flex:0.48,
      borderRadius:3,
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      elevation: 5,
      paddingRight:15
    },
    ordervwbtn:{
      flex:0.48,
      borderRadius:3,
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 5,
      paddingLeft:15
    },
    buttonText1:{
      color: colors.buttonText,
      fontFamily:"Montserrat-Regular",
      textTransform: 'uppercase',
      fontSize:RFPercentage(2.3)    
      // borderColor:'#c10000',
  
    },
    buttonRED:{
      backgroundColor: colors.buttonRED,
      height: hp(7),
      width:"100%",
    },
    buttonContainer2:{
      ...Platform.select({
        ios:{
          justifyContent:'center',
      
        },
        android : {
          alignItems:'center',
          
        }
      })
    },
    containerStyle:{
      borderWidth:1,
      borderTopLeftRadius:6,
      borderBottomLeftRadius:6,
      backgroundColor:'#CBD0D4',
      // marginVertical:5,
      borderColor:"#ccc",
      paddingHorizontal: 0,
      height:hp(6.5),
    },
    radiobtn:{
      // alignItems:'center',
      paddingHorizontal:0,
      marginLeft:-1,
    },
    priceIteam:{
      fontSize: RFPercentage(2.4), fontFamily:"Montserrat-SemiBold", color: '#000000'
    },
    priceIteamG:{
      fontSize: RFPercentage(2.4), fontFamily:"Montserrat-SemiBold", color: '#3E9D5E'
    },
    currency:{
      fontSize: 20, fontFamily: "Montserrat-Medium", color: '#000'
    },
    currency1:{
      fontSize: RFPercentage(2), fontFamily:"Montserrat-Medium", color: '#000000',opacity:0.4
    },
    currency1Iteam:{
      fontSize: RFPercentage(2.4), fontFamily:"Montserrat-Medium", color: '#000000',opacity:0.4
    },
    currency1G:{
      fontSize: RFPercentage(2.4), fontFamily:"Montserrat-Medium", color: '#000000',opacity:0.4
    },
    totalpriceincartTotal:{
      fontSize:RFPercentage(2.2),
      fontFamily:"Montserrat-SemiBold", 
      color:'#000000',
    },

    totalpriceincartTotalR:{
      fontSize:RFPercentage(2.1),
      fontFamily:"Montserrat-Bold", 
      opacity: 0.7,
      color:'#EF9A9A'
    },

    totalpriceincartTotalGT:{
      fontSize:RFPercentage(2.2),
      fontFamily:"Montserrat-Bold", 
      color:'#000000',
    },
  
    totalpriceincartTotalG:{
      fontSize:RFPercentage(2.3),
      fontFamily:"Montserrat-SemiBold", 
      color:'#3E9D5E',
    },

    vendorTotalText:{
      fontSize:RFPercentage(2.2),
      fontFamily:"Montserrat-SemiBold", 
      color:'#000000',
      marginRight:15
    },

    free:{
      marginTop:Platform.OS==='ios'?0: -8,
      fontSize:RFPercentage(1.9),
      fontFamily:"Montserrat-Regular",
      color:'#000'
    },
  
})
