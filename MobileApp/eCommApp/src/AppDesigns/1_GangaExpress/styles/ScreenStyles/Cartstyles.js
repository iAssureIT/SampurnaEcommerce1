import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  
  button2:{
    // backgroundColor: colors.button2,
    height: 40,
    backgroundColor:'#fff'
// 
    // width:"80%",
  },
  buttonText2:{
    color: colors.buttonText2,
    fontFamily:"Montserrat-SemiBold",
    // textTransform: 'uppercase',
    fontSize:11

  },
  buttonContainer2:{
    ...Platform.select({
      ios:{
        justifyContent:'center',
    
      },
      android : {
        alignItems:'center',
        
      }
    })
  },
   button1:{
    backgroundColor: colors.button1,
    height: 45,
    width:"100%",
  },
  buttonText1:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13
  },
  cartdetails:{
    flex:1,
    paddingHorizontal:15,
    marginTop:15,marginBottom:"20%"
  },
  details:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",
    color:'#333'
  },
  flxdir:{
    flexDirection:'row'
  },
  flxpd:{
    flex:0.4,padding:20
  },
  imgwdht:{
    width: "100%", height:"100%",
  },
  flxmg:{
    flex:0.8,marginTop:18
  },
  productname:{
    fontSize:12,fontFamily:"Montserrat-SemiBold",flexWrap:'wrap'
  },
  productdets:{
    flexDirection:'row',marginTop:10
  },
  mincircle:{
    borderWidth:1,borderColor:"#ccc",padding:5,borderTopLeftRadius:5,height:50,borderBottomLeftRadius:5
  },
  icnstyle:{
    marginTop:10,marginRight:3,paddingHorizontal:5
  },
  productqty:{
    borderWidth:1,borderColor:"#ccc",padding:13,height:50
  },
  productqtyicn:{
    borderWidth:1,borderColor:"#ccc",padding:5,borderTopRightRadius:5,height:50,borderBottomRightRadius:5
  },
  productdel:{
    flexDirection:'row',marginTop:15,paddingRight:10
  },
  productdelopacity:{
    flex:0.4,marginRight:10,
    borderWidth:1,borderColor:"#ccc",
    borderRadius:3,shadowColor: '#f1f1f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  mvtolist:{
    flex:0.8,borderRadius:3,
    borderWidth:1,borderColor:"#ccc",
    shadowColor: '#f1f1f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  productsoldby:{
    fontSize:12,fontFamily:"Montserrat-Regular", color:'#666'
  },
  totaldata:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#666'
  },
  flxdata:{
    flex:1,flexDirection:"row"
  },
  totaldetails:{
    backgroundColor:'#fff',borderWidth:1,
    borderColor:"#f1f1f1",height:180,marginTop:15,
    paddingHorizontal:15,paddingVertical:15
  },
  productsoldurl:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#3090C7'
  },
  iconstyle:{
    marginTop:5,marginRight:3
  },
  rupeeicn:{
    flexDirection:"row",justifyContent:'flex-end',
  },
  margTp20:{
    marginTop:20
  },
  savings:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333',
  },
  ogprice:{
    fontSize:13,fontFamily:"Montserrat-Regular",
  },
  discountpr:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#c10000',fontStyle:"italic",marginLeft:10
  },
  proddetprice:{
    textDecorationLine: 'line-through',fontSize:12,fontFamily:"Montserrat-Regular",
  },

  proddetails:{
    borderWidth:1,borderColor:'#f1f1f1',
    backgroundColor:"#fff",height:250,
    borderRadius:5,marginTop:10,
  },
  buttonContainer1:{

    marginTop:15,
    marginBottom:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
      

      },
      android : {
        alignItems:'center',
      }
    })
  },

  
})
