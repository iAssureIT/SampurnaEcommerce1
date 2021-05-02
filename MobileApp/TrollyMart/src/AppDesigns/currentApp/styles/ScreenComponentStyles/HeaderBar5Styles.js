import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
  
  bellIcon: {
    paddingRight:20,
    marginRight:10,
  },
  notificationText: {

       ...Platform.select({
      ios:{
            position: 'absolute',
            right: 0,
            top: -8,
            borderRadius: 29,
            width: 15,
            height: 15,
            textAlign: 'center',
            color: '#fff',
            fontSize: 10,
            backgroundColor: colors.theme,
            fontFamily:"Montserrat-Regular",


      },
      android : {
            position: 'absolute',
            right: 0,
            left:13,
            top: -10,
            borderRadius: 9,
            width: 18,
            height: 18,
            textAlign: 'center',
            color: '#fff',
            fontSize: 10,
            backgroundColor: colors.theme,
            fontFamily:"Montserrat-Regular",

      }
    })
  },

  outerContent: {
    borderBottomWidth:0, 
    backgroundColor: '#f7ac57',
    margin:0
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

  searchContainer:{
    width:'100%',
    padding:0,
    height:30,
    borderTopWidth:0,
    borderBottomWidth:0,
    backgroundColor:'transparent'
  },
  searchInputContainer:{
    backgroundColor:'#fff',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderRadius:5
  },
  searchInput:{
    fontSize:13,
    color:'#333',
    fontFamily:"Montserrat-Regular"
  },
});
