import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Button, } from "react-native-elements";
import axios from "axios";
import Menu from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import Modal from "react-native-modal";
export default class AccountInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isOpen: false,
      profileupdated: false,
      starCount: 2.5,

    };
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }
  componentDidMount() {
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        this.setState({ user_id: data[1][1] })
        // console.log("addressId ===>>", addressId);
        axios.get('/api/ecommusers/' + data[1][1])
          .then((response) => {
            // console.log("response LIst ecommusers:==>>>", response.data.profile.mobile);
            this.setState({
              firstName: response.data.profile.firstname,
              lastName: response.data.profile.lastname,
              mobileNumber: response.data.profile.mobile,
              email: response.data.profile.email,
            })

          })
      });
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

  toggle() {
    let isOpen = !this.state.isOpen;
    this.setState({
      isOpen
    });
  }

  updateprofile() {
    let {
      firstName,
      lastName,
      mobileNumber,
      email,
    } = this.state;
    var emailId = email.toLowerCase();
    var formValues = {
      firstname: firstName,
      lastname: lastName,
      mobNumber: mobileNumber,
      email: emailId,
    }

    console.log('formValues=====>>>', this.state.user_id);
    axios.patch('/api/users/patch/' + this.state.user_id, formValues)
      .then((response) => {
        this.setState({profileupdated:true});
      })
      .catch((error) => {
        console.log(error);
      })
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

  deleteCompetitor(id) {
    console.log("id = ", id);
    Meteor.call('deleteCompetitor', id, (err, res) => {
      if (err) {

      } else {
        Alert.alert('', 'Competitor has been deleted');
      }
    });
  }



  render() {
    const { navigate, goBack } = this.props.navigation;
    if (this.props.loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <HeaderBar5
            goBack={goBack}
            headerTitle={'Account Information'}
            navigate={navigate}
            toggle={() => this.toggle.bind(this)}
            openControlPanel={() => this.openControlPanel.bind(this)}
          />
          <View style={styles.profileparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={{ paddingHorizontal: 15, marginBottom: 30 }}>
                {/* <View style={styles.profileparent}>
                      <Text style={styles.profiltitle}>Profile Details : </Text>                
                    </View> */}
                <View style={{ flex: 1, borderWidth: 1, borderColor: '#f1f1f1', backgroundColor: '#ccc', paddingVertical: 15, marginTop: 10 }}>
                  <Text style={{ fontSize: 13, fontFamily: "Montserrat-SemiBold", color: '#333', paddingHorizontal: 15 }}>Profile Details : </Text>
                </View>
                <View style={styles.profilfileds}>

                  <View style={styles.marTp15}>
                    <View style={styles.padhr15}>
                      <View style={[styles.formInputView, styles.marginBottom20]}>
                        <View style={[styles.inputWrapper]}>
                          {/* <View style={styles.inputImgWrapper}></View> */}
                          <View style={styles.inputTextWrapper}>
                            <TextField
                              label="First Name"
                              onChangeText={(firstName) => { this.setState({ firstName }) }}
                              lineWidth={1}
                              tintColor={colors.button}
                              inputContainerPadding={0}
                              labelHeight={13}
                              labelFontSize={sizes.label}
                              titleFontSize={13}
                              baseColor={'#666'}
                              textColor={'#333'}
                              value={this.state.firstName}
                              containerStyle={styles.textContainer}
                              inputContainerStyle={styles.textInputContainer}
                              titleTextStyle={styles.textTitle}
                              style={styles.textStyle}
                              labelTextStyle={styles.textLabel}
                              keyboardType="default"
                            />
                          </View>
                        </View>
                        {/* {this.displayValidationError('emailError')} */}
                      </View>
                      <View style={[styles.formInputView, styles.marginBottom20]}>
                        <View style={[styles.inputWrapper]}>
                          {/* <View style={styles.inputImgWrapper}></View> */}
                          <View style={styles.inputTextWrapper}>
                            <TextField
                              label="Last Name"
                              onChangeText={(lastName) => { this.setState({ lastName }) }}
                              lineWidth={1}
                              tintColor={colors.button}
                              inputContainerPadding={0}
                              labelHeight={13}
                              labelFontSize={sizes.label}
                              titleFontSize={13}
                              baseColor={'#666'}
                              textColor={'#333'}
                              value={this.state.lastName}
                              containerStyle={styles.textContainer}
                              inputContainerStyle={styles.textInputContainer}
                              titleTextStyle={styles.textTitle}
                              style={styles.textStyle}
                              labelTextStyle={styles.textLabel}
                              keyboardType="default"
                            />
                          </View>
                        </View>
                        {/* {this.displayValidationError('emailError')} */}
                      </View>
                      <View style={[styles.formInputView, styles.marginBottom20]}>
                        <View style={[styles.inputWrapper]}>
                          {/* <View style={styles.inputImgWrapper}></View> */}
                          <View style={styles.inputTextWrapper}>
                            <TextField
                              label="Phone Number"
                              onChangeText={(mobileNumber) => { this.setState({ mobileNumber }) }}
                              // {mobileNumber => this.handleMobileChange(mobileNumber)}
                              lineWidth={1}
                              tintColor={colors.button}
                              inputContainerPadding={0}
                              labelHeight={13}
                              llabelFontSize={sizes.label}
                              titleFontSize={13}
                              baseColor={'#666'}
                              textColor={'#333'}
                              value={this.state.mobileNumber}
                              containerStyle={styles.textContainer}
                              inputContainerStyle={styles.textInputContainer}
                              titleTextStyle={styles.textTitle}
                              style={styles.textStyle}
                              labelTextStyle={styles.textLabel}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                        {/* {this.displayValidationError('mobileNumberError')} */}
                      </View>
                      <View style={[styles.formInputView, styles.marginBottom20]}>
                        <View style={[styles.inputWrapper]}>
                          {/* <View style={styles.inputImgWrapper}></View> */}
                          <View style={styles.inputTextWrapper}>
                            <TextField
                              label="Email"
                              onChangeText={(email) => { this.setState({ email }) }}
                              // {mobileNumber => this.handleMobileChange(mobileNumber)}
                              lineWidth={1}
                              tintColor={colors.button}
                              inputContainerPadding={0}
                              labelHeight={13}
                              llabelFontSize={sizes.label}
                              titleFontSize={13}
                              baseColor={'#666'}
                              textColor={'#333'}
                              value={this.state.email}
                              containerStyle={styles.textContainer}
                              inputContainerStyle={styles.textInputContainer}
                              titleTextStyle={styles.textTitle}
                              style={styles.textStyle}
                              labelTextStyle={styles.textLabel}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                        {/* {this.displayValidationError('mobileNumberError')} */}
                      </View>
                    </View>
                  </View>
                </View>
                {/* <View style={{flex:1,borderWidth:1,borderColor:'#f1f1f1',backgroundColor:'#ccc',paddingVertical:15,marginTop:1}}>
                      <Text style={{fontSize:13,fontFamily:"Montserrat-SemiBold",color:'#333',paddingHorizontal:15}}>Change Password : </Text>                
                  </View>
                   <View style={{backgroundColor:'#fff',marginTop:15}}>
                   
                    <View style={{marginTop:15}}>
                        <View style={{paddingHorizontal:15,}}>
          
                        <View style={[styles.formInputView, styles.marginBottom20]}>
                            <View style={[styles.inputWrapper]}>
                                // <View style={styles.inputImgWrapper}></View>
                                <View style={styles.inputTextWrapper}>
                                    <TextField
                                        label                 = "Current Password"
                                        onChangeText          = {(firstName) => {this.setState({ firstName },()=>{this.validInputField('firstName', 'firstNameError');})}}
                                        lineWidth             = {1}
                                        tintColor             = {colors.button}
                                        inputContainerPadding = {0}
                                        labelHeight           = {13}
                                        labelFontSize         = {sizes.label}
                                        titleFontSize         = {13}
                                        baseColor             = {'#666'}
                                        textColor             = {'#333'}
                                        value                 = {this.state.firstName}
                                        containerStyle        = {styles.textContainer}
                                        inputContainerStyle   = {styles.textInputContainer}
                                        titleTextStyle        = {styles.textTitle}
                                        style                 = {styles.textStyle}
                                      labelTextStyle        = {styles.textLabel}
                                      keyboardType          = "default"
                                      />
                              </View>
                          </View>
                          {this.displayValidationError('emailError')}
                        </View>
                         <View style={[styles.formInputView, styles.marginBottom20]}>
                            <View style={[styles.inputWrapper]}>
                                // <View style={styles.inputImgWrapper}></View>
                                <View style={styles.inputTextWrapper}>
                                     <TextField
                                        label                 = "New Password"
                                        onChangeText          = {(mobileNumber) => {this.setState({ mobileNumber },()=>{this.validInputField('mobileNumber', 'mobileNumberError');}),this.handleMobileChange(mobileNumber)}}
                                        // {mobileNumber => this.handleMobileChange(mobileNumber)}
                                        lineWidth             = {1}
                                        tintColor             = {colors.button}
                                        inputContainerPadding = {0}
                                        labelHeight           = {13}
                                        llabelFontSize         ={sizes.label}
                                        titleFontSize         = {13}
                                        baseColor             = {'#666'}
                                        textColor             = {'#333'}
                                        value                 = {this.state.mobileNumber}
                                        containerStyle        = {styles.textContainer}
                                        inputContainerStyle   = {styles.textInputContainer}
                                        titleTextStyle        = {styles.textTitle}
                                        style                 = {styles.textStyle}
                                        labelTextStyle        = {styles.textLabel}
                                        keyboardType          = "numeric"
                                        /> 
                              </View>
                          </View>
                          {this.displayValidationError('mobileNumberError')}
                        </View>
                         <View style={[styles.formInputView, styles.marginBottom20]}>
                            <View style={[styles.inputWrapper]}>
                                // <View style={styles.inputImgWrapper}></View>
                                <View style={styles.inputTextWrapper}>
                                     <TextField
                                        label                 = "Confirm New Password"
                                        onChangeText          = {(mobileNumber) => {this.setState({ mobileNumber },()=>{this.validInputField('mobileNumber', 'mobileNumberError');}),this.handleMobileChange(mobileNumber)}}
                                        // {mobileNumber => this.handleMobileChange(mobileNumber)}
                                        lineWidth             = {1}
                                        tintColor             = {colors.button}
                                        inputContainerPadding = {0}
                                        labelHeight           = {13}
                                        llabelFontSize         ={sizes.label}
                                        titleFontSize         = {13}
                                        baseColor             = {'#666'}
                                        textColor             = {'#333'}
                                        value                 = {this.state.mobileNumber}
                                        containerStyle        = {styles.textContainer}
                                        inputContainerStyle   = {styles.textInputContainer}
                                        titleTextStyle        = {styles.textTitle}
                                        style                 = {styles.textStyle}
                                        labelTextStyle        = {styles.textLabel}
                                        keyboardType          = "numeric"
                                        /> 
                              </View>
                          </View>
                          {this.displayValidationError('mobileNumberError')}
                        </View>
                      </View>
                    </View> 
                  </View> */}
                <View style={{ marginBottom: "15%" }}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.updateprofile()}
                      title={"UPDATE PROFILE"}
                      buttonStyle={styles.button1}
                      titleStyle={styles.buttonTextEDIT}
                      containerStyle={styles.buttonContainerEDIT}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <Footer />
            <Modal isVisible={this.state.profileupdated}
              onBackdropPress={() => this.setState({ profileupdated: false })}
              coverScreen={true}
              hideModalContentWhileAnimating={true}
              style={{ paddingHorizontal: '5%', zIndex: 999 }}
              animationOutTiming={500}>
              <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme }}>
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                  Your profile is updated!
                </Text>
                <View style={styles.yesmodalbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.props.navigation.navigate('AccountDashboard')}
                      titleStyle={styles.buttonText1}
                      title="OK"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </React.Fragment>
      );
    }
  }
}



