import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
	menuWrapper:{
		flexDirection:'row',
		flex:1,
		
	},
		imageMenuWraper:{	
		borderWidth:1,marginBottom:"25%",marginRight:15,borderColor:'#f1f1f1',borderRadius:5
	},
		title:{
		 fontFamily:"Montserrat-SemiBold",
		 fontSize:16,
	},
	
});