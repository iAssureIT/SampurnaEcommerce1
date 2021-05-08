
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,ActivityIndicator,
} from 'react-native';
import { Header, Button, Icon, SearchBar,CheckBox } from "react-native-elements";
import axios from "axios";
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
// import Footer from '../../ScreenComponents/Footer/Footer.js';
import {Footer} from '../../ScreenComponents/Footer/Footer1.js';
import Notification from '../../ScreenComponents/Notification/Notification.js'
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Addressstyles.js';
import {colors} from '../../AppDesigns/currentApp/styles/styles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AddressMenu extends React.Component{
  constructor(props){
    super(props);
    this.state={
      	inputFocusColor: colors.textLight,
      	isOpen: false,
        starCount: 2.5,
        isSelected: "",
        isSelected:false,
        isChecked: false,
  	  
    };
  }
componentDidMount(){
  this.focusListener = this.props.navigation.addListener('didFocus', () => {
    console.log('hit getWishlistData 1');
    this.getaddresslist();
  })
}
UNSAFE_componentWillReceiveProps(nextProps){
  this.getaddresslist();
}
componentWillUnmount () {
  this.focusListener.remove()
}
getaddresslist(){
AsyncStorage.multiGet(['token', 'user_id'])
.then((data) => {
  // console.log("user_id ===>>", data[1][1]);
  this.setState({ user_id: data[1][1] })
  axios.get('/api/ecommusers/'+data[1][1])
  .then((response) => {
      if(response.data.deliveryAddress.length > 0){
        var Deliveryaddress = response.data.deliveryAddress
        this.setState({ Deliveryaddress: Deliveryaddress })
      }else{
        this.props.navigation.navigate('AddressComponentforaddressmenu')
      }
  })
  .catch((error) => {
    console.log('error', error)
  });
});
}

Deleteaddress(deliveryAddressID){
    var formValues = {
      user_ID : this.state.user_id,
      deliveryAddressID : deliveryAddressID
    }
  axios.patch('/api/users/delete/address', formValues)
    .then((response) => {
      // console.log("response LIst:==>>>", response.data);
      Alert.alert(
        "Address Deleted",
        "",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
      this.getaddresslist();
    })
    .catch((error) => {
      console.log('error', error)
    });
  }

  handleZipChange(value){
    let x = value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,4})/);
    let y = !x[2] ? x[1] : x[1]+'-'+x[2];
    this.setState({
      zipcode : y,
    });
  }

  handleDelete = (id) => {
    Alert.alert("", "Are you sure you want to delete ?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          this.deleteCompetitor(id);
        }
      },
    ]);
  };
  render(){
    const { navigate,goBack } = this.props.navigation;
      return (
        <React.Fragment>
            <HeaderBar5
                goBack={goBack}
                headerTitle={'My Addresses'}
            	  navigate={navigate}
            />
            <View style={styles.addsuperparent}>
            	<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              	<View style={styles.padhr15}>
                  <View style={styles.addcmpbtn}>
                    <TouchableOpacity >
                      <Button
                      // onPress={()=>this.props.navigation.navigate('AddressComponent')}
                      onPress={()=>this.props.navigation.navigate('AddressComponentforaddressmenu')}
                      title={"ADD NEW ADDRESS"}
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer1}
                      titleStyle={styles.buttonTextEDIT}
                      />
                    </TouchableOpacity>
                  </View>
                  {
                    this.state.Deliveryaddress ?
                    this.state.Deliveryaddress.length > 0 ?
                      this.state.Deliveryaddress.map((item,i)=>{
                      return(
                    <View key={i} style={styles.addcmpchkbx}>
                        <View style={styles.addchkbx}>
                        
                          <View style={styles.nameofcontact}>
                            <Text style={styles.addname}> {item.name}</Text>
                          </View>

                        
                          <View style={styles.proddeletes}>
                              <Icon
                                onPress={()=>this.Deleteaddress(item._id)}
                                name="delete"
                                type="AntDesign"
                                size={18}
                                color="#ff4444"
                                iconStyle={styles.iconstyle}
                              />
                          </View>
                        </View>
                        <View style={styles.padhr18}>
                          <Text style={styles.address}>{item.addressLine1}</Text> 
                          <View style={styles.mobflx}>
                            <Text style={styles.mobileno}>Mobile:</Text>
                            <Text style={styles.mobilenum}>{item.mobileNumber}</Text>
                          </View>
                        </View>
                    
                    </View>
                     )
                    })
                    :
                      <View style={styles.addcmpchkbx}>
                        <View style={styles.addchkbx}>
                          <Text style={styles.addnotfound}>Address Not Found:</Text>
                        </View>
                      </View>
                    :
                      <View style={styles.addcmpchkbx}>
                        <ActivityIndicator size="large" color="#00ff00" />
                      </View>
                  }
                  <View style={styles.continuebtn}>
                  </View>
                </View>
            	</ScrollView>
            	<Footer/>
            </View>
          </React.Fragment>
      );  
    }
}



