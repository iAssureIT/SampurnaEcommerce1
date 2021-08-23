import { StyleSheet} from 'react-native';
import { colors } from '../styles.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default StyleSheet.create({
	container:{
		width:160,
		minHeight:150,
		marginRight:10,
		backgroundColor:"#fff",
		borderWidth:0.5,
		borderColor:"#707070",
		elevation:5
	},
	menuWrapper:{
		marginTop:20,
		flexDirection:'row',
		flex:1
	},
	mainrightside: {
		// width: 108,
		padding: 4,
	},
	sectionImages:{
		width: 100,
		height: 80,
		borderRadius: 8 ,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: '#999'
	},
	productContainer: {
		// width:"42.5%",
		// paddingVertical:5,
		backgroundColor:"#fff",
		marginBottom:15,
		borderRadius:15,
		// shadowColor: "#000",
		elevation: 5,
		borderColor:colors.cartButton,
		borderWidth:0.5,
	},
	proddets: {
        // marginBottom:15,
		// marginBottom: '1%',
        // height:150,
        // flex:1,
	},
	imageMenuWraper:{	
		borderWidth:1,
		backgroundColor : 'red',
		borderColor:'#ccc',borderRadius:5,
		height: 80, 
		backgroundColor: '#ccc',
		marginRight:15,marginTop:20,
	},
	title:{
		fontFamily:"Montserrat-SemiBold",
		fontSize:16,
		paddingVertical:5
	},
	menuborderstyle:{
		borderWidth:1,
		borderColor:"#f2f2f2",
		width:"100%",
		marginVertical:20
	},
	sectiontitle:{
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10,
		color:'#333',
		flexShrink:1,
		textAlign:'center',
		marginTop:10,
		fontSize:13,
		fontFamily:"Montserrat-SemiBold",
		// flexWrap: 'wrap'
	},
	sectionTitle:{
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 15,
		marginTop: 30,	
	},
	subcatimg: {
		marginTop:15,
		height:100,
		width:120,
		alignSelf:'center',
		borderTopRightRadius:15,
		borderTopLeftRadius:15,
			// borderWidth: 1, borderBottomColor: '#ccc',
	},
	subcatimg1: {
		height:hp(15),
		width:'100%',
		// alignSelf:'center',
		justifyContent:'flex-end',
		borderTopRightRadius:15,
		borderTopLeftRadius:15,
			// borderWidth: 1, borderBottomColor: '#ccc',
	},
    nameprod: {
		fontSize: RFPercentage(1.5), 
        fontFamily: "Montserrat-Regular", 
        color: '#fff',
		opacity:1,
        alignSelf:"center",
	},
    peroff: {
		backgroundColor: '#666', 
        position: 'absolute',
        borderWidth: 1, 
		top: 120, 
        padding: 1,
		borderColor: '#666',
		borderRadius: 5, color: '#fff',
		marginLeft: 10,fontSize: 10,
	},
    protxt: {
		marginTop: 10, alignItems: "center",justifyContent:"center",
		paddingHorizontal:2
	},
    // prdet: {
	// 	flex:1,
	// 	marginTop: 5, alignItems: "center",
	// 	marginBottom: 10,
	// },
    flxdir: {
		flexDirection: 'row'
	},
    discountpricecut: {
		fontSize: 14, fontFamily: "Montserrat-SemiBold",
		textDecorationLine: 'line-through',
	},
    ogprice: {
		fontSize: 14, fontFamily: "Montserrat-SemiBold", color: '#333', alignItems: 'center',
	},
    packofnos: {
		fontSize: 12, 
		fontFamily: "Montserrat-SemiBold", 
		marginLeft: 2, color: '#666', 
		alignItems: 'center',
	},
}); 