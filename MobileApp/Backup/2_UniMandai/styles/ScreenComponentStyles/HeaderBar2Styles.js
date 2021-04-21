import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../CommonStyles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
  
  bellIcon: {
    paddingRight:20,
    marginRight:10,
  },
  whitelogo: {
    height: 30, width: 45, marginTop: 15, marginLeft: 10 
  },
  whitename: {
    height: 65, width: 140, marginTop: 10, 
    marginLeft: 80 
  },
  searchvw: {
    paddingTop:15,
    paddingHorizontal: 15, 
    marginBottom: 30, 
  },
  rightcnt: {
    paddingTop: 0, paddingLeft: 0, paddingRight: 0, 
    // backgroundColor: '#80c21c' 
    backgroundColor: '#fff' ,
    borderTopWidth: 3,
    borderTopColor: "#80c21c",
    height:60,
  },
  notificationText: {

       ...Platform.select({
      ios:{
            position: 'absolute',
            right: 4,
            top: -15,
            borderRadius: 29,
            width: 15,
            height: 15,
            textAlign: 'center',
            color: '#fff',
            fontSize: 12,
            backgroundColor: '#dc3545',
            fontFamily:"Montserrat-Regular",


      },
      android : {
            position: 'absolute',
            right: -4,
            top: -10,
            borderRadius: 9,
            width: 18,
            height: 18,
            textAlign: 'center',
            color: '#fff',
            fontSize: 12,
            backgroundColor: '#dc3545',
            fontFamily:"Montserrat-Regular",

      }
    })
  },

  outerContent: {
    // borderBottomWidth:0, 
    // backgroundColor: '#f7ac57',
    margin:0
  },
  notificationbell: {
    flexDirection:'row',justifyContent:'center',
    alignItems:'center',marginTop:6,
    alignSelf:'center',marginRight:20
  },
  flxdir: {
    flexDirection:'row'
  },
  iconOuterWrapper:{
    flex:0.5,backgroundColor:'#fff',color:'#fff',
  },
  iconOuterWrapper2:{
    flex:0.5,backgroundColor:'#fff',color:'#fff',
  },
  footerTitle:{
    textAlign:'center',fontFamily:"Montserrat-SemiBold",fontSize:12,color:'#fff',
  },
  title:{
    color: '#fff',
    fontFamily:"Montserrat-SemiBold",
    fontSize: 18,
    alignSelf:'center',
    backgroundColor:'transparent',
    textAlign:'center'
  },

  headertitlebar:{
      ...Platform.select({
      ios:{
          alignItems:'center',
          justifyContent:'center',
      },
      android : {
        alignItems:'center',
        borderRadius:0
      }
    }),
  },

  container:{
    backgroundColor:'#fff',
    padding:0,
    margin:0,
    paddingTop:0,
    ...Platform.select({
      ios:{
        height: 85 ,
        paddingTop:25,

      },
      android : {

      }
    }) 
  },
  header2main:{
    
    backgroundColor: "#80c21c",
    //  elevation: 4, 
    // boxShadow: "10px 5px 5px black"
  },
  leftside:{
    backgroundColor: 'transparent', paddingHorizontal: 15 
  },
  center:{
    backgroundColor: 'transparent', paddingLeft: 0, paddingRight: 0, 
  },
  rightside:{
    backgroundColor: 'transparent', paddingHorizontal: 15 
  },

  searchContainer:{
    width:'100%',
    padding:0,
    height:30,
    borderTopWidth:0,
    borderBottomWidth:0,
    backgroundColor:'#80c21c',
  },
  searchInputContainer:{
    backgroundColor:'#fff',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderRadius:5,
    // borderColor:"#ccc",
     elevation:4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,


  },
  searchInput:{
    fontSize:13,
    // color:'#ccc',
    fontFamily:"Montserrat-Regular",

  },
});
