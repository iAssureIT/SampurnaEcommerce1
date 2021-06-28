import React from 'react';
import {  StyleSheet,
          ScrollView,
          View,
          Text,
          TouchableOpacity,
          Alert,
          ImageBackground,
          Image,
          Platform,
          Dimensions,
          TextInput,
          BackHandler
        } from 'react-native';

import styles                              from './style.js';
import { Header, Icon, Button  }           from 'react-native-elements';
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import OrdersTabView                     from './OrdersTabView.js'
import { connect }                         from 'react-redux';

class OrdersView extends React.Component {
constructor(props) {
  super(props);
      this.state = {
      user_id           : "",
      token             : "",
    };
    AsyncStorage.multiGet(['user_id','token'])
    .then((data)=>{
      this.props.bookingList(data[0][1]);
      this.props.removeBookingDetails();
      this.setState({
        user_id : data[0][1],
        token  : data[1][1],
      })
    })
  }

  onButtonPress = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // then navigate
    navigate('NewScreen');
  }

  handleBackButton = () => {
    if (this.props.isFocused) {
      Alert.alert(
        'Confirmation',
        'Do you want to exit the application?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'confirm',
            onPress: () => BackHandler.exitApp()
          }
        ],
        {
          cancelable: false
        }
      );
      return true;
    }
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  } 


  render(){
      const { navigation }  = this.props;
      const { navigate }    = this.props.navigation;
     
        return(
        <React.Fragment>
            <OrdersTabView  navigation={navigation}/>  
        </React.Fragment>  
      );
  }

}

const mapStateToProps = (state)=>{
  console.log("state=>=>=>",state);
  return {
    user_id         : state.user_id,
    basicInfoTab    : state.basicInfoTab,
    EmpAddTab       : state.EmpAddTab,
    DocumentsTab    : state.DocumentsTab,
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {
      bookingList : (userId) => dispatch({type:"BOOKING_LIST",
                            userId : userId,
      }),
      removeBookingDetails : () => dispatch({type:"REMOVE_BOOKING_DETAILS"})
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(OrdersView);