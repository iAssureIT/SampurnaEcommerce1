import { StyleSheet, Dimensions,Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {colors} from '../styles.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const window = Dimensions.get('window');

export default StyleSheet.create({
  
  button2:{
    // backgroundColor: colors.button2,
    height: 40,
    backgroundColor:'#fff'
  },
  furitloader:{
    // backgroundColor: colors.button2,
    width : "50%",
    // height: 40,
    // marginTop : 50,
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
    height: hp(7),
    width:"100%",
  },
  
  buttonshopping:{
    backgroundColor: colors.button1,
    height: 45,
  },
   disablebtn:{
    backgroundColor: colors.buttonRED,
    height: 45,
    width:"100%",
  },
  buttonText1:{
    color: colors.buttonText,
    fontFamily:"Montserrat-Regular",
    textTransform: 'uppercase',
    fontSize:RFPercentage(2.3)
  },
  cartdetails:{
    flex:1,
    // paddingHorizontal:15,
    // marginTop:15,marginBottom:"20%",
  },
  minpurchase:{
    color: "#c10000" ,
    fontSize:RFPercentage(1.8),
    color: "#DC1919",
    opacity: 1,
    fontFamily:"Montserrat-Medium",
  },
  minpurchaseadd:{
    color: "#c10000" ,
    fontSize:14,fontFamily:"Montserrat-SemiBold",
  },
  details:{
    fontSize:13,fontFamily:"Montserrat-SemiBold",
    color:'#333'
  },
  flxdir:{
    flexDirection:'row',
    flex:1,
  },
superparent:{
  flex:1,backgroundColor:'#f1f1f1'
  },
  flxpd:{
    flex:0.4,padding:20
  },
  imgwdht:{
    height:hp(10),width:hp(10),
    backgroundColor:"transparent",
    alignSelf:'flex-start',
    marginHorizontal:5,
    marginBottom:10,
    },
  cartlogoimg:{
     width:'70%',height:40,
  },
  cartlogo:{
    height:100,marginTop:10,
  },
  flx5:{
    flex:0.5,
    marginHorizontal:10
  },

  offprice:{
    fontSize:RFPercentage(1.8),
    color:'#5B8E7E',
    marginLeft:5,
    fontFamily:"Montserrat-Regular",
    marginBottom:3,

  },
  flxmg:{
    flex:0.9,
    marginLeft:10,
  },
  flxmgNEW:{
    flex:1,
    marginHorizontal:10,
    marginBottom:10,
  },
  flxmg2:{
    flex:0.1,
    justifyContent:'center',
  },
  prodnamedets:{
    flex:1
  },
  lastText:{
    fontSize:RFPercentage(1.6),
    fontFamily:"Montserrat-Medium",
    color:'#000',
    marginVertical:10
  },
  productname:{
    fontSize:RFPercentage(2.1),
    fontFamily:"Montserrat-Medium",
    flexWrap:'wrap',
    color:'#000',
    opacity: 1
  },
  purchasep:{
    fontSize:8,fontFamily:"Montserrat-SemiBold",marginTop:2,
    textAlign:'center',
  },
  freshnsecuretxt:{
    fontSize:8,fontFamily:"Montserrat-Regular",color:'#ff7900',alignItems:"flex-start",
  },
  productdets:{
    flexDirection:'row',marginTop:7,
    marginBottom: 10,
  },
  productdetsprice:{
    flexDirection:'row',marginTop:40,
    // marginBottom: 10,
  },
  proddelete:{
    flexDirection:'row',marginTop:10,
    marginBottom: 10,alignItems:"flex-end",flex:1,
  },
  mincircle:{
    borderWidth:1,borderColor:"#ccc",
    padding:5,borderTopLeftRadius:5,height:50,
    borderBottomLeftRadius:5
  },
  icnstyle:{
    marginTop:10,marginRight:3,paddingHorizontal:5
  },
  productqty:{
    borderWidth:1,borderColor:"#ccc",padding:5,height:50
  },
  productqtyicn:{
    borderWidth:1,borderColor:"#ccc",padding:5,
    borderTopRightRadius:5,height:50,borderBottomRightRadius:5
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
  cancelbtn:{
    flexDirection:'row',marginTop:20,paddingRight:10
  },
  buttonRED:{
    backgroundColor: colors.buttonRED,
    height: hp(7),
    width:"100%",
  },
  ordervwbtn:{
    flex:0.5,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonGreen:{
    backgroundColor: colors.buttonGreen,
    height: 45,
    width:"100%",
  },
  cancelvwbtn:{
    flex:0.5,marginRight:10,borderRadius:3,shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
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
    fontSize:14,fontFamily:"Montserrat-Regular", color:'#666'
  },
  totaldata:{
    fontSize:RFPercentage(2.5),fontFamily:"Montserrat-Bold", color:'#000',fontWeight:"900",
  },
  totaldata1:{
    fontSize:RFPercentage(2.2),fontFamily:"Montserrat-Bold", color:'#000'
  },
  totaldata2:{
    fontSize:RFPercentage(2.2),fontFamily:"Montserrat-Medium", color:'#000'
  },
  totalsubtxt:{
    fontSize:13,fontFamily:"Montserrat-Regular", color:'#999',
    // textAlign:'center'
  },
  flxdata:{
    flex:1,flexDirection:"row",
    marginBottom:7,
    paddingHorizontal:15,
    paddingVertical:5
  },
  flxdata1:{
    flex:1,flexDirection:"row",
    marginBottom:7,
    paddingLeft:15,
    paddingVertical:10
  },
  flxdatalogo:{
    flex:1,flexDirection:"row",
  },
  billText:{
    fontSize:RFPercentage(2.7),
    fontFamily:"Montserrat-Bold",
    color:'#000',
    marginHorizontal:wp(2.2),
    marginTop:5,
  },
  totaldetails1:{
    backgroundColor:'#FFF',
    borderColor:"#ddd",
    paddingHorizontal:wp(2),
    borderRadius:7,
    // borderTopWidth:1
  },
  totaldetails:{
    backgroundColor:'#F7F7F7',
    borderColor:"#ddd",
    // paddingLeft:15,
    // paddingRight:15,
    paddingTop:15,
    marginHorizontal:6,
    borderRadius:7,
    // borderTopWidth:1
  },
  productsoldurl:{
    fontSize:14,fontFamily:"Montserrat-SemiBold", color:'#3090C7'
  },
  iconstyle:{
    marginTop:3,marginRight:3,marginLeft:15,
  },
  rupeeicn:{
    flexDirection:"row",justifyContent:'flex-end',
  },
  margTp20:{
    marginTop:20
  },
  // margTp10:{
  //   marginTop:10
  // },
  savings:{
    fontSize:14,fontFamily:"Montserrat-SemiBold", color:'#333',
  },
  totalpriceincart:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-SemiBold", 
    color:'#000000',
  },
  totalpriceincartfinal:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Bold", 
    color:'#000000',
  },
  totalpriceincartT:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Bold", 
    color:'#000000',
  },

  totalpriceincartTotal:{
    fontSize:RFPercentage(2.5),
    fontFamily:"Montserrat-Bold", 
    color:'#000000',
  },

  totalpriceincartTotalG:{
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Bold", 
    color:'#3E9D5E',
  },

  totalpriceincart1:{
    marginTop:-2,
    fontSize:RFPercentage(2.2),
    fontFamily:"Montserrat-Bold", 
    color:'#3E9D5E',
  },
  discountpr:{
    fontSize:13,fontFamily:"Montserrat-Regular",color:'#c10000',fontStyle:"italic",marginLeft:10
  },
  proddetprice:{
    // textDecorationLine: 'line-through',
    fontSize:13,
    fontFamily:"Montserrat-Bold",
    color : "#999",
  },
  proprice:{
    // textDecorationLine: 'line-through',
    fontSize:17,
    marginTop:-1,
    fontFamily:"Montserrat-SemiBold",
  },
  proddeletes:{
    flexDirection:'row',
    // justifyContent:'flex-end',
  },
  wishlisthrt:{
    marginTop:0,
    padding:5,
    paddingHorizontal:15,
    borderRightWidth:1,
    borderColor:'#ccc'
  },

  proddetails:{
    borderWidth:1,borderColor:'#E7E7E7',
    backgroundColor:"#fff",
    minHeight:80,
    borderRadius:4,
    paddingVertical:hp(1),
    marginBottom:hp(2),
    marginHorizontal:wp(2),
  },
  buttonContainer1:{
    marginTop:20,
    marginBottom:10,
    ...Platform.select({
      ios:{
        justifyContent:'center',
      

      },
      android : {
        alignItems:'center',
      }
    })
  },
  continueshopping:{
    marginTop:20,
    marginBottom:10,
  },
  containerStyle:{
    borderWidth:1,
    borderRadius:3,
    // marginVertical:5,
    borderColor:"#ccc",
    paddingHorizontal: 0,
    height:43,
  },
  leftIconContainerStyle:{
    borderRightWidth:1,
    borderColor:"#ccc",
    paddingLeft:15,
    paddingRight:15,
    margin:0
  },
  originalprice: {
		textDecorationLine: 'line-through', fontSize: 12, fontFamily: "Montserrat-Regular",
	},
	ogprice: {
		fontSize: 12, fontFamily: "Montserrat-SemiBold", marginLeft: 2, color: '#333', alignItems: 'center',
  },
  currency:{
    fontSize: RFPercentage(3), fontFamily: "Montserrat-Regular", color: '#000'
  },
  currency1:{
    fontSize: RFPercentage(2.2), fontFamily:"Montserrat-Medium", color: '#000000',
  },
  currencyNEW:{
    fontSize: RFPercentage(2.5), fontFamily:"Montserrat-Bold", color: '#000000',
  },
	discountpricecut: {
		fontSize: RFPercentage(1.8), 
    fontFamily: "Montserrat-Medium",
    textDecorationLine: 'line-through',
    textDecorationColor: '#EF4D4D',
    alignContent: 'flex-end',
    color: '#000000',
    opacity:0.5,
    marginBottom:2
	},
})
