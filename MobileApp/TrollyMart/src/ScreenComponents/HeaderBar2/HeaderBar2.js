import React,{useState,useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage
}                                 from "react-native";
import {Linking}                  from 'react-native'
import { 
  Header, 
  Icon,
  SearchBar,
  Button 
} from 'react-native-elements';
import ValidationComponent  from "react-native-form-validator";
import axios                from 'axios'; 
import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HeaderBar2Styles.js';
import { connect }          from 'react-redux';
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';

  const HeaderBars2=(props)=>{
    const [searchText,useSearchText] = useState('');
    const [inAppNotificationsCount,setInAppNotifyCount] = useState(0);
    
    const _goBack = () => {
      props.goBack();
    }

    const handleNavigation = (screen) => {
      this.props.navigate(screen);
    }

    useEffect(() => {
      console.log("useEffect");
      getData()
    },[]);
 
  const getData=()=>{
    getNotificationList();
    props.setGloblesearch(searchText);
  }

  const getNotificationList=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        console.log("data",data);
          var token = data[0][1]
          var user_id = data[1][1]
            axios.get('/api/notifications/get/list/Unread/' + user_id)
            .then(notifications => {
              console.log("notifications",notifications);
                setInAppNotifyCount(notifications.data.length)
            })
            .catch(error => {
                console.log('error', error)
            })
      });
  }

  const updateSearch = (searchText) => {
    useSearchText(searchText);
    props.setGloblesearch(searchText);
  };

  const Stores=()=>{
    props.navigation.navigate('Stores');
  }

  const searchedText = (text)=>{
    useSearchText(text);
}

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
                <TouchableOpacity  onPress={()=> props.navigation.toggleDrawer()}>
                  <Icon size={25} name='bars' type='font-awesome' color={colors.theme} />
                </TouchableOpacity>
              </View>
            </View>
          }
          centerComponent={
            <View style={styles.flxdircenter}>
              <Image
                resizeMode="contain"
                source={require("../../AppDesigns/currentApp/images/Logo.png")}
                style={styles.whitename}
              />
            </View>
          }
          rightComponent={
              <View style={styles.notificationbell}>
               <TouchableOpacity style={styles.bellIcon} onPress={()=> navigation.navigate('InAppNotification')}>
                <Icon name="bell-o" type="font-awesome"    size={25} color={colors.theme} />
                <Text style={styles.notificationText}>{inAppNotificationsCount}</Text>
               </TouchableOpacity> 
                <TouchableOpacity onPress={()=>{Linking.openURL('tel:+91 90280 79487');}} style={{marginLeft:20,justiafyContent:"flex-end"}}>
                  <Icon name="phone" type="font-awesome"    size={25} color={colors.theme} />
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('Stores')}>
                  <Icon size={25} name="store"  type="font-awesome-5" color=colors.theme />
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
            onChangeText={updateSearch}
            value={searchText}
          /> 
        </View>

      </View>
    );
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