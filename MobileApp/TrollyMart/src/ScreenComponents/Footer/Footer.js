import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import {  Icon ,SearchBar  }  from 'react-native-elements';
import ValidationComponent    from "react-native-form-validator";
import styles                 from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FooterStyles.js';
import axios                  from 'axios';
import {colors}               from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage           from '@react-native-async-storage/async-storage';

import { getWishList } 		   from '../../redux/wishDetails/actions';
import { connect,
  useDispatch,
  useSelector }         from 'react-redux';

  export const Footer = (props)=>{
    const {navigation}=props;
  const [cartCountData,setCartCountData] = useState('');
  const [user_id,setUserId] = useState('');
  
  const dispatch 		= useDispatch();

  useEffect(() => {
    getData()
  },[props]);

  handleNavigation = (screen) =>{
    this.props.navigate(screen);
  }
  const getData=async()=>{
    var data = await AsyncStorage.multiGet(['user_id','token']);
    setUserId(data[0][1]);
    if(data[0][1]){
      getCartCount(data[0][1]);
    }
  }

  const getCartCount=(user_id)=>{
    axios.get("/api/Carts/get/count/"+user_id)
    .then((response)=>{ 
      setCartCountData(response.data)
    }) 
    .catch((error)=>{
      console.log('error', error);
    })
  }

    return (
     <View>
          <View  style={styles.footer}>
               <View style={{flexDirection:'row',flex:1}}>
               {/* this.props.navigation('') */}
               
                    <View style={styles.iconOuterWrapper}>
                      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} >  
                      {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate('Dashboard')} > */}
                         <Icon name="home" type="feather" size={25}  color="#666"/>   
                         <Text style={styles.footerTitle}>Home</Text>
                      </TouchableOpacity>
                    </View>
                
                    <View>
                     <View style={styles.Wrapper}>
                          <TouchableOpacity onPress={()=> navigation.navigate('CartComponent',{user_ID:user_id})}>
                               <View style={styles.outerWrapper}>
                                    <Icon name="shopping-cart" type="feather" size={20}  color="#fff"/>
                               </View>
                          </TouchableOpacity>
                     </View>
                    </View>

                    <View style={styles.iconOuterWrapper2}>
                        <TouchableOpacity onPress={()=> {dispatch(getWishList(user_id));navigation.navigate('WishlistComponent',{user_ID:user_id})}}>
                          <Icon name="heart-o" type="font-awesome" size={20}  color="#666"/>
                          <Text style={styles.footerTitle}>Wishlist</Text>
                        </TouchableOpacity>
                    </View>
               </View>
          </View>
     </View>
      
    );
  }