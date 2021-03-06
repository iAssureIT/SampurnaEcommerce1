import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const window = Dimensions.get('window');

export default StyleSheet.create({
  regionalProductName:{
    fontFamily:'aps_dev_priyanka',
    fontSize:RFPercentage(3),
  },
  regionalBrandName:{
    fontFamily:'aps_dev_priyanka',
    fontSize:RFPercentage(2.6),
    color:'#777'
  },
  categoryNameRlang:{
    fontFamily:'aps_dev_priyanka',
    color:'#333',
    textAlign:'center',
    fontSize:RFPercentage(3.2),
    paddingBottom:20,
    flexWrap: 'wrap'
  },
  bold:{
    fontWeight:'bold'
  },
  menuWrapper:{
    flex:1,
    flexDirection:"row",
    margin:15
  },
  containerViews:{
    // backgroundColor:'#ff0'
  },
  imageMenuWraper:{ 
  borderWidth:1,borderColor:'#f1f1f1',
  borderRadius:5,
  // width: 150,
   height:85,
   backgroundColor: '#ccc',marginRight:15
  },
  imageMenucatsub:{ 
    borderWidth:1,
    borderColor:'#f1f1f1',
    borderRadius:5,
    marginBottom:4,
    backgroundColor: '#ccc',
  },
  categoryname:{
    color:'#333',textAlign:'center',
    // marginTop:3,
    fontSize:RFPercentage(2.5),
    // marginBottom:25,
    paddingBottom:20,
    fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'
  },
  catimg:{
    height:80,borderRadius:5,
    width: 120
  },
  subcatimg:{
    height:150,
    width:"100%",
    // borderWidth:1,borderBottomColor:'#ccc',
  },
  discountpricecut: {
		textDecorationLine: 'line-through',
    textDecorationColor:"#DC1919",
    textDecorationStyle:'solid',
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Regular",
    color: "#000000",
    opacity: 0.5,
    // marginTop:5,
    marginBottom:1,
	},
  subcatimgbig:{
    height:180,
    width:"100%",
    borderWidth:1,borderBottomColor:'#ccc',
  },
  subcategoriesimg:{
    height:120,
    width:180,
    borderWidth:1,borderBottomColor:'#ccc',
  },
  sizedrpbtn: {
    flex:0.5,
    ...Platform.select({
			ios:{
				marginRight:8,
			}
		})
	}, 
	addbtn: {
		flex:0.5,
    alignItems:'center'
	}, 
  formWrapper:{
    flex:1,
    // paddingHorizontal:35,
    paddingLeft:5,    
    paddingRight:5,
    backgroundColor:"#fff"
  },
  categoryTitle:{
   color:'#333',textAlign:'center',
   marginTop:5,marginBottom:10,
   fontSize:RFPercentage(1.9),fontFamily:"Montserrat-Regular",flexWrap: 'wrap' 
  },
  catImage:{
    flex:0.5,marginRight:10,backgroundColor:'#ccc',borderWidth:0,borderColor:'#f1f1f1', height:200
  },
  catTitle:{
    fontSize:RFPercentage(2.2),fontFamily:"Montserrat-SemiBold",textAlign:'center',marginTop:10
  },
  button:{
    marginRight:10,
    backgroundColor: colors.button,
    height: 35,

  },
  buttonText:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    fontSize:RFPercentage(1.9),

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
  buttonText1: {
		color: colors.buttonText,
		fontFamily: "Montserrat-SemiBold",
		textTransform: 'uppercase',
		fontSize: RFPercentage(1.6)
	},
	modalText: {
		color: colors.buttonText,
		fontFamily: "Montserrat-SemiBold",
		textTransform: 'uppercase',
		fontSize: RFPercentage(1.9)
	},
  yesmodalbtn:{
    marginTop : 15,
  },
  addsuperparent:{
    flex:1,
    backgroundColor:'#fff',
  },
  
 
  colmwisecat:{
    flex:0.47,
    // marginBottom:40,
  },
 
  peroff:{
    backgroundColor:'#666',position:'absolute',
    bottom:"5%",borderWidth:1,padding:3,
    borderColor:'#666',
    borderRadius:5,color:'#fff',
    marginLeft:10,
  },
  wishlisthrt:{
    position:'absolute',
    bottom:"5%",
    top: 5,left:150
  },
  wishlisthrtproductview:{
    position:'absolute',
    bottom:"5%",
    alignSelf:"flex-end",
    top: 10,
    // right:30,
    height:hp(4),
    width:hp(4),
    backgroundColor:"#E6E6E6",
    borderRadius:50,
    justifyContent:'center'
  },
  share:{
    position:'absolute',
    bottom:"5%",
    // right:30,
    alignSelf:"flex-end",
    height:hp(4),
    width:hp(4),
    backgroundColor:"#E6E6E6",
    borderRadius:50,
    justifyContent:'center'
  },
  width160:{
    // width:180,
    width:"50%",
    padding : 5,

  },
  proddets:{
    width:'100%',
    flexDirection:'row',
    flexWrap:'wrap',
    marginBottom:'15%',
    marginTop:'5%',
    justifyContent: "center"  
  },
  nameprod:{
    fontSize:RFPercentage(2.7),fontFamily:"Montserrat-SemiBold",color:'#000',textTransform:'capitalize'
  },
  urlprod:{
    flex:1,fontSize:RFPercentage(1.9),flexWrap: "wrap",fontFamily:"Montserrat-Regular",color:'#666',paddingVertical:5
  },
  flxmgtp:{
    flexDirection:"row",marginTop:3
  },
  padvert10:{
    paddingVertical:20,
    // backgroundColor:'#fff',
  },
  heartwish:{
    alignItems : "flex-end"
    // backgroundColor:'#fff',
  },
  proddisperoff:{
    // backgroundColor:'red',
    width:25,height:25,borderRadius:25,overflow:'hidden',
    // alignItems: 'flex-end'

  },
  subcat:{
    backgroundColor:'#fff',paddingHorizontal:15,marginBottom:'30%',marginTop:20
  },
  catsuperparent:{
    flex:1,
    backgroundColor:'#f1f1f1',marginBottom:50
  },
  imgvw:{
    borderWidth:1,
    borderColor : "#aaa",
    padding:5,
  },
  flxmgstart:{
    flex: 1,
    flexDirection:"row",marginTop:15,
    alignItems: "flex-end",
  },
  prodviewcatsuperparent:{
    flex:1,
    backgroundColor:'#fff',marginBottom:50
  },
  flxmg:{
    flexDirection:"row",marginTop:15
  },
  prodname:{
    flex:0.8
  },
  prodnameview:{
    flex:1,
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333',
   marginBottom:10,
  },
  prodnameview12:{
    flex:0.8,
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333',
   marginBottom:10,
   marginHorizontal:6,
  },
  disCountLabel: {
		position: 'absolute',
		height:40,
		left: "5%",
		width:40,
		zIndex:1,
		// bottom: "5%",
		// top: 5, 
		// left: "80%"
	},
  productname:{
    fontSize:20,
    fontFamily:"Montserrat-SemiBold",
    color:'#666',
  },
  shortDescription:{
    fontSize:18,
    // fontFamily:"KrutiDev010",
    // fontFamily:"kruti",
    color:'#333',
    ...Platform.select({
			ios: {
				fontFamily: "KrutiDev010",
			},
			android: {
				fontFamily: "kruti",
			}
		})
  },
  brandname: {
		fontSize: RFPercentage(2.2), 
		fontFamily: "Montserrat-Medium", 
		marginLeft: 2, color: '#000000', 
		alignItems: 'center',
	},
  packofnos: {
		fontSize: RFPercentage(1.8), 
		fontFamily: "Montserrat-SemiBold", 
		marginLeft: 2, color: '#666', 
		alignItems: 'center',
	},
  proddetprice:{
    fontSize:RFPercentage(3.2),
    fontFamily:"Montserrat-Bold",
    color:"#000000",

  },
  prodcurrency:{
    fontSize:RFPercentage(3),
    fontFamily:"Montserrat-Regular",
    color:"#000000",
    opacity:1
  },
  star:{
    flex:0.2,backgroundColor:'#388e3c',borderRadius:3,paddingVertical:3,
  },
  staricn:{
    flexDirection:'row',justifyContent:'center',
  },
  saleimg:{
    height:200,
    width:"100%" ,
    alignSelf:'center',
    marginBottom:20,
  },
  saleimgNo:{
    height:200,
    width:200 ,
    alignSelf:'center',
    marginBottom:20,
  },
  mg10:{
		margin:10,
	},
  orderstatus:{
    flex:1,flexDirection:"row",
    backgroundColor:'#fff',marginTop:15,paddingHorizontal:15,
    paddingVertical:15,borderWidth:1,borderColor:'#f1f1f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  orderstatustxt:{
    flex:0.4,
    fontSize:17,fontFamily:"Montserrat-SemiBold", color:'#666',
  },
  kgs:{
    flex:0.4,
  },

  addBTN:{
    flex:0.6,
    // alignItems:"center",
    marginVertical:10,
    textAlign:"center",
    borderRadius:4,
  },

  qtys:{
    flex:0.4,
    alignItems:"center",
    justifyContent:'center'
  },
  icnstar:{
    marginTop:3,marginRight:5
  },
  prodqty:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#fff',marginTop:0,
  },
  protxt:{
   marginTop:10,alignItems : "center",
  },
  prdet:{
   marginTop:5,alignItems : "center",
   marginBottom : 10,
  },
  addtocartbtn:{
   marginBottom : 20,
   //flex:1,
   //  flexDirection:'row',
   flexDirection: "column",
   justifyContent: "center",
  },
  sizedrpbtn: {
    flex:0.5,
    
	}, 
	addbtn: {
		flex:0.5,
	}, 
	// inputWrapper : {
	// 	width:'95%',
	//   marginLeft:10,
	// 	// borderColor:'#666',
	// 	borderColor:'#ed3c55',
	// 	borderWidth:1,
	// 	flexDirection:'row',
	// 	borderRadius: 5,
	//   },
	
	//   inputTextWrapper : {
	// 	width:'88%'
	//   },
	//   marginBottom20:{
	// 	marginBottom: 20
	//   },
	// 	inputImgWrapper : {
	// 	width:'5%',
  //   },
  // ddContainer:{
	// 	backgroundColor:'transparent',
	// 	height: "auto",
	// 	paddingLeft:4,
	// 	height:30,
	//   },
  inputWrapper : {
		width:'100%',
	  marginLeft:8,

		borderColor:'#ed3c55',
		borderWidth:1,
		flexDirection:'row',
		borderRadius: 5,
	  },
	
	  inputTextWrapper : {
		width:'95%',
	  },
	  marginBottom20:{
		marginBottom: 20
	  },
		inputImgWrapper : {
		width:'8%', 
	  },
	  ddContainer:{
		backgroundColor:'transparent',
		// height: "auto",
		paddingLeft:2,
    height:40,
    borderWidth: 1,
    borderRadius:4
	  },
	 
  cancelbtn:{
    flexDirection:'row',paddingRight:10,
    marginBottom: 20,

  },
  wishbtn:{
    flex:0.6,
  },
  modalGreen1:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
  },
  // buttonGreen:{
  //   backgroundColor: colors.buttonGreen,
  //   height: 45,
  //   width:"100%",
  // },
  ordervwbtn:{
    flex:0.4,
  },
  rupeeicn:{
    marginTop:3,
    marginRight:3
  },
  rupeetxt:{
    fontSize:17,fontFamily:"Montserrat-SemiBold",
    alignItems : "center",flexDirection:'row'
  },
  flxdir:{
    flexDirection:'row'
  },
  flxdirview:{
    flexDirection:'row',
    // flex:1,
    justifyContent:"flex-start",
    alignItems:'flex-end',
    fontSize:RFPercentage(1.9),fontFamily:"Montserrat-SemiBold",color:'#333',
    marginBottom:10,
    marginLeft:wp(7.5),
    height:34,
  },
  // flxdir:{
  //   backgroundColor:'#fff',paddingHorizontal:15,marginBottom:"15%"
  // },
  featuretxt:{
    fontSize:20,fontFamily:"Montserrat-Regular",
  },
  featurelist:{
    flex: 1,marginTop:5, paddingLeft: 5,fontSize:12,fontFamily:"Montserrat-Regular",
  },
  catnsubcatvw:{
    borderWidth:1,borderRadius:5,
    borderColor:'#f1f1f1',backgroundColor:"#ccc",flexDirection:'row',
    width:120,marginBottom:30,marginTop:15
  },
  feature:{
    borderWidth:1,borderColor:'#ccc'
  },
  mgbtm15:{
    marginBottom:15
  },
  proddetails:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",marginBottom:10,marginTop:10
  },
  productDetails:{
    fontSize:12,fontFamily:"Montserrat-Regular",
  },
  mgtp3:{
    marginTop:3
  },
  buttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 30, 
    marginLeft:20,
    width:"80%",
  },
  mgrt10:{
    marginRight:10
  },
  mgrttp:{
    marginRight:10,marginTop:8
  },
  abtitm:{
    fontSize:RFPercentage(1.9),fontFamily:"Montserrat-SemiBold",marginBottom:10,marginTop:10
  },
  detailclr:{
    backgroundColor:'#fff',paddingVertical:hp(6.5),borderRadius:3,paddingTop:0
  },
  detailcolor:{
    fontSize:RFPercentage(2.5),fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  detaildetailstxt:{
    fontSize:RFPercentage(1.9),fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  disper:{
    fontSize:RFPercentage(1.9),fontFamily:"Montserrat-Regular",color:'#c10000',fontStyle:"italic",marginLeft:10
  },
  flxdirmgr:{
    flexDirection:'row',marginRight:10
  },
  originalprice:{
    textDecorationLine: 'line-through',fontSize:12,fontFamily:"Montserrat-Regular",
  },
  ogprice:{
    fontSize:16,fontFamily:"Montserrat-SemiBold",color:'#333',alignItems:'center',
  },
  disprice:{
    textDecorationLine:'line-through',fontSize:12,fontFamily:"Montserrat-Regular",color:'#666',marginLeft:10
  },
  subimg:{
    backgroundColor:"#fff",
    width:180,
    borderWidth:1,borderColor:'#ccc',
    flexDirection:'row',
  },
  flx:{
   flex : 1,
  },
  flx5:{
   flex : 0.5,
   borderWidth:1,borderColor:'#ccc',
  },

  noprod:{
    alignItems:'center',marginTop:'10%'
  },
  noprodtxt:{
    alignItems:'center',marginTop:'10%'
  },
  produrl:{
    fontSize:14,paddingVertical:5,fontFamily:"Montserrat-Regular",color:'#666'
  },
  subcategory:{
    width:'100%',flexDirection:'row',flexWrap:'wrap',marginBottom:'15%'
  },
  prodimg:{
    width:230, height: 230,alignItems:"center",alignSelf:"center",marginBottom:"20%"
  },
  subCategoryTitle:{
    fontSize:14,fontFamily:"Montserrat-SemiBold",textAlign:'center',position:'absolute',bottom:'-15%',color:'#333'
  },



  modalmainvw:{
    backgroundColor: "#fff",
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 30, 
    paddingHorizontal: 10,
    borderWidth:2,borderColor:colors.theme 
  },

  vendorNameBox:{
    height:hp(3),
    backgroundColor:'#ccc',
    marginBottom:10,
    paddingHorizontal:10,
    justifyContent:'center',
  },

  vendorName:{
    fontSize:11,
    color:'#000',
    marginVertical:2,
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
  ddContainer:{
    backgroundColor:'transparent',
    paddingHorizontal:4,
    borderWidth: 1,
    borderRadius:4,
    fontFamily:"Montserrat-Regular"
  },
  ddItemText:{
    fontFamily:"Montserrat-Regular",
    opacity: 1,
    fontSize:9,
    color: "#000000"
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
    height:28,
    opacity: 1,
    fontSize:11,
    color: "#000000",
  },
  discountPercent:{
    fontFamily:"Montserrat-Regular",
    color: "#5B8E7E",
    opacity: 1,
    fontSize:RFPercentage(2),
    marginBottom:1,
  },
  backText:{
    fontFamily:"Montserrat-SemiBold",
    color:'#000',
    fontSize:RFPercentage(1.8),
    flex:0.7,
    paddingTop:20,
    paddingBottom:10,
    textAlign:'center',
     
    // backgroundColor:'red',
  },

  starAvg:{
    fontSize:RFPercentage(2),
    fontFamily:"Montserrat-Medium",
    color:'#000',
  },

  ratingD1T2:{
    fontFamily:"Montserrat-Medium",
    fontSize:RFPercentage(1.5),
    color:'#000'
  },

  ratingD1T3:{
    fontFamily:"Montserrat-Medium",
    fontSize:RFPercentage(1.5),
    color:'#777777',
    paddingHorizontal:15,
    marginTop:15,
  },

  ratingNumber:{
    fontFamily:"Montserrat-Medium",
    fontSize:RFPercentage(3),
    color:'#000',
  },

  starimg:{
    height:hp(1.8),
    width:hp(1.8),
  },

  date:{
    fontFamily:"Montserrat-Medium",
    fontSize:RFPercentage(1.7),
    color:'#000',
  },

  saleimgRe:{
    width: wp(5),
    height: hp(2),
    marginTop:3,
  },
  accessory: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  triangle: {
    width: 8,
    height: 8,
    transform: [{
      translateY: -4,
    }, {
      rotate: '45deg',
    }],
  },

  triangleContainer: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent', /* XXX: Required */
  },
  
})
