import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../styles.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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

	  brandname:{
		fontSize:RFPercentage(2.3),
		color:'#ccc'
	  },

	  productName:{
		fontSize:RFPercentage(2.2),
		color:'#000'
	  },

	  container:{
		  position:'absolute',
		  top:0,
		  left:0,
		  right:0,
		  height:200,
		  elevation:4,
		  zIndex:100
	  },
	menuWrapper: {
		marginTop: hp(2.5),
		flexDirection: 'row',
		flex: 1
	},
	containerViews: {
		// backgroundColor:'#ff0'
	},
	featurelistwrap: {
		 flexDirection: 'row', flexWrap: 'wrap', flex:1,
	},
	

	title: {
		fontFamily: "Montserrat-SemiBold",
		fontSize: RFPercentage(2.5),
	},
	titleviewall: {
		fontFamily: "Montserrat-Regular",
		fontSize: RFPercentage(2.2),
		color:'blue',
		marginBottom: 12,
	},
	button: {
		marginRight: 10,
		backgroundColor: colors.button,
		height: 35,

	},
	buttonText: {
		color: colors.buttonText,
		fontFamily: "Montserrat-Regular",
		fontSize: RFPercentage(1.9),
	},
	mg10:{
		margin:10,
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
	yesmodalbtn: {
		marginTop: 15,
		marginBottom: 0,
	},
	addsuperparent: {
		flex: 1, backgroundColor: '#999'
	},
	category: {
		color: '#333', textAlign: 'center', marginTop: 8, fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", flexWrap: 'wrap'
	},
	catimg: {
		height: 80, borderRadius: 5, width: 120
	},

	peroff: {
		backgroundColor: '#666', position: 'absolute',
		bottom: "5%", borderWidth: 1, padding: 3,
		borderColor: '#666',
		borderRadius: 5, color: '#fff',
		marginLeft: 10,
	},
	wishlisthrt: {
		position: 'absolute',
		// bottom: "5%",
		top: 10, 
		left: "97%",
		zIndex:1,
	},
	disCountLabel: {
		position: 'absolute',
		height:hp(6),
		left: "5%",
		width:hp(6),
		zIndex:1,
		// bottom: "5%",
		// top: 5, 
		// left: "80%"
	},
	width160: { 
		width: 180,
		padding: 3,
	},
	productContainer: {
		width:"42.5%",
		// paddingVertical:5,
		backgroundColor:"#fff",
		marginBottom:15,
		borderRadius:15,
		// shadowColor: "#000",
		shadowColor: "#000",
		shadowOffset: {
			width: -3,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
		borderColor:colors.cartButton,
		borderWidth:0.5,
	},
	proddets: {
		flex:1,
		minHeight:Dimensions.get('window').height,
		flexDirection: 'row',
		// backgroundColor:"#ff0"
	},
	nameprod: {
		fontSize: RFPercentage(1.8), fontFamily: "Montserrat-SemiBold", color: '#000'
	},
	urlprod: {
		flex: 1, fontSize: RFPercentage(1.9), flexWrap: "wrap", fontFamily: "Montserrat-Regular", color: '#666', paddingVertical: 5
	},
	flxmgtp: {
		flexDirection: "row", marginTop: 3
	},
	padvert10: {
		paddingVertical: hp(2.5),
		// backgroundColor:'#fff',
	},
	heartwish: {
		alignItems: "flex-end"
		// backgroundColor:'#fff',
	},
	proddisperoff: {
		// backgroundColor:'red',
		width: 25, height: 25, borderRadius: 25, overflow: 'hidden',
		// alignItems: 'flex-end'

	},
	subcat: {
		backgroundColor: '#fff', paddingHorizontal: 15, marginBottom: '30%', marginTop: hp(2.5)
	},
	catsuperparent: {
		flex: 1,
		backgroundColor: '#f1f1f1', marginBottom: 50
	},
	imgvw: {
		borderWidth: 1,
		borderColor: "#aaa",
		padding: 5,
	},
	flxmgstart: {
		flex: 1,
		flexDirection: "row", marginTop: 15,
		alignItems: "flex-end",
	},
	prodviewcatsuperparent: {
		flex: 1,
		backgroundColor: '#fff', marginBottom: 50
	},
	flxmg: {
		flexDirection: "row", marginTop: 15
	},
	prodname: {
		flex: 0.8
	},
	prodnameview: {
		flex: 1,
		fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", color: '#333',
		alignItems: "center", marginBottom: 10,
	},
	productname: {
		fontSize: RFPercentage(2.9), fontFamily: "Montserrat-SemiBold", color: '#333',
	},
	shortDescription: {
		fontSize: RFPercentage(3),
		fontFamily: "Montserrat-SemiBold",
		...Platform.select({
			ios: {
				fontFamily: "KrutiDev010",
			},
			android: {
				fontFamily: "kruti",
			}
		}),
		 color: '#111',
	},
	star: {
		flex: 0.2, backgroundColor: '#388e3c', borderRadius: 3, paddingVertical: 3,
	},
	staricn: {
		flexDirection: 'row', justifyContent: 'center',
	},
	saleimg: {
		height: 300, width: 380,
	},
	orderstatus: {
		flex: 1, flexDirection: "row",
		backgroundColor: '#fff', marginTop: 15, paddingHorizontal: 15,
		paddingVertical: 15, borderWidth: 1, borderColor: '#f1f1f1',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 1,
	},
	orderstatustxt: {
		flex: 0.4,
		fontSize: RFPercentage(2.6), fontFamily: "Montserrat-SemiBold", color: '#666',
	},
	kgs: {
		flex: 0.4,
	},

	qtys: {
		flex: 0.6,
		alignItems: "flex-end"
	},
	icnstar: {
		marginTop: 3, marginRight: 5
	},
	prodqty: {
		fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", color: '#fff', marginTop: 0,
	},
	protxt: {
		paddingLeft:5,
		// alignItems:'center'
	},
	prdet: {
		flex:1,
		// alignItems: "center",
		marginBottom:10,
		marginLeft:5
	},
	// addtocartbtn: {
	// 	marginBottom: 20,
	// 	flex:1,flexDirection:'row',
	// },
	addtocartbtn:{
		// marginBottom : 20,
		//flex:1,
		//  flexDirection:'row',
		flexDirection: "column",
		justifyContent: "center",
	   },
	 
	sizedrpbtn: {
		paddingHorizontal:15,
		flex:0.5,
		...Platform.select({
			ios:{
				marginRight:8,
			}
		})
	}, 
 
	inputWrapper : {
		margin:10,
		alignSelf:"center",
		borderColor:colors.theme,
		borderWidth:1,
		flexDirection:'row',
		borderRadius: 5,
		backgroundColor:"#fff",
		// height:30,
	  },
	
	  inputTextWrapper : {
		width:'80%',
		alignSelf:"center",
		backgroundColor:"#fff",
		marginBottom:15
		// height:30,
	  },
	  textWrapper:{
		marginBottom:0
	  },
	  marginBottom20:{
		marginBottom: 20
	  },
		inputImgWrapper : {
		// width:'8%', 
	  },
	  ddContainer:{
		backgroundColor:'transparent',
		padding:0,
		// borderWidth:1,
		// height:30,
		// marginVertical:15,
		// paddingLeft:2,
		margin:0,
		
	  },
	  ddInputContainer:{
		  padding:0,
		  margin:0
	  },
	cancelbtn: {
		flexDirection: 'row', paddingRight: 10,
		marginBottom: 20,

	},
	wishbtn: {
		flex: 0.6,
	},
	// buttonGreen:{
	// 	backgroundColor: colors.buttonGreen,
	// 	height: 45,
	// 	width:"100%",
	//   },
	modalGreen1:{
		backgroundColor: colors.button,
		height: 45,
		width:"100%",
	  },
	ordervwbtn: {
		flex: 0.4,
	},
	rupeeicn: {
		marginTop: 5, marginRight: 3
	},
	rupeetxt: {
		fontSize: RFPercentage(2.6), fontFamily: "Montserrat-SemiBold",
		alignItems: "center", flexDirection: 'row'
	},
	flxdir12: {
		flexDirection: 'row',
	},
	flxdir: {
		flexDirection: 'row',
	},
	flxdirview: {
		flexDirection: 'row',
		// flex:1,
		justifyContent: "center",
		fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", color: '#333',
		marginBottom: 20,
	},
	// flxdir:{
	//   backgroundColor:'#fff',paddingHorizontal:15,marginBottom:"15%"
	// },
	featuretxt: {
		fontSize: RFPercentage(3), fontFamily: "Montserrat-Regular",
	},
	featurelist: {
		flex: 1, marginTop: 5, paddingLeft: 5, fontSize : RFPercentage(1.8), fontFamily: "Montserrat-Regular",
	},
	catnsubcatvw: {
		borderWidth: 1, borderRadius: 5, borderColor: '#f1f1f1', backgroundColor: "#ccc", flexDirection: 'row', width: 160, marginBottom: 30, marginTop: 15
	},
	feature: {
		borderWidth: 1, borderColor: '#ccc'
	},
	mgbtm15: {
		marginBottom: 15
	},
	proddetails: {
		fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", marginBottom: 10, marginTop: 10
	},
	productDetails: {
		fontSize : RFPercentage(1.8), fontFamily: "Montserrat-Regular",
	},
	mgtp3: {
		marginTop: 3
	},
	buttonGreen: {
		backgroundColor: '#ed3c55',
		height: 30,
		marginLeft: 15,
		width: "80%",
	},
	mgrt10: {
		marginRight: 10
	},
	mgrttp: {
		marginRight: 10, marginTop: 8
	},
	abtitm: {
		fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", marginBottom: 10, marginTop: 10
	},
	detailclr: {
		backgroundColor: '#fff', padding: 10, borderRadius: 3, marginTop: 15
	},
	detailcolor: {
		fontSize: RFPercentage(2.5), fontFamily: "Montserrat-SemiBold", color: '#333'
	},
	detaildetailstxt: {
		fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", color: '#333'
	},
	disper: {
		fontSize: RFPercentage(1.9), fontFamily: "Montserrat-Regular", color: '#c10000', fontStyle: "italic", marginLeft: 10
	},
	flxdirmgr: {
		flexDirection: 'row', marginRight: 10
	},
	originalprice: {
		textDecorationLine: 'line-through', fontSize : RFPercentage(1.8), fontFamily: "Montserrat-Regular",
	},
	disprice:{
		fontSize: RFPercentage(2.2), fontFamily: "Montserrat-SemiBold", marginHorizontal: 5, color: '#ccc', alignItems: 'center',
	},
	ogprice: {
		fontSize : RFPercentage(1.8), fontFamily: "Montserrat-Bold", color: '#000',
	},
	ogpriceC: {
		fontSize: RFPercentage(1.8), fontFamily: "Montserrat-Bold", color: '#aaa',
	},
	
	discountpricecut: {
		fontSize : RFPercentage(1.8), fontFamily: "Montserrat-Bold",
		textDecorationLine: 'line-through',
		textDecorationColor: '#EF4D4D',
		color:'#ccc',
		marginHorizontal: 2,
	},

	packofnos: {
		fontSize : RFPercentage(1.8), 
		fontFamily: "Montserrat-SemiBold", 
		marginLeft: 2, color: '#666', 
		alignItems: 'center',
	},
	disprice: {
		fontSize : RFPercentage(1.8), fontFamily: "Montserrat-SemiBold", color: '#000', marginLeft: 5
	},
	subimg: {
		backgroundColor: "#fff",
		width: 180,
		borderWidth: 1, borderColor: '#ccc',
		flexDirection: 'row',
	},
	flx: {
		flex: 1,
	},
	maintitle: {
		flex: 1,
		flexDirection:'row',
	},
	flx5: {
		flex: 0.5,
		borderColor: '#ccc',
		// paddingBottom:15,
	},
	viewalltxt: {
		flex: 0.5,
		alignItems:'flex-end',
		
	},
	subcatimg: {
		height:hp(15),
		width:wp(28),
		alignSelf:'center',
		// borderTopRightRadius:15,
		// borderTopLeftRadius:15,
			// borderWidth: 1, borderBottomColor: '#ccc',
	},
	noprod: {
		alignItems: 'center', marginTop: '10%'
	},
	noprodtxt: {
		alignItems: 'center', marginTop: '10%'
	},
	produrl: {
		fontSize: 14, paddingVertical: 5, fontFamily: "Montserrat-Regular", color: '#666'
	},
	subcategory: {
		width: '100%', 
		flexDirection: 'row',
		 flexWrap: 'wrap',
		  marginBottom: '15%'
	},
	prodimg: {
		width: '100%', height: 230, alignItems: "center", alignSelf: "center", marginBottom: "20%"
	},
	subCategoryTitle: {
		fontSize: 14, fontFamily: "Montserrat-SemiBold", textAlign: 'center', position: 'absolute', bottom: '-15%', color: '#333'
	},

	modalmainvw:{
		backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme 
	 },

	 soldout:{
		alignSelf:'center',
		marginTop:118,
		height:60,
		width:75,
		position:'absolute',
		zIndex:1
	 },

	buttonContainer1: {

		marginTop: 15,
		marginBottom: 15,
		...Platform.select({
			ios: {
				justifyContent: 'center',


			},
			android: {
				alignItems: 'center',
				justifyContent: 'center',
				textAlign:'center'
			}
		})
	},

})
