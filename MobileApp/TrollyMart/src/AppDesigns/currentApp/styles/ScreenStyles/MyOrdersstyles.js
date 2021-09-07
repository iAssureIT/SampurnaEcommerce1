import { StyleSheet, Dimensions,Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {colors} from '../styles.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const window = Dimensions.get('window');

export default StyleSheet.create({
  menuWrapper:{
    marginTop:20,
    flexDirection:'row',
    flex:1
  },
  container:{
    minHeight:window.height-25,
    backgroundColor:"#fff"
  },
  imageMenuWraper:{ 
  borderWidth:1,borderColor:'#f1f1f1',borderRadius:5,width: 150, height:85, backgroundColor: '#ccc',marginRight:15
  },
  formWrapper:{
    flex:1,
    marginBottom:hp(6.5)
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
  proddets:{
    fontSize:12,
    fontFamily:"Montserrat-SemiBold",
    color:'#666',
    paddingVertical:5,
    flex:0.3
  },
  addtitle:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",
     color:'#666',paddingVertical:5,
  },
  totalamounttitle:{
    fontSize:16,fontFamily:"Montserrat-SemiBold",
     color:'#666',paddingVertical:5,
     flex:0.4,
  },
  // totamount:{
  //   borderWidth:1,
  //   borderTopColor:'#f1f1f1',
  // },
  prodinfo:{
    fontSize:RFPercentage(2),
    fontFamily:"Montserrat-Medium",
    color:'#000',
    paddingRight:5
  },
  addressdets:{
    fontSize:13,
    // flex:0.6,
    // backgroundColor:'red',
     color:'#333',paddingVertical:5
  },
  myorderprodinfo:{
    flex:1,
    fontSize:12,
    fontFamily:"Montserrat-SemiBold",
    color:'#333',
  },
  myordereddate:{
    fontSize:12,
    fontFamily:"Montserrat-SemiBold",
     color:'#333',
  },
  pricenum:{
    fontSize:14,fontFamily:"Montserrat-SemiBold", color:'#333',paddingVertical:3
  },
  flx2:{
    flex:0.2,
    paddingLeft:10
  },
  flx4:{
    flex:0.4,
    
  },
  flxdir:{
    flexDirection : "row"
  },
  placeon:{
    fontSize:13,
    fontFamily:"Montserrat-Regular", 
    color:'#666',paddingVertical:5,
  },
  pricedetsvw:{
    borderWidth:1,borderColor:'#ccc',
    width:'50%',alignSelf:"center",
    marginVertical:15
  },
  pricedets:{
    fontSize:13,
    fontFamily:"Montserrat-Regular",
     color:'#666',marginBottom:20
  },
  superparent:{
    flex:1,
    // backgroundColor:'#fff',
  },
  placeonvw:{
    flex:1,marginBottom:"30%"
  },
  prodinfoparent:{
    backgroundColor:'#fff',
    marginBottom:15,
  },
  prodinfoparent1:{
    flex:1,backgroundColor:'#fff',
    marginBottom:15,
    borderColor: 'rgba(112, 112, 112, .52)',
    borderWidth:1,
    marginTop:15,
    paddingVertical:15,
    // paddingHorizontal:5,
    borderRadius:5,
    marginHorizontal:6
  },
  prodinfoparent13:{
    flex:1,backgroundColor:'#fff',
    marginBottom:15,
    borderColor:'#f1f1f1',
    // borderWidth:1,
    // marginTop:15,
    // paddingVertical:15,
    paddingHorizontal:5,
    borderRadius:5,
    marginHorizontal:6
  },
  orderid:{
    flex:0.4,
    backgroundColor:'#FFF',
    borderWidth:1,
    borderColor:'#FFF',
    justifyContent:"center",
  },
  orderAmount:{
    flex:0.6,
    backgroundColor:'#FFF',
    borderWidth:1,
    borderColor:'#FFF',
    alignItems:"flex-end",
  },
  orderidinfo:{
    fontSize:RFPercentage(2),
    fontFamily:"Montserrat-Regular",
    color: "#000000"
  },
  orderdets:{
    fontSize:12,
    fontFamily:"Montserrat-SemiBold", 
    color:'#333',marginTop:15
  },
  prodorderdets:{
    flexDirection:'row',flex:0.5,marginTop:15,
    borderWidth:1,
    borderColor:'#ccc',
    justifyContent:"center",
    alignItems:"center"
  },
  totalpayment:{
    marginTop:25,
    borderTopWidth:1,
    borderTopColor:'#ccc',
  },
  addressdetais:{
    marginTop:15,
    borderTopWidth:1,
    borderTopColor:'#ccc',
  },
  myorderdets:{
    flex:1,
		// flexDirection: 'row',
		// flexWrap: 'wrap', 
  },
  prodorders:{
    flexDirection:"row",
    margin:0,
    paddingHorizontal:5,
    marginVertical:15,
    // paddingHorizontal:15,    
  },
  flx7:{
    flex:0.6,
  },
  ordercancelstatus:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:15
    // marginTop:80,
    
  },
  ordercancelsstatus:{
    flex:0.4,
    paddingLeft:10,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  orderdetailsstatus:{
    flex:0.6,
    paddingRight:10,
    justifyContent:'center'
  },
  mrp:{
    fontSize:13,fontFamily:"Montserrat-Regular",
    color:'#666',
    alignSelf:'flex-start'
  },
  ordernum:{
    fontSize:13,fontFamily:"Montserrat-Regular", 
    color:'#333',paddingVertical:5,
  },
  prodrps:{
    flexDirection:'row',marginRight:10,marginTop:5
  },
  pricecount:{
    flexDirection:'row',marginRight:10
  },
  updatenum:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#666'
  },
  emailicn:{
    marginTop:3,marginRight:5
  },
  outervw:{
    borderWidth:1,borderColor:'#ccc',
    width:'100%',alignSelf:"center",marginVertical:15
  },
  commonadd:{
    fontSize:13,fontFamily:"Montserrat-Regular",
    color:'#666',
  },
  fashion:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  total:{
    fontSize:13,fontFamily:"Montserrat-SemiBold", 
    color:'#333',
    alignSelf:'flex-start'
  },
 
  priceon:{
    fontSize:12,fontFamily:"Montserrat-Regular",color:'#333',
  },
  iconrps:{
    marginTop:3
  },
  itemordervw:{
    flex:1,borderWidth:1,borderColor:'#f1f1f1',
    backgroundColor:'#ccc',paddingVertical:15
  },
  itemorder:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",
    color:'#333',paddingHorizontal:5
  },
  itemoutervw:{
    flex:1,flexDirection:'row',backgroundColor:'#fff',
    borderWidth:1,borderColor:'#f1f1f1',marginTop:15
  },
  namefordelivery:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",
    color:'#333',marginVertical:5,
  },
  price:{
    textDecorationLine: 'line-through',fontSize:12,
    fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  pricendate:{
    fontSize:12,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  cacelled:{
    fontSize:12,fontFamily:"Montserrat-SemiBold",
    color:'#c10000',marginRight:10
  },
  img15:{
    width: wp(17),height:hp(8),
    resizeMode:'contain',
    
  },
  imgMain:{
    width:hp(11),
    height:hp(11),
    backgroundColor:'#fff',
    alignSelf:'center',
    borderWidth:2,
    borderColor:'#033554',
    borderRadius:9,
  },
  img151:{
    marginLeft:20,
  },

  labelDrop:{
    fontSize:RFPercentage(1.9),
    fontFamily:"Montserrat-Bold",
    color:'#000000',
    marginBottom:10,
  },
  productqtyty:{
    flex:0.8,backgroundColor:'#f1f1f1',borderWidth:1,
    borderColor:'#f1f1f1',paddingHorizontal:15
  },

  orderstatustxt:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#666',marginBottom:15,
    marginTop: 10,
  },
  orderstatustxtcancel:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#666',marginBottom:15,
    marginTop: 10,
  },
  orderstatuscancel:{
    // fontSize:12,fontFamily:"Montserrat-SemiBold", 
    // color:'#666',marginBottom:15,
    marginTop: 10,
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
  cancelvwbtn:{
    flex:0.48,
    borderRadius:3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
    paddingRight:15
  },
  vendorStatus:{
    // height:0,
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#fff"
  },
  orderstatusmgtop:{
    margin:0,
    marginTop:15,
  },
  orderdetsandcancelbtn:{
    flex:1,
    marginTop:15,
  },
  ordereddates:{
    marginTop:15,
    flex:1,
  },
  orderstatus:{
    backgroundColor:'#fff',
  },
  parent:{
    flex:1,
    // marginBottom:'80%'
  },
  storeparent:{
    flex:1,
    marginBottom:'20%'
  },
  buttonRED:{
    backgroundColor: colors.buttonRED,
    // height: 45,
    width:"100%",
  },
  buttonContainer2:{
    height: 45,
    width:"100%",
  },
  
  buttonConfirm:{   
    backgroundColor: colors.buttonRED,
    height: 45,
    width:"50%",
  },

  ordercancelled:{
    color: 'red',
    fontFamily:"Montserrat-SemiBold",
    fontSize:14,
    justifyContent : "center",
    alignSelf:"flex-end",
    paddingRight:5
  },

  buttonORANGE:{
    backgroundColor: colors.buttonORANGE,
    height: 45,
    width:"100%",
    // borderColor:'#fbbd65',
    // borderWidth:1
  },
  buttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
  },
  buttonText1:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13,    
    // borderColor:'#c10000',

  },
  buttonContainer1:{
    width:"100%",
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
  totaldetails:{
    backgroundColor:'#fff',
    borderColor:"#ddd",
    // paddingHorizontal:15,
    paddingVertical:15,
    // borderTopWidth:1
  },
  flxdata:{
    flex:1,flexDirection:"row"
  },
  flxdataNew:{
    flex:1,flexDirection:"row",marginBottom:15,
  },
  flxdataLastNew:{
    flex:1,flexDirection:"row",marginBottom:22,
  },
  totaldata:{
    fontSize:RFPercentage(2),fontFamily:"Montserrat-Regular", color:'#000000',opacity: 0.4
  },
  creditPoints:{
    fontSize:RFPercentage(2),fontFamily:"Montserrat-Regular", color:'#000000',opacity: 0.8
  },
  totalAmount:{
    fontSize:RFPercentage(2.),fontFamily:"Montserrat-Bold", color:'#000000'
  },
  totalAmountG:{
    fontSize:RFPercentage(2.3),fontFamily:"Montserrat-Bold", color:'#000000',fontWeight:'900'
  },
  totalpriceincart:{
    fontSize:RFPercentage(2),
    fontFamily:"Montserrat-Medium",
    color:'#000',
  },
  ogpriceModal1: {
		fontSize: RFPercentage(1.8), fontFamily: "Montserrat-Bold",color: '#000',marginLeft:5, alignItems: 'center',
  },
  ogpriceModal: {
		fontSize: RFPercentage(1.8), fontFamily: "Montserrat-Bold",color: '#000', alignItems: 'center',
  },
  ogprice: {
		fontSize: RFPercentage(2), fontFamily: "Montserrat-Medium",  color: '#333', alignItems: 'center',
  },
  totalPrice: {
		fontSize: RFPercentage(2), fontFamily: "Montserrat-Bold",  color: '#333', alignItems: 'center',
  },
  ogpriceC: {
		fontSize: RFPercentage(2), fontFamily: "Montserrat-Regular",  color: '#333', alignItems: 'center',
  },
  ogpriceG1: {
		fontSize: RFPercentage(2), fontFamily: "Montserrat-SemiBold", color: '#4BA266', alignItems: 'center',
  },
  ogpriceR: {
		fontSize: RFPercentage(2), fontFamily: "Montserrat-SemiBold", color: '#EF9A9A', alignItems: 'center',
  },
  ogpriceG: {
		fontSize: RFPercentage(2.3), fontFamily: "Montserrat-SemiBold", color: '#000000', alignItems: 'center',opacity:0.4
	},
  	discountpricecut: {
		fontSize: RFPercentage(1.8), fontFamily: "Montserrat-SemiBold",
		textDecorationLine: 'line-through',
	},
  cancelButton:{
    backgroundColor:colors.white,
    height:50,
    width:"100%",
    borderRadius:3,
    justifyContent:"center",
    alignItems:'center'
  },
  cancelbtn:{
    flexDirection:'row',marginTop:20,justifyContent:'space-between'
  },
  containerStyle:{
    borderWidth:0.5,
    borderRadius:5,
    // marginVertical:5,
    borderColor:"#707070",
    backgroundColor:'#fff',
    fontFamily:'Montserrat-Medium',
    paddingHorizontal: 0,
    // height:43,
  },
  refundedText:{
    fontSize:12,
    fontFamily:'Montserrat-Regular',
    color:"#033554",
  },

  free:{
    fontSize:RFPercentage(1.8),
    fontFamily:'Montserrat-Medium',
    color:'#000',
    // marginTop:-5,
  },
  free1:{
    fontSize:RFPercentage(1.8),
    fontFamily:'Montserrat-Medium',
    color:'#033554',
    // marginTop:-5,
  },

  msgContainerStyle:{
    borderWidth:1,
    borderRadius:5,
    height:100,
    // marginBottom:20,
    // marginVertical:5,
    borderColor:"#ccc",
    paddingHorizontal:0,    
  },

  msgInputPlace:{
    fontSize:14,
    fontFamily:'Montserrat-Medium',
    // textAlignVertical:'top',
    color:"#333",
  },

  confirmbtn:{
    marginTop:15,
    // flex:0.5
  },
  marginBottom20:{
    marginBottom: 20
  },
  marginBL20:{
    marginBottom: 20,
    marginHorizontal:20,
  },
  inputWrapper : {
    width:'100%',
    // marginLeft:10,
    // borderColor:'#666',
    borderColor:"#707070",
    borderWidth:0.5,
    flexDirection:'row',
    borderRadius: 5,
  },
  inputTextWrapper : {
    width:'100%'
  },
  ddContainer:{
    backgroundColor:'transparent',
    // paddingLeft:4
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
    height:38,
  },
  orderbrdr:{
    flex:1,flexDirection:"row",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom:15,
    borderStyle: 'dotted',
  },
  aboutUsHeader:{
    // flex:1,flexDirection:"row",
    height:37,
    marginTop:15,
    marginBottom:15,
    // backgroundImage: 'radial-gradient(circle, #ffffff, #e2e3ea, #c3c9d5, #a1b0c0, #7d98aa)',
  },
  HeaderText:{ 
    fontSize:RFPercentage(2.2),
    fontWeight:'bold',
    zIndex:999,
    color:'#000',     
  },
  htmlText1:{
    fontSize:RFPercentage(1.8),
    fontFamily:"Montserrat-Regular",
    color:'#000',
  },
  htmlText:{
    fontSize:RFPercentage(1.8),
    fontFamily:"Montserrat-Regular",
    color:'#10344A',
  },
  textBox:{
    marginHorizontal:wp(5.5),
    paddingRight:5,
    borderRadius:9,
    color:'#10344A',
    fontSize:RFPercentage(1.8),
    minHeight:95,
    fontFamily:"Montserrat-Regular",
    // // position:'absolute',
    top:-25,
    backgroundColor:'#F5F5F5',
    // zIndex:999,
  },

  aboutImg:{
    height:hp(17),
    width:"100%",
    // marginBottom:95,
    // opacity: 0.8,
    resizeMode:'cover',
  },

  surface:{
    elevation:2
  },
  queBox:{
    borderRadius:15,
    marginBottom:hp(2),
    paddingVertical:0,
    borderWidth:0.5,
    marginHorizontal:wp(4),
    backgroundColor:"#fff",
    elevation:5
    // borderColor:"#aaa",
  },
  queAns:{
    minHeight:50,
    paddingHorizontal:10,
    paddingVertical:10,
    marginTop:-13,
    marginBottom:15,
    borderBottomLeftRadius:9,
    borderBottomRightRadius:9,
    elevation:2,    
    backgroundColor:'#fff',
    borderColor:'#707070',
  },

  mailText:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-SemiBold",
    color:'#000',
    marginBottom:15,
  },
  vendorName:{
    color: "#000000",
    opacity: 1,
    fontFamily:"Montserrat-SemiBold",
    fontSize:RFPercentage(2),
    marginLeft:5
  },
  button:{
    width:'100%',
    backgroundColor: colors.white,
    height: hp(3),
    backgroundColor:"#fff",
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:5,
    borderWidth:1,
    borderColor: colors.cartButton,
    paddingVertical:0,
  },
  buttonContainer:{
    elevation:5,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    ...Platform.select({
      ios:{
          justifyContent:'center',
      },
      android : {
          
          }
      })
  },
  buttonText:{
    color: colors.cartButton,
    fontFamily:"Montserrat-Regular",
    fontSize:RFPercentage(1.5),
  }, 
  statusLabel:{
    color:"#fff",
    fontSize:RFPercentage(1.5),
    // paddingHorizontal:10,
    fontFamily:'Montserrat-SemiBold',
    alignSelf:'center'
  },

  cancelText:{
    fontSize:13,
    fontFamily:'Montserrat-Medium',
    color:"#E88686",
    marginTop:5,
    textDecorationLine:'underline',
  },

  vendorName1:{
    fontFamily:'Montserrat-SemiBold',
    fontSize:RFPercentage(2.2),
    color:'#000',
    alignSelf:'flex-end',
    marginBottom:hp(3),
    marginRight:20,
  },

  cancelOrderText:{
    fontSize:RFPercentage(1.8),
    fontFamily:'Montserrat-Medium',
    color:"#E88686",
    textDecorationLine:'underline',
  },
  linkText:{
    alignSelf:'flex-end',
    fontSize:RFPercentage(1.5),
    textDecorationLine:'underline',
    fontFamily:"Montserrat-Regular",
    color: "#033554"
  }
})
