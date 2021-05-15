
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button,} from "react-native-elements";
import axios from "axios";
import Menu from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar3 from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import {colors} from '../../AppDesigns/currentApp/styles/styles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';


export default class AccountDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state={
        inputFocusColor       : colors.textLight,
        isOpen: false,
        starCount: 2.5,
        loading :true
      
    };
  }
  
  componentDidMount(){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      console.log('hit getWishlistData 1');
      this.showdetails();
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    this.showdetails();
  }
  componentWillUnmount () {
    this.focusListener.remove()
  }
  showdetails() {
    AsyncStorage.multiGet(['token', 'user_id'])
    .then((data) => {
      this.setState({ user_id: data[1][1] })
      axios.get('/api/ecommusers/'+data[1][1])
      .then((res) => {
        // console.log("res.data.image==>", res.data.profile);
        var dAddress = res.data.deliveryAddress.length>0 ? res.data.deliveryAddress[0].addressLine1 : null;
        this.setState({
                  fullName: res.data.profile.fullName,
                  email: res.data.profile.email,
                  dAddress : dAddress,
                  mobNumber: res.data.profile.mobile,
                  profileImage: res.data.image,
                  companyID: res.data.companyID,
                  loading : false
                })
        
      })
      .catch((error) => {
        this.setState({loading : false})
        console.log('error', error)
      });
    });
  }
  updateMenuState(isOpen) {
    this.setState({ isOpen });
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

  deleteCompetitor(id){
    console.log("id = ",id);
    Meteor.call('deleteCompetitor',id,(err,res)=>{
      if(err){

      }else{
        Alert.alert('','Competitor has been deleted');
      }
    });
  }

   

  render(){
    const { navigate,goBack } = this.props.navigation;
      return (
        <React.Fragment>
            <HeaderBar3
                goBack={goBack}
                headerTitle={'Account Dashboard'}
                navigate={navigate}
            />
            <View style={styles.acdashsuperparent}>
            {this.state.loading?
                 <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                    <Loading/>
                 </View>   
                 :
              <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
                <View style={styles.acdashparent}>
               
                 <View style={styles.accuserinfo}>
                    <View style={styles.padhr15}>
                    <Text style={styles.acccontactinfo}>User Information</Text>
                    </View>
                     <View style={styles.padhr18}> 
                      
                      <View style={styles.accusermobinfo}>
                        <Text style={styles.accusermob}>Your Name</Text>
                        <Text style={{flex:0.05}}>: </Text>
                        <Text style={styles.accmobnumber}>{this.state.fullName}</Text>
                      </View>
                    </View>
                     <View style={styles.padhr18}> 
                      <View style={styles.accusermobinfo}>
                        <Text style={styles.accusermob}>Your Address</Text>
                        <Text style={{flex:0.05}}>: </Text>
                        <Text style={styles.accmobnumber}>{this.state.dAddress } </Text> 
                      </View>
                    </View>
                    <View style={styles.padhr18}>
                    <View style={styles.accusermobinfo}>
                      <Text style={styles.accusermob}>Mobile</Text>
                      <Text style={{flex:0.05}}>: </Text>
                      <Text style={styles.accmobnumber}>{this.state.mobNumber}</Text>
                    </View>
                    </View>
                    <View style={styles.padhr18}>
                    <View style={styles.accusermobinfo}>
                      <Text style={styles.accusermob}>Email Id</Text>
                      <Text style={{flex:0.05}}>: </Text>
                      <Text style={styles.accmobnumber}>{this.state.email}</Text>
                    </View>
                    </View>
                    <View style={styles.acceditbtn}>
                      <View style={styles.acceditbtns}>
                        <TouchableOpacity>
                          <Button
                          onPress={()=>this.props.navigation.navigate('AccountInformation')}
                          title={"EDIT Profile"}
                          buttonStyle={styles.button1}
                          titleStyle={styles.buttonTextEDIT}
                          containerStyle={styles.buttonContainerEDIT}
                          />
                      </TouchableOpacity>
                      </View>
                      <View style={styles.acceditbtns}>
                        <TouchableOpacity>
                          <Button
                          onPress={()=>this.props.navigation.navigate('ResetPwd')}
                          title={"Reset Password"}
                          buttonStyle={styles.button1}
                          titleStyle={styles.buttonTextEDIT}
                          containerStyle={styles.buttonContainerEDIT}
                          />
                      </TouchableOpacity>
                      </View>
                    </View> 
                </View>
               </View>
                
              </ScrollView>}
              <Footer/>
            </View>
          </React.Fragment>
      );  
    }
}



