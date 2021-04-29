// import { StyleSheet} from 'react-native';
// export default StyleSheet.create({
// 	menuWrapper:{
// 		marginTop:20,
// 		flexDirection:'row',
// 		flex:1
// 	},
// 	mainrightside: {
// 		width: "50%",
// 		padding: 5,
// 	},
// 	proddets: {
// 		width: '100%',
// 		flexDirection: 'row',
// 		flexWrap: 'wrap', 
// 		marginBottom: '1%'
// 	},
// 	imageMenuWraper:{	
// 		borderWidth:1,
// 		backgroundColor : 'red',
// 		borderColor:'#ccc',borderRadius:5,
// 		height: 80, 
// 		backgroundColor: '#ccc',
// 		marginRight:15,marginTop:20,
// 	},
// 	title:{
// 		fontFamily:"Montserrat-SemiBold",
// 		fontSize:16,
// 		marginTop:15
// 	},
// 	title:{
// 		fontFamily:"Montserrat-SemiBold",
// 		fontSize:16,
// 		marginTop:15
// 	},
// 	menuborderstyle:{
// 		borderWidth:1,borderColor:"#f2f2f2",width:"100%",marginVertical:20
// 	},
// 	sectiontitle:{
// 		color:'#333',flexShrink:1,textAlign:'center',marginTop:10,fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'
// 	},
// 	sectionImages:{
// 		height:100,borderRadius:5,width: "100%",borderWidth:1,borderColor:'#999',alignItems:'flex-end'
// 	},
// }); 


// ========================= InLIne scroll ====================

import { StyleSheet} from 'react-native';
export default StyleSheet.create({
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
	proddets: {
		flexDirection: 'row',
		marginBottom: '1%',
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
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10,
		color:'#333',
		flexShrink:1,
		textAlign:'center',
		marginTop:10,
		fontSize:13,
		fontFamily:"Montserrat-SemiBold",
		flexWrap: 'wrap'
	},
	sectionTitle:{
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 15,
		marginTop: 30,	
	}
}); 