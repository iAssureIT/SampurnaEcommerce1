import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
	title:{
		 fontFamily:"Montserrat-SemiBold",
		 fontSize:16,
		 marginBottom:12,

	},
	popularWrapper:{
	flex:0.5, height:100,borderWidth:1,borderColor:'#ccc',borderRadius:5,width:'100%',marginRight:15,marginBottom:15
	}

});