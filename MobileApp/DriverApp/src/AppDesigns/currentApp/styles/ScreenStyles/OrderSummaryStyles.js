import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

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
  buttonText1:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13
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
    flex:0.8,
    flexDirection:'row',
    justifyContent:'center'
  },
  imgwdht:{
    width: 42, height:42,
  },
  cartlogoimg:{
     width:'70%',height:40,
  },
  cartlogo:{
    height:100,marginTop:10,
  },
  flxmg:{
    flex:0.35,
    flexDirection:'row',
    justifyContent:'center'
  },
  flxmg2:{
    flex:0.3,marginTop:10
  },
  prodnamedets:{
    flex:1
  },
  productname:{
    fontSize:13,color:'#000',fontFamily:"Montserrat-Regular",flexWrap:'wrap'
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
  totaldata:{
    fontSize:14,fontFamily:"Montserrat-Bold", color:'#000'
  },
  totalsubtxt:{
    fontSize:13,fontFamily:"Montserrat-Regular", color:'#999',
    // textAlign:'center'
  },
  flxdata:{
    flex:1,flexDirection:"row",
    borderTopWidth:1,borderColor:'#eee',
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
  totaldetails:{
    backgroundColor:'#fff',
    borderColor:"#f1f1f1",
    paddingHorizontal:15,paddingVertical:15
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

  proddetails:{
    // borderBottomWidth:1,borderColor:'#eee',
    backgroundColor:"#fff",
    minHeight:55,
    justifyContent:'center',
    // borderRadius:5,
    marginTop:10,
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
    backgroundColor:'#fff',marginTop:10,marginBottom:15,paddingHorizontal:15
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
    flexDirection:'row',paddingHorizontal:2,paddingVertical:2,
  },
  chkbox:{
    fontSize:15,fontFamily:"Montserrat-Regular",color:'#666'
  },
  flxrow:{
    flexDirection:'row'
  },
  addname:{
    fontSize:14,fontFamily:"Montserrat-SemiBold",marginTop:15,
    flex:0.7,alignItems:"flex-start"
  },
  address:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#666'
  },
  mobflx:{
    flexDirection:'row',marginTop:8,marginBottom:18
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
      width:'100%',
      // marginLeft:10,
      // borderColor:'#666',
      borderColor:colors.theme,
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
      fontFamily:"Montserrat-Regular"
    },
    ddInputContainer:{
      borderBottomColor: 'transparent',
      borderWidth: 0,
    },
    ddLabelText:{
      backgroundColor:'#fff',
      top:0,
      // left:5,
      fontFamily:"Montserrat-Regular",
      fontSize:15,
      paddingHorizontal:2,
    },
    ddStyle:{
      fontFamily:"Montserrat-Regular",
      backgroundColor:"#fff",
      height:50,
    },
    addsuperparent:{
      flex:1,backgroundColor:'#f1f1f1'
    },
    flxdir1:{
      flex:1,flexDirection: "row",
      justifyContent:'center'
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
    containerStyle:{
      borderWidth:1,
      borderRadius:3,
      // marginVertical:5,
      borderColor:"#ccc",
      paddingHorizontal: 0,
      height:43,
    },
    tabWrap:{
      flexDirection: 'row',
      height:35,
      borderRadius:4,
      alignSelf:"flex-end",
      marginHorizontal:40
    },
    activeTabView:{
      flex:0.5,
      padding: 5,
      borderRadius:4,
      justifyContent:'center',
      alignItems:"center",
      backgroundColor: colors.cartButton,
      elevation: 6,
    },
    
    tabView:{
      flex:0.5,
      padding: 5,
      borderRadius:4,
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
      fontFamily: "Montserrat-Medium",
      marginLeft: 5
    },
    tabText1:{
      fontSize: 12,
      color: colors.black,
      fontFamily: "Montserrat-Light",
      marginLeft: 5
    },
    boxLine1B:{
      color:'#000',
      fontFamily: "Montserrat-Regular",
      fontSize:14,
  },
  boxLine2B:{
    color:'#000',
    fontFamily: "Montserrat-Regular",
    fontSize:15,
},
boxLine2_AnsB:{
  color:'#000',
  fontFamily: "Montserrat-Light",
  fontSize:15,
},
deliveryText1:{
    color:'#000',
    fontFamily: "Montserrat-Medium",
    fontSize:16,
},
deliveryText2:{
    color:'#000',
    fontFamily: "Montserrat-SemiBold",
    fontSize:16,
},
containerStyle1:{
  borderWidth:1,
  borderRadius:3,
  width: 62,
  height: 25,
  borderColor:"#707070",
  backgroundColor:'#fff',
  
},
containerStyle23:{ 
  height: 5,
  backgroundColor:'red'
},
inputAmount:{
  fontFamily: "Montserrat-Light",
  fontSize:16
},
btnText:{
  fontFamily: "Montserrat-Medium",
  fontSize:16,
  color:'#fff'
},
tableHeader:{
  fontFamily: "Montserrat-Regular",
  fontSize:14,
  color:'#000'
}

})
