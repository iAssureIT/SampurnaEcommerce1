import { StyleSheet, Dimensions,Platform } from 'react-native';
const window = Dimensions.get('window');

export default StyleSheet.create({
	menuWrapper:{
		marginTop:20,
		flexDirection:'row',
		flex:1
	},
	imageMenuWraper:{	
	borderWidth:1,borderColor:'#ccc',borderRadius:5,width: 120, height: 80, backgroundColor: '#ccc',marginRight:15
	}
});