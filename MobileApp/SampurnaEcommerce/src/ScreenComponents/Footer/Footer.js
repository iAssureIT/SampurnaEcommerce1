import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image
} from "react-native";
import {  Icon ,SearchBar  } from 'react-native-elements';
import ValidationComponent from "react-native-form-validator";
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FooterStyles.js';
import axios                      from 'axios';
import {colors} from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { withNavigation }                   from 'react-navigation';
class Footer extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText:'',
      getCartCountData:''
    }
  }

  _goBack = () =>{
    this.props.goBack();
  }
  
  UNSAFE_componentWillMount() {
   
  }

    handleNavigation = (screen) =>{
      this.props.navigate(screen);

  }


  componentDidMount(){
    AsyncStorage.multiGet(['user_id','token'])
    .then((data)=>{
     userId = data[0][1],
      this.setState({
        userId : userId,
      },()=>{
        console.log('userId',this.state.userId)
      })
  })
    this.getCartCount();
      
  }

  getCartCount(){
    axios.get("/api/Carts/get/count/"+this.state.user_ID)
    .then((response)=>{
      console.log("this.state.user_ID ============== ",this.state.user_ID);
      console.log("response.data getCartCountData =========>", response.data);
      this.setState({
        getCartCountData: response.data,    
      })
    }) 
    .catch((error)=>{
      // console.log('error', error);
    })
  }


  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if(nextProps){
      this.setState({
        count:parseInt(nextProps.count)
      })
    }
  }
  updateSearch = searchText => {
    this.setState({ searchText });
  };

  componentWillUnmount() {
  }
  HomeNavigate() {
      this.props.navigation.navigate('Dashboard');
  }
  cart() {
      this.props.navigation.navigate('CartComponent',{user_ID:this.state.userId});
  }
  wishlist() {
      this.props.navigation.navigate('WishlistComponent',{user_ID:this.state.userId});
  }

  _goBack = () => {
    this.props.goBack();
  };

  render() {
    var { navigation } = this.props;
    return (
     <View>
          <View  style={styles.footer}>
               <View style={{flexDirection:'row',flex:1}}>
               {/* this.props.navigation('') */}
               
                    <View style={styles.iconOuterWrapper}>
                      <TouchableOpacity onPress={() => this.HomeNavigate()} >  
                      {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate('Dashboard')} > */}
                         <Icon name="home" type="feather" size={25}  color="#666"/>   
                         <Text style={styles.footerTitle}>Home</Text>
                      </TouchableOpacity>
                    </View>
                
                    <View>
                     <View style={styles.Wrapper}>
                          <TouchableOpacity onPress={()=> this.cart()}>
                               <View style={styles.outerWrapper}>
                                    <Icon name="shopping-cart" type="feather" size={20}  color="#fff"/>
                               </View>
                          </TouchableOpacity>
                     </View>
                    </View>

                    <View style={styles.iconOuterWrapper2}>
                        <TouchableOpacity onPress={()=> this.wishlist()}>
                          <Icon name="heart-o" type="font-awesome" size={20}  color="#666"/>
                          <Text style={styles.footerTitle}>Wishlist</Text>
                        </TouchableOpacity>
                    </View>
               </View>
          </View>
     </View>
      
    );
  }
}
export default  withNavigation(Footer);