import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
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
  superparent:{
    flex:1,backgroundColor:'#f1f1f1'
  },
  placeonvw:{
    flex:1,marginBottom:"30%"
  },
  parent:{
    backgroundColor:'#fff',marginTop:15,paddingHorizontal:15,borderWidth:1,borderColor:'#f1f1f1',paddingBottom:'10%'
  },
  flx5:{
    flex:0.5
  },
  flx2:{
    flex:0.2
  },
  icnedits:{
    alignSelf:'flex-end',backgroundColor:"#f1f1f1",borderRadius:5,padding:10,overflow:'hidden'
  },
  vwtxt:{
    flex:1,marginTop:15
  },
  prodtxt:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333',flexWrap:'wrap'
  },
  nameproduct:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333',marginBottom:10,
  },
  proddate:{
    fontSize:12,fontFamily:"Montserrat-SemiBold", color:'#333',marginBottom:0
  },
  ratingvw:{
    alignSelf:'flex-start',marginTop:-45,
  },
  img15:{
    width: "100%",height:150
  },
  imgvw:{
    flexDirection:'row',marginTop:15
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
