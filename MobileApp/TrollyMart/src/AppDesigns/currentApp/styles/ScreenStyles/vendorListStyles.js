import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../styles.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default StyleSheet.create({
	vendorListBox:{
		marginBottom:hp(0.5),alignItems:'flex-end',width:wp(15),
	},
	
	container:{
		flex:1,
		// paddingHorizontal:15,
		paddingVertical:5,
		backgroundColor:"#fff",
		marginBottom:hp(2)
	},

	containerStyle:{
		padding:0,
		borderRadius:7,
		height:wp(20),
		marginLeft:wp(5),
		width:"85%",
		marginHorizontal:0,
		shadowColor: "#000",
		shadowOffset: {
			width: -4,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	imageStyle:{
		borderRadius:hp(100),
		borderWidth:0.5,
		borderColor:'#033554',
		height:wp(15),
		width:wp(15),
		backgroundColor:"#fff",
		alignSelf:'center'
	},
	imageStyle1:{
		borderRadius:hp(100),
		borderWidth:0.5,
		borderColor:'#033554',
		height:wp(20),
		width:wp(20),
		backgroundColor:"#fff",
		alignSelf:'center'
	},
	logoBox:{
		// flex:0.2,
		position:"absolute",
		justifyContent:'center',
		alignItems:'center',
		height:wp(20),
		// height:80,
		// width:80,
		left:wp(-6),
		shadowColor: "#000",
		shadowOffset: {
			width: -4,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	logoBox1:{
			// flex:0.2,
		position:"absolute",
		justifyContent:'center',
		alignItems:'center',
		height:wp(20),
		// height:80,
		// width:80,
		left:wp(-6),
		shadowColor: "#000",
		shadowOffset: {
			width: -4,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},

	timeText:{
		position:'absolute',
		top:10,
		right:0,
	},

	block1:{
		// position:"absolute",
		top:0,
		left:0,
		right:0,
		height:185,
		backgroundColor:"#fff",
	},
	
	topText:{
		fontSize:RFPercentage(2),
		fontFamily: "Montserrat-Regular", 
		color:'#fff',
		alignSelf:'center'
	},
	proddets: {
		flex:1,
		// minHeight:Dimensions.get('window').height,
		flexDirection: 'row',
		marginBottom:hp(8),
		paddingHorizontal:wp(2),
		// backgroundColor:"#ff0"
	},
	iconStyle:{
		height:hp(3.5),
		width:hp(3.5),
		marginRight:10,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:4,
		shadowColor: "#000",
		shadowOffset: {
			width: -2,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		
		elevation: 5,
		borderWidth:1,
		borderColor:"#f1f1f1",
		backgroundColor:"#fff"
	},
	

})
