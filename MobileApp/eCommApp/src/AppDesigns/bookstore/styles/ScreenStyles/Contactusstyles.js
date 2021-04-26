import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  superparent:{
    flex:1,backgroundColor:'#f1f1f1'
  },
  parent:{
    flex:1,paddingHorizontal:15,marginTop:15,marginBottom:"20%"
  },
  contactdets:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  contactvw:{
    borderWidth:1,borderColor:'#f1f1f1',backgroundColor:"#fff",height:250,borderRadius:5,marginTop:10,
  },
  flxdir:{
    flexDirection:'row'    
  },
  imgvw:{
    flex:0.4,padding:20
  },
  imgbg:{
    width: "100%", height:"100%",
  },
  qty15:{
    borderWidth:1,borderColor:"#ccc",padding:13,height:50
  },
  contacticn:{
    borderWidth:1,borderColor:"#ccc",padding:5,borderTopLeftRadius:5,height:50,borderBottomLeftRadius:5
  },
  soldby:{
    fontSize:12,fontFamily:"Montserrat-Regular", color:'#666'
  },
  fashioncontact:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#3090C7'
  },
  pricers:{
    fontSize:13,fontFamily:"Montserrat-Regular",
  },
  peroffcont:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#c10000',fontStyle:"italic",marginLeft:10
  },
  rscontact:{
    flex:0.8,marginTop:18
  },
  contactcontent:{
    fontSize:12,fontFamily:"Montserrat-SemiBold",flexWrap:'wrap'
  },
  rsvw:{
    flexDirection:'row',marginRight:10
  },
  contacticns:{
    marginTop:5,marginRight:3,
  },
  mincircleicn:{
    marginTop:10,marginRight:3,paddingHorizontal:5
  },
  contimgvw:{
    borderWidth:1,borderColor:"#ccc",padding:5,borderTopRightRadius:5,height:50,borderBottomRightRadius:5
  },
  plusciricn:{
    marginTop:10,marginRight:3,paddingHorizontal:5
  },
  deletevw:{
    flexDirection:'row',marginTop:15,paddingRight:10
  },
  totalvw:{
    backgroundColor:'#fff',borderWidth:1,borderColor:"#f1f1f1",height:180,marginTop:15,paddingHorizontal:15,paddingVertical:15
  },
  totvw:{
    flex:1,flexDirection:"row"
  },
  flx5:{
    flex:0.5
  },
  totalprod:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#666'
  },
  conactprices:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333'
  },
  icnvws:{
    flexDirection:"row",justifyContent:'flex-end',
  },
  mg20:{
    marginTop:20
  },
  mvtowishlist:{
    flex:0.8,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  delvws:{
    flex:0.4,marginRight:10,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
  },


});