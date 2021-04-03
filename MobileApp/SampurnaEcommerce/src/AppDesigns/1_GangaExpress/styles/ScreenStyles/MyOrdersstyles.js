import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  menuWrapper:{
    marginTop:20,
    flexDirection:'row',
    flex:1
  },
  container:{
    minHeight:window.height-25,
  },
  imageMenuWraper:{ 
  borderWidth:1,borderColor:'#f1f1f1',borderRadius:5,width: 150, height:85, backgroundColor: '#ccc',marginRight:15
  },
  formWrapper:{
  	paddingHorizontal:15,
    flex:1
  },
  categoryTitle:{
   color:'#333',textAlign:'center',marginTop:5,marginBottom:10,fontSize:13,fontFamily:"Montserrat-Regular",flexWrap: 'wrap' 
  },
  catImage:{
    flex:0.5,marginRight:10,backgroundColor:'#ccc',borderWidth:0,borderColor:'#f1f1f1', height:200
  },
  catTitle:{
    fontSize:14,fontFamily:"Montserrat-SemiBold",textAlign:'center',marginTop:10
  },
  proddets:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#666',paddingVertical:5
  },
  prodinfo:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333',paddingVertical:5
  },
  flx3:{
    flex:0.3
  },
  flxdir:{
    flexDirection : "row"
  },
  placeon:{
    fontSize:13,fontFamily:"Montserrat-Regular", color:'#666',paddingVertical:5,
  },
  pricedetsvw:{
    borderWidth:1,borderColor:'#ccc',width:'50%',alignSelf:"center",marginVertical:15
  },
  pricedets:{
    fontSize:13,fontFamily:"Montserrat-Regular", color:'#666',marginBottom:20
  },
  superparent:{
    flex:1,backgroundColor:'#f1f1f1'
  },
  placeonvw:{
    flex:1,marginBottom:"30%"
  },
  prodinfoparent:{
    flex:1,backgroundColor:'#fff',marginTop:15,paddingHorizontal:15,paddingVertical:15,borderWidth:1,borderColor:'#f1f1f1',paddingBottom:'10%'
  },
  orderid:{
    flex:0.1,backgroundColor:'#F1F1F1',borderWidth:1,borderColor:'#F1F1F1',paddingHorizontal:10,paddingVertical:5
  },
  orderidinfo:{
    fontSize:13,fontFamily:"Montserrat-SemiBold", color:'#333',paddingTop:3
  },
  orderdets:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333',marginTop:15
  },
  prodorderdets:{
    flexDirection:'row',flex:0.5,marginTop:15
  },
  flx5:{
    flex:0.5
  },
  mrp:{
    fontSize:13,fontFamily:"Montserrat-Regular", color:'#666',alignSelf:'flex-start'
  },
  ordernum:{
    fontSize:13,fontFamily:"Montserrat-Regular", color:'#333',paddingVertical:5,
  },
  prodrps:{
    flexDirection:'row',marginRight:10,marginTop:5
  },
  pricecount:{
    flexDirection:'row',marginRight:10
  },
  updatenum:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#666'
  },
  emailicn:{
    marginTop:3,marginRight:5
  },
  outervw:{
    borderWidth:1,borderColor:'#ccc',width:'100%',alignSelf:"center",marginVertical:15
  },
  commonadd:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#666',
  },
  fashion:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  total:{
    fontSize:13,fontFamily:"Montserrat-SemiBold", color:'#333',alignSelf:'flex-start'
  },
 
  priceon:{
    fontSize:12,fontFamily:"Montserrat-Regular",color:'#333',
  },
  iconrps:{
    marginTop:5,marginRight:5,
  },
  itemordervw:{
    flex:1,borderWidth:1,borderColor:'#f1f1f1',backgroundColor:'#ccc',paddingVertical:15
  },
  itemorder:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333',paddingHorizontal:5
  },
  itemoutervw:{
    flex:1,flexDirection:'row',backgroundColor:'#fff',borderWidth:1,borderColor:'#f1f1f1',marginTop:15
  },
  imgvw:{
    flex:0.4,backgroundColor:'#f1f1f1',borderWidth:1,borderColor:'#f1f1f1',height:150,
  },
  namefordelivery:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333',marginVertical:5,
  },
  price:{
    textDecorationLine: 'line-through',fontSize:12,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  pricendate:{
    fontSize:12,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  cacelled:{
    fontSize:12,fontFamily:"Montserrat-SemiBold",color:'#c10000',marginRight:10
  },
  imgvw:{
    flex:0.4,backgroundColor:'#f1f1f1',borderWidth:1,borderColor:'#f1f1f1',height:150
  },
  img15:{
    width: "100%",height:150
  },
  productqtyty:{
    flex:0.8,backgroundColor:'#f1f1f1',borderWidth:1,borderColor:'#f1f1f1',paddingHorizontal:15
  },
  cancelbtn:{
    flexDirection:'row',marginTop:20,paddingRight:10
  },
  orderstatustxt:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#666',marginBottom:15
  },
  ordervwbtn:{
    flex:0.5,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  cancelvwbtn:{
    flex:0.5,marginRight:10,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  orderstatus:{
    backgroundColor:'#fff',marginTop:15,paddingHorizontal:15,paddingVertical:15,borderWidth:1,borderColor:'#f1f1f1',    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  parent:{
    flex:1,marginBottom:'30%'
  },
  buttonRED:{
   
    backgroundColor: colors.buttonRED,
    height: 45,
    width:"100%",

  },
  buttonText:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    fontSize:13,


  },
  buttonContainer:{
     width:"100%",
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
  buttonORANGE:{
    backgroundColor: colors.buttonORANGE,
    height: 45,
    width:"100%",
    // borderColor:'#fbbd65',
    // borderWidth:1
  },
  buttonText1:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13,
    // borderColor:'#c10000',

  },
  buttonContainer1:{
 width:"100%",
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
