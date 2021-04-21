// import { StyleSheet, Dimensions, Platform } from 'react-native';
// import {colors} from '../styles.js';
// const window = Dimensions.get('window');

// export default StyleSheet.create({
//   menuWrapper: {
//     marginTop: 20,
//     flexDirection: 'row',
//     flex: 1
//   },
//   superparent: {
//     flex: 1,
//     //  backgroundColor: '#f1f1f1'
//   },
//   parent: {
//     backgroundColor: '#fff', 
//     paddingHorizontal: 15, 
//     marginBottom: "15%",
//     marginTop: 15
//   },
//   width160: {
//     width: 160
//   },
//   catimg: {
//     height: 200, width: 160,
//   },
//   peroff: {
//     backgroundColor: '#666', 
//     position: 'absolute', 
//     bottom: "5%", 
//     borderWidth: 1,
//     padding: 3, 
//     borderColor: '#666', 
//     borderRadius: 5, 
//     color: '#fff', 
//     marginLeft: 10
//   },
//   padvert: {
//     paddingVertical: 10,
//   },
//   prodtitle: {
//     fontSize: 12, fontFamily: "Montserrat-SemiBold", color: '#333',textAlign:'center',
//   },
//   prodname: {
//     flex: 1, fontSize: 13, flexWrap: "wrap", fontFamily: "Montserrat-Regular", color: '#666', paddingVertical: 5
//   },
//   rs: {
//     flexDirection: "row", 
//     marginTop: 3,
//     justifyContent:"center",
//   },
//   rsicn: {
//     marginTop: 5, 
//     marginRight: 3
//   },
//   rsprice: {
//     textDecorationLine: 'line-through', 
//     fontSize: 12, 
//     alignItems:'center',
//     fontFamily: "Montserrat-SemiBold", 
//     marginLeft: 10
//   },
//   iconvw: {
//     justifyContent: 'center', 
//     backgroundColor: "#f00", 
//     width: 25, height: 25, 
//     borderRadius: 25, 
//     overflow: 'hidden'
//   },
//   nameprod: {
// 		fontSize: 15, fontFamily: "Montserrat-SemiBold", color: '#666'
//   },
//   productname: {
// 		fontSize: 19, fontFamily: "Montserrat-SemiBold", color: '#333',
// 	},
// 	shortDescription: {
// 		fontSize: 20,
// 		fontFamily: "Montserrat-SemiBold",
// 		fontFamily: "kruti",
// 		 color: '#111',
// 	},
//   wishlist: { 
//     backgroundColor: "#f1f1f1", 
//     width: 160,
//     borderWidth: 1, 
//     borderColor: '#f1f1f1', 
//     flexDirection: 'row',
//   },
//   proddets:{
//     width:'100%',flexDirection:'row',flexWrap:'wrap',marginBottom:'15%'
//   },
//   wishlisthrt:{
//     position:'absolute',
//     bottom:"5%",
//     top: 10,left:140
//   },
//   vwwishlist: {
//     width: '100%', flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     marginBottom: '10%', marginTop: 15
//   },
//   placeonvw: {
//     flex: 1, marginBottom: "30%"
//   },
//   imageMenuWraper: {
//     borderWidth: 1,
//      borderColor: '#f1f1f1', 
//     borderRadius: 5, width: 150, height: 85, 
//     backgroundColor: '#ccc', marginRight: 15
//   },
//   formWrapper: {
//     paddingHorizontal: 15
//   },
//   categoryTitle: {
//     color: '#333', textAlign: 'center', 
//     marginTop: 5, marginBottom: 10, 
//     fontSize: 13, fontFamily: "Montserrat-Regular", 
//     flexWrap: 'wrap'
//   },
//   catImage: {
//     flex: 0.5, marginRight: 10, 
//     backgroundColor: '#ccc', borderWidth: 0, 
//     borderColor: '#f1f1f1', height: 200
//   },
//   catTitle: {
//     fontSize: 14, fontFamily: "Montserrat-SemiBold", textAlign: 'center', marginTop: 10
//   },
//   mg10: {
//     marginRight: 10
//   },
//   button: {
//     marginRight: 10,
//     backgroundColor: colors.buttonGreen,
//     height: 35,

//   },
//   buttonText: {
//     color: colors.buttonText,
//     fontFamily: "Montserrat-SemiBold",
//     fontSize: 11,

//   },
//   buttonContainer: {
//     marginTop: 15,
//     marginBottom: 15,
//     ...Platform.select({
//       ios: {
//         justifyContent: 'center',


//       },
//       android: {
//         alignItems: 'center',

//       }
//     })
//   },
//   button1: {
//     backgroundColor: colors.button1,
//     height: 45,
//     width: "100%",



//   },
//   buttonText1: {
//     color: colors.buttonText,
//     fontFamily: "Montserrat-Regular",
//     textTransform: 'uppercase',
//     fontSize: 13

//   },
//   buttonContainer1: {

//     marginTop: 15,
//     marginBottom: 15,
//     ...Platform.select({
//       ios: {
//         justifyContent: 'center',


//       },
//       android: {
//         alignItems: 'center',
//       }
//     })
//   },

// })



import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  menuWrapper:{
    marginTop:20,
    flexDirection:'row',
    flex:1
  },
  containerViews:{
    // backgroundColor:'#ff0'
  },
  imageMenuWraper:{ 
  borderWidth:1,borderColor:'#f1f1f1',
  borderRadius:5,width: 150, height:85, backgroundColor: '#ccc',marginRight:15
  },
  formWrapper:{
  	paddingHorizontal:15
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
    fontFamily:"Montserrat-SemiBold",
    textTransform: 'uppercase',
    fontSize:13
  },
  yesmodalbtn:{
    marginTop : 15,
  },
  addsuperparent:{
    flex:1,backgroundColor:'#fff'
  },
  category:{
    color:'#333',textAlign:'center',marginTop:8,fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'
  },
  catimg:{
    height:80,borderRadius:5,width: 120
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
    top: 10,left:140
  },
  width160:{
    width:"50%",
    padding : 5,
  },
  proddets:{
    width:'100%',flexDirection:'row',flexWrap:'wrap',marginBottom:'15%'
  },
  nameprod:{
    fontSize:15,fontFamily:"Montserrat-SemiBold",color:'#666'
  },
  urlprod:{
    flex:1,fontSize:13,flexWrap: "wrap",fontFamily:"Montserrat-Regular",color:'#666',paddingVertical:5
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
    alignItems : "center",marginBottom:10,
  },
  productname:{
    fontSize:20,
    fontFamily:"Montserrat-SemiBold",
    color:'#666',
  },
  shortDescription:{
    fontSize:18,
    // fontFamily:"kruti",
    // fontFamily:"KrutiDev010",
    ...Platform.select({
			ios: {
				fontFamily: "KrutiDev010",
			},
			android: {
				fontFamily: "kruti",
			}
		}),
    color:'#333',
  },
  brandname: {
		fontSize: 12, 
		fontFamily: "Montserrat-SemiBold", 
		marginLeft: 2, color: '#666', 
		alignItems: 'center',
	},
  packofnos: {
		fontSize: 12, 
		fontFamily: "Montserrat-SemiBold", 
		marginLeft: 2, color: '#666', 
		alignItems: 'center',
	},
  proddetprice:{
    fontSize:18,
    fontFamily:"Montserrat-Bold",
    color : "#333",
  },
  star:{
    flex:0.2,backgroundColor:'#388e3c',borderRadius:3,paddingVertical:3,
  },
  staricn:{
    flexDirection:'row',justifyContent:'center',
  },
  saleimg:{
    height:200,width:350 ,marginBottom:20,
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
  iconvw: {
        justifyContent: 'center', 
        backgroundColor: "#f00", 
        width: 25, height: 25, 
        borderRadius: 25, 
        overflow: 'hidden'
      },
  qtys:{
    flex:0.6,
    alignItems:"flex-end"
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

  },
  cancelbtn:{
    flexDirection:'row',paddingRight:10,
    marginBottom: 20,

  },
  wishbtn:{
    flex:0.6,
  },
  modalbuttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
  },
  ordervwbtn:{
    flex:0.4,
  },
  rupeeicn:{
    marginTop:5,marginRight:3
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
    justifyContent:"center",
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333',
    marginBottom:20,
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
    borderWidth:1,borderRadius:5,borderColor:'#f1f1f1',backgroundColor:"#ccc",flexDirection:'row',width:160,marginBottom:30,marginTop:15
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
    
    ...Platform.select({
      ios:{
        height: 35,
      },
      android:{height: 25,}
    }),
    marginLeft:15,
    width:"80%",
  },
  mgrt10:{
    marginRight:10
  },
  mgrttp:{
    marginRight:10,marginTop:8
  },
  abtitm:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",marginBottom:10,marginTop:10
  },
  detailclr:{
    backgroundColor:'#fff',padding:10,borderRadius:3,marginTop:15
  },
  detailcolor:{
    fontSize:16,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  detaildetailstxt:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  disper:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#c10000',fontStyle:"italic",marginLeft:10
  },
  flxdirmgr:{
    flexDirection:'row',marginRight:10
  },
  originalprice:{
    textDecorationLine: 'line-through',fontSize:12,fontFamily:"Montserrat-Regular",
  },
  ogprice:{
    fontSize:16,fontFamily:"Montserrat-SemiBold",marginLeft:2,color:'#333',alignItems:'center',
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
  subcatimg:{
    height:150,width:"100%",
    borderWidth:1,borderBottomColor:'#ccc',
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
  buttonshopping:{
    backgroundColor: colors.button1,
    height: 45,
  },
  continueshopping:{
    marginTop:20,
    marginBottom:10,
  },
})
