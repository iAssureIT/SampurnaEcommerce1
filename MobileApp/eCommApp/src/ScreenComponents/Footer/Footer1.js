import React from "react";
import {
  Text, View, TouchableOpacity, AsyncStorage,
} from "react-native";
import { Icon, SearchBar } from 'react-native-elements';
import ValidationComponent from "react-native-form-validator";
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FooterStyles1.js';
import axios from 'axios';
import { withNavigation } from 'react-navigation';
class UniFooter extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      getCartCountData: ''
    }
  }

  _goBack = () => {
    this.props.goBack();
  }

  handleNavigation = (screen) => {
    this.props.navigate(screen);
  }


  componentDidMount() {
    AsyncStorage.multiGet(['user_id', 'token'])
      .then((data) => {
        userId = data[0][1],
          this.setState({
            userId: userId,
          }, () => {
            this.countfun();
          })
      })
  }
  countfun(){
    // console.log('footer userId==>', this.state.userId)
            axios.get("/api/Carts/get/count/" + this.state.userId)
              .then((response) => {
                // console.log('footer response.data==>', response.data)
                this.setState({
                  getCartCountData: response.data,
                })
              })
              .catch((error) => { })
  }
  componentWillReceiveProps(nextProps) {
    this.countfun();
    if (nextProps) {
      this.setState({
        count: parseInt(nextProps.count)
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
    this.props.navigation.navigate('CartComponent', { user_ID: this.state.userId });
  }
  order() {
    this.props.navigation.navigate('MyOrder');
  }
  wishlist() {
    this.props.navigation.navigate('WishlistComponent');
  }

  render() {
    var { navigation } = this.props;
    return (
      <View>
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => this.HomeNavigate()} >
                <Icon name="home" type="feather" size={15} color="#666" />
                <Text style={styles.footerTitle}>Home</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => this.cart()} >
                <Icon name="shopping-cart" type="feather" size={15} color="#666" />
                <Text style={styles.footerTitle}>My Cart</Text>
                {
                  this.state.getCartCountData > 0 ?
                    <Text style={styles.notificationText}>{this.state.getCartCountData}</Text>
                  :
                  null
                }
                
              </TouchableOpacity>
            </View>

            <View style={styles.iconOuterWrapper2}>
              <TouchableOpacity onPress={() => this.wishlist()}>
                <Icon name="heart-o" type="font-awesome" size={18} color="#666" />
                <Text style={styles.footerTitle}>Wishlist</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.iconOuterWrapper2}>
              <TouchableOpacity onPress={() => this.order()} >
                <Icon name="shopping-bag" type="feather" size={15} color="#666" />
                <Text style={styles.footerTitle}>My Orders</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>

    );
  }
}
export default withNavigation(UniFooter);