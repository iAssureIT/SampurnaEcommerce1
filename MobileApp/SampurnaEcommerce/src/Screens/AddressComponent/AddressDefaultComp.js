
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,ActivityIndicator
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Header, Button, Icon, SearchBar, CheckBox } from "react-native-elements";
import axios from "axios";
import Menu from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import Notification from '../../ScreenComponents/Notification/Notification.js'
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Addressstyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';

export default class AddressDefaultComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isOpen: false,
      starCount: 2.5,
      isSelected: "",
      isSelected: false,
      isChecked: false,
      checked: 'first',

    };
  }
  componentDidMount() {
    // AsyncStorage.multiGet(['token', 'user_id'])
    //   .then((data) => {
    //     console.log("user_id ===>>", data[1][1]);
    //     this.setState({ user_id: data[1][1] })
    //     axios.get('/api/ecommusers/' + data[1][1])
    //       .then((response) => {
    //         console.log("response LIst:==>>>", response.data.deliveryAddress);
    //         if (response.data.deliveryAddress.length > 0) {
    //           var Deliveryaddress = response.data.deliveryAddress
    //           this.setState({ Deliveryaddress: Deliveryaddress })
    //         } else {
    //           this.props.navigation.navigate('AddressComponent')
    //           this.setState({ Deliveryaddress: [] })
    //         }

    //       })
    //       .catch((error) => {
    //         console.log('error', error)
    //       });
    //   });
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      console.log('hit getWishlistData 1');
      this.getaddresslist();
    })
  }
  componentWillUnmount () {
    this.focusListener.remove()
  }
  getaddresslist(){
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        console.log("user_id ===>>", data[1][1]);
        this.setState({ user_id: data[1][1] })
        axios.get('/api/ecommusers/' + data[1][1])
          .then((response) => {
            console.log("response LIst:==>>>", response.data.deliveryAddress);
            if (response.data.deliveryAddress.length > 0) {
              var Deliveryaddress = response.data.deliveryAddress
              this.setState({ Deliveryaddress: Deliveryaddress })
            } else {
              this.props.navigation.navigate('AddressComponent')
              this.setState({ Deliveryaddress: [] })
            }

          })
          .catch((error) => {
            console.log('error', error)
          });
      });
    }
  UNSAFE_componentWillReceiveProps(nextProps){
    this.getaddresslist();
  }

  displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={{ width: '100%' }}>
        <Text style={{ color: '#dc3545' }}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }
  Deleteaddress(deliveryAddressID) {
    // console.log("this.state.user_id Deleted address:==>>>", this.state.user_id);
    // console.log("this.deliveryAddressID:==>>>", deliveryAddressID);
    var formValues = {
      user_ID: this.state.user_id,
      deliveryAddressID: deliveryAddressID
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
  handleZipChange(value) {
    let x = value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,4})/);
    let y = !x[2] ? x[1] : x[1] + '-' + x[2];
    this.setState({
      zipcode: y,
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
  selectedaddress(index,id, adddata) {
    var selectedindex = index;
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked })
    // console.log("id = ", id);
    // console.log("adddata = ", adddata);
    this.setState({
      addressid: id,
      adddata: adddata,
    });
    this.setState({
         selectedindex:selectedindex,
    });
}
  render() {
    const { navigate, goBack } = this.props.navigation;
      return (
        <React.Fragment>
          <HeaderBar5
            goBack={goBack}
            headerTitle={'Delivery Addresses'}
            navigate={navigate}
          />
          <View style={styles.addsuperparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.padhr15}>
                <View style={styles.addcmpbtn}>
                    <Button
                      onPress={() => this.props.navigation.navigate('AddressComponent')}
                      title={"ADD NEW ADDRESS"}
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer1}
                      titleStyle={styles.buttonTextEDIT}
                    />
                </View>
                {this.state.Deliveryaddress ?
                  this.state.Deliveryaddress.length > 0 ?
                  this.state.Deliveryaddress.map((item, i) => {
                    // console.log("ITEM Address ==>",item);
                    return (
                      <View key={i} 
                      style={[(
                        this.state.selectedindex === i ?
                            styles.addcmpchkbxbordergreen
                        :
                            styles.addcmpchkbx
                        )]}>
                      <TouchableOpacity onPress={() => {this.selectedaddress(i,item._id,item) }} >
                        
                          <View style={styles.addchkbx}>
                            <View style={styles.nameofcontact}>
                              <Text style={styles.addname}> {item.name}</Text>
                            </View>
                            <View style={styles.chkvw}>
                            </View>
                            <View style={styles.proddeletes}>
                              <Icon
                                onPress={() => this.Deleteaddress(item._id)}
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

                      </TouchableOpacity>
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
                  {
                    this.state.addressid ?
                      <TouchableOpacity >
                        <Button
                          onPress={() => this.props.navigation.navigate('OrderSummary', { adddata: this.state.adddata, user_id: this.state.user_id })}
                          title={"CONTINUE"}
                          buttonStyle={styles.button1}
                          containerStyle={styles.buttonContainer1}
                          titleStyle={styles.buttonTextEDIT}
                        />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity >
                        <Button
                          title={"CONTINUE"}
                          buttonStyle={styles.buttondis}
                          containerStyle={styles.buttonContainer1}
                          titleStyle={styles.buttonTextEDIT}
                        />
                      </TouchableOpacity>
                  }
                </View>
              </View>
            </ScrollView>
            <Footer />
          </View>
        </React.Fragment>
      );
    }
}



