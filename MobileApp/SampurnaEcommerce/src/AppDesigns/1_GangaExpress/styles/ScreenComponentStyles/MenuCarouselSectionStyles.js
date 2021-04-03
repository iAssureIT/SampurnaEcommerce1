import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
	menuWrapper:{
		marginTop:20,
		flexDirection:'row',
		flex:1
	},
	imageMenuWraper:{	
	borderWidth:1,borderColor:'#ccc',borderRadius:5,width: 120, height: 80, backgroundColor: '#ccc',marginRight:15,marginTop:20,
	},
	title:{
		 fontFamily:"Montserrat-SemiBold",
		 fontSize:16,
		 marginTop:15

	},
}); 