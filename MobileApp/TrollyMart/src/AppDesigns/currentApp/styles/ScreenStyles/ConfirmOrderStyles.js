import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const window = Dimensions.get('window');

export default StyleSheet.create({

  formWrapper:{
    marginTop:hp(2),
  },
  superparent:{
    flex:1,backgroundColor:'#f1f1f1'
  },
  
  parent:{
    backgroundColor:'#fff',paddingHorizontal:10,paddingVertical:hp(2),
  },
  ordervw:{
    flexDirection:'row',flex:0.5,marginTop:hp(2)
  },
  
  titletxt:{
    fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold", color:'#666',paddingVertical:5
  },
  ordertxt:{
    fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold", color:'#333',paddingVertical:5
  },
  icnvw:{
    flexDirection:'row',marginRight:10
  },
  icn:{
    marginTop:5,marginRight:5,
  },
  rsprice:{
    fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold",color:'#c10000'
  },
  imgvw:{
    flex:0.4,backgroundColor:'#f1f1f1',
    borderWidth:1,borderColor:'#f1f1f1',height:80,
  },
  imgstyle:{
    width: "100%",height:80
  },
  deleveryvw:{
    backgroundColor:'#f1f1f1',borderWidth:1,borderColor:'#f1f1f1',height:45,marginTop:'5%'
  },
  deleverydate:{
    textAlign:'center',marginTop:10,fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold", color:'#333'
  },
  confirmorder:{
    fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold", color:'#333'
  },
  flx3:{flex:0.3},

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
    fontSize:RFPercentage(1.7)

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
    fontSize:RFPercentage(1.9)

  },
  buttonContainer1:{

    marginTop:hp(2),
    marginBottom:hp(2),
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
