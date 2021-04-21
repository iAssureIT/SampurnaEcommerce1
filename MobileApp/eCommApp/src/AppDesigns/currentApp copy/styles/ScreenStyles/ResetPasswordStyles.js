import { StyleSheet, Dimensions, Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

    container:{
        backgroundColor: '#fff',
        minHeight:'100%',
        justifyContent:"center"
    },
    formInputView: {
        width: '100%',
        paddingHorizontal: 15
    },
    loginTitleTxt: {
        fontSize: 22,
        color: '#333',
        fontFamily: "Montserrat-Bold",
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#aaa',
        height: 40,
        paddingLeft: 10,
        textAlignVertical: 'center',
        paddingTop: 0,
        paddingBottom: 0,
    },
    labelText: {
        top: 6,
        paddingLeft: 2,
    },
    resetimgvw: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center' 
    },
    resetopacity: {
      width: '100%', backgroundColor:'#fff',marginTop:80,borderColor:"#ccc",shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 8,
    },
    resetimg: {
      width: '50%',height:80 
    },
    resetsubtitle: {
      fontSize:17,fontFamily:'Montserrat-Regular',alignSelf:"center"
    },
    resettitle: {
      fontSize: 25, color:"#ed3c55", fontFamily: 'Montserrat-SemiBold',textAlign:'center' 
    },
    resetpwd: {
      borderWidth:1,borderColor:"#ccc",fontFamily: 'Montserrat-Regular'
    },
    
    marginTB: {
        marginVertical: 20,
        // marginBottom: 20,
    },

    linkWrap: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    marginBottom30: {
        marginBottom: 30,
    },
    marginBottom20: {
        marginBottom: 20,
    },
    linkText: {
        fontSize: 15,
        fontFamily: "Montserrat-Regular",
    },
    errorWrapper: {
        width: '100%',
        marginBottom: -15
    },
    errorText: {
        color: '#dc3545',
        fontSize: 13,
        fontFamily: 'Montserrat-Regular'
    },

    textTitleWrapper:{
        paddingHorizontal: 15, marginTop: 15, marginBottom:15
    },
    button:{
    width:'100%',
    backgroundColor: colors.button,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:5

  },
  buttonText:{
    color: colors.buttonText,
     fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
  },
  buttonContainer:{
    ...Platform.select({
      ios:{
        justifyContent:'center',
      },
      android : {
        
      }
    })
  },
   button1:{
    width:'100%',
    backgroundColor: colors.buttonn,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:50
  },
  buttonText1:{
    color: colors.buttonTextt,
     fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
    alignItems:'flex-start'
  },
  buttonContainer1:{
    marginBottom:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
        

      },
      android : {
        justifyContent:'center'
      }
    })
  },
   
});