// ========================= InLIne scroll ====================
import { StyleSheet} from 'react-native';
import { colors } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export default StyleSheet.create({
	menuWrapper:{
		marginTop:20,
		flexDirection:'row',
		flex:1
	},
	mainrightside: {
		minWidth: wp(35),
		padding: 4,
		
		// backgroundColor:"#fff"
	},
	sectionImages:{
		// width: 100,
		paddingHorizontal:15,
		justifyContent:"center",
		alignItems:"center",
		borderRadius: 5,
		overflow: "hidden",
	},
	proddets: {
		flexDirection: 'row',
		// marginBottom: '1%',
	},
	categoryContainer: {
		// flexDirection: 'row',
		// marginBottom: '1%',
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
		marginTop:15
	},
	title:{
		fontFamily:"Montserrat-SemiBold",
		fontSize:16,
		marginTop:15
	},
	menuborderstyle:{
		borderWidth:1,
		borderColor:"#f2f2f2",
		width:"100%",
		marginVertical:20
	},
	sectiontitle:{
		// textShadowColor: 'rgba(0, 0, 0, 0.75)',
		// textShadowOffset: {width: -1, height: 1},
		// textShadowRadius: 10,
		color:'#000000',
		flexShrink:1,
		textAlign:'center',
		// marginTop:10,
		fontSize:14,
		fontFamily:"Montserrat-Medium",
		flexWrap: 'wrap',
		opacity: 1
	},
	categoryTitle:{
		// textShadowColor: 'rgba(0, 0, 0, 0.75)',
		// textShadowOffset: {width: -1, height: 1},
		// textShadowRadius: 10,
		color:'#000000',
		flexShrink:1,
		textAlign:'center',
		// marginTop:10,
		fontSize:RFPercentage(1.6),
		fontFamily:"Montserrat-Medium",
		flexWrap: 'wrap',
		opacity: 1
	},
}); 