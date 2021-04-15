import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
	menuWrapper:{
		marginTop:20,
		flexDirection:'row',
		flex:1
	},
	mainrightside: {
		width: "50%",
		padding: 5,
	},
	proddets: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap', 
		marginBottom: '1%'
	},
	imageMenuWraper:{	
		borderWidth:1,
		backgroundColor : 'red',
		borderColor:'#ccc',borderRadius:5,
		// width: 120,
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
		borderWidth:1,borderColor:"#f2f2f2",width:"100%",marginVertical:20
	},
	sectiontitle:{
		color:'#333',flexShrink:1,textAlign:'center',marginTop:10,fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'
	},
	sectionImages:{
		height:100,borderRadius:5,width: "100%",borderWidth:1,borderColor:'#999',alignItems:'flex-end'
	},
	// mainrightside: {
	// 	width: "50%",
	// 	padding: 5,
	// },
}); 