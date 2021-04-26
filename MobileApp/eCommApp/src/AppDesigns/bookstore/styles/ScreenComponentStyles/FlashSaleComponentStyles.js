import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
	menuWrapper:{
		flexDirection:'row',
		flex:1,
	},
	imageMenuWraper:{	
	borderWidth:1,borderColor:'#ccc',borderRadius:50,width: 50, height: 50, backgroundColor: '#ccc',marginBottom:45,marginRight:35
	},
		title:{
		 fontFamily:"Montserrat-SemiBold",
		 fontSize:16,
		 paddingVertical:15, 

	},
});