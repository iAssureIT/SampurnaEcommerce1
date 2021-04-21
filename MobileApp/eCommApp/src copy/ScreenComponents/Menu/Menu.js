import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  PermissionsAndroid,
  Platform
} from "react-native";
import { Icon, Avatar }         from 'react-native-elements';
import axios                    from "axios";
import AsyncStorage             from '@react-native-community/async-storage';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuStyles.js';

export default  class Menu extends React.Component {
  constructor(props){
    super(props);
    this.state={
      fullName         :'',
      addressComponent :[],
      firstname        :"",
      lastname         :"",
    };
  }
  
componentDidMount(){
 AsyncStorage.getItem('user_id')
    .then((userId)=>{
      axios
      .get('/api/users/get/'+userId)
      .then((user)=>{
        this.setState({
          firstName      : user.data.firstname,
          lastName       : user.data.lastname,
          // imgPath        : user.data.image,
          user_id        : userId,  
        })
      })
      .catch((error)=>{
        console.log("error=>",error)
      })
    })
}

logout=()=>{
  AsyncStorage.removeItem('user_id');
  AsyncStorage.removeItem('token');
  this.props.navigate('Login');
};
  render(){
    return (
      <ScrollView contentContainerStyle={[styles.container]} scrollsToTop={false}>
      <ImageBackground source={require("../../AppDesigns/currentApp/images/Side_drawer.png")} style={styles.container} resizeMode="cover" >
        
          	<View style={{flexDirection:"row",height:100,margin:40,paddingTop:30,borderBottomWidth:1}}>
            <Avatar
            style={{borderWidth:1, borderColor:"#999"}}
                overlayContainerStyle={{}}
                width={90}
                height={90}
                rounded
                source={require('../../AppDesigns/currentApp/images/user.jpg')}                 
              />
		     		<View style={{paddingTop:40,paddingLeft:4}}>
		     			<Text style={{fontSize:18,color: "#333"}}>Hi, {this.state.firstName}</Text>
		     		</View>	
		        </View>
          <View style={styles.menuWrapper}>
            <TouchableOpacity onPress={()=> this.props.navigate('AccountDashboard')}>
              <View style={styles.menu}>
                <Icon 
                  size={22} 
                  name='user-circle-o' 
                  type='font-awesome' 
                  color='#666' 
                  containerStyle={styles.iconContainer}
                />
                <Text style={styles.menuText}>
                  My Account
                </Text>
              </View>
            </TouchableOpacity>
             <TouchableOpacity onPress={()=> this.props.navigate('AddressMenu')} >
              <View style={styles.menu}>
                <Icon 
                  size={22} 
                  name='address-book-o' 
                  type='font-awesome' 
                  color='#666' 
                  containerStyle={styles.iconContainer}
                />
                <Text style={styles.menuText}>
                  My Addresses 
                </Text>
              </View>
            </TouchableOpacity>
             <TouchableOpacity onPress={()=> this.props.navigate('MyOrder')}>
              <View style={styles.menu}>
                <Icon 
                  size={20} 
                  name='briefcase' 
                  type='entypo' 
                  color='#666' 
                  containerStyle={styles.iconContainer}
                />
                <Text style={styles.menuText}>
                  My Orders
                </Text>
              </View>
            </TouchableOpacity>

             <TouchableOpacity onPress={()=> this.props.navigate('WishlistComponent')}>
              <View style={styles.menu} >
                <Icon 
                  size={20} 
                  name='bookmark-o' 
                  type='font-awesome' 
                  color='#666' 
                  containerStyle={styles.iconContainer}
                />
                <Text style={styles.menuText}>
                  My Wishlist
                </Text>
              </View>
            </TouchableOpacity>

             <TouchableOpacity onPress={()=> this.props.navigate('SupportSystem')}>
              <View style={styles.menu} >
                <Icon 
                  size={20} 
                  name='bookmark-o' 
                  type='font-awesome' 
                  color='#666' 
                  containerStyle={styles.iconContainer}
                />
                <Text style={styles.menuText}>
                  Help & Support
                </Text>
              </View>
            </TouchableOpacity> 
            
            <TouchableOpacity onPress={()=>this.logout()}>
              <View style={styles.menu}>
                <Icon 
                  size={23} 
                  name='power' 
                  type='material-community' 
                  color='#666' 
                  containerStyle={styles.iconContainer}
                />
                <Text style={styles.menuText}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>

          </View>
          </ImageBackground>
      </ScrollView>
    );
  }
}
