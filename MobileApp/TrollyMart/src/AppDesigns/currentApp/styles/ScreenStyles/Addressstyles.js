import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  
  menuWrapper:{
    marginTop:20,
    flexDirection:'row',
    flex:1
  },
  imageMenuWraper:{ 
    borderWidth:1,borderColor:'#f1f1f1',borderRadius:5,width: 150, height:85, backgroundColor: '#ccc',marginRight:15
  },
  formWrapper:{
  	paddingHorizontal:15,
    marginTop:15
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
  button:{
    marginRight:10,
    backgroundColor: colors.button,
    height: 35,

  },
  buttonText:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    fontSize:13,

  },
  buttonContainer:{
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
  button1:{
    backgroundColor: colors.button1,
    height: 45,
    width:"100%",
  },
  buttongrey:{
    backgroundColor: "#999",
    height: 45,
    width:"100%",
  },
  buttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
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
  buttondis:{
    backgroundColor: "#ccc",
    height: 45,
    width:"100%",
  },
  buttonText1:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13

  },
  buttonContainer1:{
    width:'100%',
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
   textContainer:{
    height:'auto',
    paddingLeft:10
  },
  textInputContainer:{
    backgroundColor:'transparent',
    paddingLeft:5,
    fontFamily:"Montserrat-Regular",
    borderBottomColor: "transparent",
  },
    inputTextWrapper : {
    width:'88%'
  },
  textTitle:{
    fontFamily:"Montserrat-Regular",
    top:0, 
    fontSize:12
  },
  textStyle:{
    fontFamily:"Montserrat-Regular",
    backgroundColor:'transparent',
    paddingTop:0,
    marginTop:-6,
    fontSize:14,
  },
  textLabel:{
    backgroundColor:'#fff',
    fontFamily:"Montserrat-Regular",
    top:-7,
  },
  errorWrapper:{
    width:'100%',
    marginBottom:-15
  },
  errorText:{
    color:'#dc3545',
    fontSize:12,
    marginTop:3,
    paddingLeft:25,
    fontFamily:'Montserrat-Regular'
  },
  eyeWrapper:{
    width:'15%',
    justifyContent:'center',
    alignItems:'center',
  },
  inputWrapper : {
    width:'100%',
    borderColor:'#666',
    borderWidth:1,
    flexDirection:'row',
    borderRadius: 5,
  },
    formInputView: {
    width:'100%',
    paddingHorizontal:10,
  },

  marginBottom20:{
    marginBottom: 20
  },
    inputImgWrapper : {
    width:'5%',
    // justifyContent:'center',
    // alignItems:'center',
    marginVertical:15
  },
   inputText2Wrapper:{
    width:'74%',
    justifyContent:'center'
  },
  buttonORANGE:{
    backgroundColor: colors.buttonORANGE,
    height: 45,
    width:"100%",
  },
  buttonTextEDIT:{
    color: colors.buttonText,
    fontFamily:"Montserrat-SemiBold",
    textTransform: 'uppercase',
    fontSize:13

  },
  yesmodalbtn:{
    marginTop:15,
  },
  buttonContainerEDIT:{
    width:'100%',
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
  buttonS:{
    backgroundColor: 'rgb(251, 189, 101)',
    height: 45,
    width:"100%",
  },
  buttonTextS:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:13

  },
  buttonContainerS:{
    width:'100%',
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

  ddContainer:{
    backgroundColor:'#fff',
    height: "auto",
    paddingLeft:4,
    backgroundColor:"#fff"
    // fontFamily:"Montserrat-Regular"
  },
  ddItemText:{
    fontFamily:"Montserrat-Regular"
  },
  ddInputContainer:{
    borderBottomColor: '#fff',
    backgroundColor:"#fff"
    // paddingLeft:5
  },
  ddLabelText:{
    backgroundColor:'#fff',
    top:0,
    // left:5,
    fontFamily:"Montserrat-Regular",
    fontSize:15,
    paddingHorizontal:2
  },
  ddStyle:{
    fontFamily:"Montserrat-Regular"
  },
  addsuperparent:{
    flex:1,backgroundColor:'#f1f1f1',
  },
  flxdir1:{
    flex:1,flexDirection: "row"
  },
  addparent:{
    backgroundColor:'#fff',paddingVertical:20,paddingHorizontal:15,
  },
  addtype:{
    backgroundColor:'#fff',paddingVertical:20,paddingHorizontal:15,
  },
  addcanclebtn:{
    backgroundColor:'#fff',paddingVertical:20,paddingHorizontal:15,
  },
  addresstype:{
    fontSize:15,fontFamily:"Montserrat-Regular",color:'#666',marginBottom:15
  },
  addcanclebtn:{
    flexDirection:'row',marginBottom:85
  },
  canclebtn:{
    flex:0.5,paddingHorizontal:15,marginTop:10
  },
  editparent:{
    flex:0.5,paddingHorizontal:15,
  },
  confirmbtn:{
    flex:0.5,paddingHorizontal:10,
  },
  mobileno:{
    flex:0.2,fontSize:13,fontFamily:"Montserrat-Regular",color:'#666'
  },
  mobilenum:{
    flex:0.4,fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333'
  },
  removeparent:{
    flex:0.5,paddingHorizontal:15,
  },
  padhr15:{
    paddingHorizontal:15
  },
  padhr18:{
    paddingHorizontal:22
  },
  orderpadhr18:{
    paddingHorizontal:10
  },
  addcmpbtn:{
    flex:1,marginBottom:5,
  },
  continuebtn:{
    flex:1,marginBottom:50,
  },
  addcmpchkbxslect:{
    backgroundColor:'#fff',
    marginTop:0,marginBottom:15,
    borderRadius:15,
    borderWidth:1,
    borderColor:colors.theme
  },
  addcmpchkbx:{
    backgroundColor:'#fff',
    marginTop:10,marginBottom:15,
    borderRadius:15,
    minHeight:50,
    
  },
  addcmporder:{
    backgroundColor:'#fff',marginTop:10,marginBottom:15,
  },
  flx8:{
    flex:0.8,
  },
  proddeletes:{
    // alignItems: "flex-end",
    marginTop:14,
    // marginBottom:14,
    paddingRight: 20,
    // backgroundColor: "red"
  },
  chkvw:{
    flex:0.1,
  },
  nameofcontact:{
    flex:0.9,
  },
  addchkbx:{
    flex:1,flexDirection:'row',paddingHorizontal:2,paddingVertical:2,alignItems:"center",
    justifyContent:"center"
  },
  orderaddchkbx:{
    flexDirection:'row',paddingHorizontal:2,paddingVertical:2,
  },
  chkbox:{
    fontSize:15,fontFamily:"Montserrat-Regular",color:'#666'
  },
  flxrow:{
    flexDirection:'row'
  },
  addname:{
    fontSize:15,fontFamily:"Montserrat-SemiBold",
    marginTop:15,
    flex:0.7,
    marginLeft:15,
  },
  address:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#666'
  },
  mobflx:{
    flexDirection:'row',marginTop:8,marginBottom:18
  },
  addoffice:{
    flex:0.3,alignItems:'flex-end',
    marginTop:10,
    paddingTop:8,
    textAlign:'center',backgroundColor:'#f1f1f1',
    height:35,color:'#333',borderWidth:1,
    borderColor:'#f1f1f1',borderRadius:3,
    fontSize:12,fontFamily:"Montserrat-SemiBold",
  },
  marTp15:{
    marginTop:15
  },

})
