import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage
} from "react-native";
import {Linking} from 'react-native'
import { Header, Icon, SearchBar,Button } from 'react-native-elements';
import ValidationComponent from "react-native-form-validator";
import axios              from 'axios'; 
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HeaderBar2Styles.js';
import { connect }        from 'react-redux';
class HeaderBars2 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      inAppNotificationsCount : 0
    }
  }

  _goBack = () => {
    this.props.goBack();
  }

  handleNavigation = (screen) => {
    this.props.navigate(screen);
  }
  componentWillUnmount () {
    this.focusListener.remove()
  }
  
  componentDidMount(){
    this.getNotificationList();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getNotificationList();
    this.setState({searchText : ""}
      ,()=>{
          this.props.setGloblesearch(this.state.searchText);
        })
    })
  }

  getNotificationList(){
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        console.log("data",data);
          var token = data[0][1]
          var user_id = data[1][1]
            axios.get('/api/notifications/get/list/Unread/' + user_id)
            .then(notifications => {
              console.log("notifications",notifications);
                this.setState({ 
                  inAppNotificationsCount: notifications.data.length,
                })
            })
            .catch(error => {
                console.log('error', error)
            })
      });
  }

  updateSearch = searchText => {
    this.setState({searchText : searchText}
      ,()=>{
        // console.log(" serarch==>",this.state.searchText);
        this.props.setGloblesearch(this.state.searchText);
      })
  };
  Stores() {
    this.props.navigation.navigate('Stores');
  }
  searchedText = (text)=>{
    this.setState({
      searchText      : text,
      loading         : true,
      page            : 0,
      farmerList      : [],
    });
}

  render() {
    return (
      <View style={styles.header2main}>
        <Header
          backgroundColor={'transparent'}
          placement="left"
          leftContainerStyle={styles.leftside}
          centerContainerStyle={styles.center}
          rightContainerStyle={styles.rightside}
          leftComponent={
            <View style={styles.flxdir}>
              <View style={{ marginTop: 10,}}>
                <TouchableOpacity onPress={this.props.toggle()}>
                  <Icon size={25} name='bars' type='font-awesome' color='#ed3c55' />
                </TouchableOpacity>
              </View>
            </View>
          }
          centerComponent={
            <View style={styles.flxdircenter}>
              <Image
                resizeMode="contain"
                source={require("../../AppDesigns/currentApp/images/KokilaBookstoreLogo.png")}
                style={styles.whitename}
              />
            </View>
          }
          rightComponent={
              <View style={styles.notificationbell}>
               <TouchableOpacity style={styles.bellIcon} onPress={()=> this.props.navigation.navigate('InAppNotification')}>
                <Icon name="bell-o" type="font-awesome"    size={25} color="#ed3c55" />
                <Text style={styles.notificationText}>{this.state.inAppNotificationsCount}</Text>
               </TouchableOpacity> 
                <TouchableOpacity onPress={()=>{Linking.openURL('tel:+91 90280 79487');}} style={{marginLeft:20}}>
                  <Icon name="phone" type="font-awesome"    size={25} color="#ed3c55" />
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('Stores')}>
                  <Icon size={25} name="store"  type="font-awesome-5" color='#ed3c55' />
                </TouchableOpacity> */}
              </View>
          }
          containerStyle={styles.rightcnt}
        />
        <View style={styles.searchvw}>
           <SearchBar
            placeholder='Search for Product, Brands and More'
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInputContainer}
            inputStyle={styles.searchInput}
            onChangeText={this.updateSearch.bind(this)}
            value={this.state.searchText}
          /> 
        </View>

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // selectedVehicle: state.selectedVehicle,
    // purposeofcar: state.purposeofcar,

  }
};

const mapDispatchToProps = (dispatch)=>{
return {
    setGloblesearch   : (searchText) => dispatch({
          searchText  : searchText,
          type        : "SET_GLOBAL_Search",
    })
}
};
export default connect(mapStateToProps,mapDispatchToProps)(HeaderBars2);
