import React from 'react';
import {
    ScrollView,
    Text,
    View,
    BackHandler,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { TextField }        from "react-native-material-textfield";
import { Button, Icon }     from "react-native-elements";
import ValidationComponent  from "react-native-form-validator";
import axios                      from 'axios';
import Modal                from "react-native-modal";
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/OTPVerificationStyles.js';
import { colors, sizes }    from '../../../AppDesigns/currentApp/styles/styles.js';
import Loading from '../../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';
import { connect }          from 'react-redux';
import AsyncStorage         from '@react-native-async-storage/async-storage';


const window = Dimensions.get('window');

class RootOTPVerification extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            inputFocusColor: colors.textLight,
            email               : '',
            Password            : '',
            resend              : false,
            resendMobOtp        : '',
            resendEmailOtp      : '',
            otpMobInputError    : '',
            otpEmailInputError  : '',
            otpMobInput         : ["", "", "", ""],
            mobInputs           : ["m1", "m2", "m3", "m4"],
            otpEmailInput       : ["", "", "", ""],
            emailInputs         : ["e1", "e2", "e3", "e4"],
            btnLoading          : false,
            resendLoading       : false,
            userId              : "",
            openModal           : false,
            otpEmail            : '',
            token               : ''
        };

    }

    componentDidMount() {
    // const userId = this.props.navigation.getParam('userID', 'No userID');
    // const EmailOTP = this.props.navigation.getParam('EmailOTP', 'No EmailOTP');
    //     this.setState({ 
    //       otpEmail: EmailOTP,
    //     })
        AsyncStorage.multiGet(['user_id_signup'])
            .then((data) => {
                console.log('data otp---',data)
                var user_id_signup = data[0][1]
                this.setState({ 
                    userId: user_id_signup
                },()=>{
                    axios.get('/api/users/get/' + this.state.userId)
                        .then((res) => {
                        console.log("res.data.user details==>", res.data);
                        this.setState({
                            user_id: res.data._id,
                            fullName: res.data.fullName,
                            username: res.data.email,
                            // deliveryAddress: res.data.deliveryAddress[0],
                            mobNumber: res.data.mobile,
                            profileImage: res.data.image,
                            companyID: res.data.companyID
                        })
                        })
                        .catch((error) => {});
                })
            })

    }

    focusNext(index, value, otpType, length) {

        // if (otpType == "mobile") {
        //     var { mobInputs, otpMobInput } = this.state;
        //     otpMobInput[index] = value;
        //     this.setState({ otpMobInput });
        // }
        if (otpType == "email") {
            var emailInputs = this.state.emailInputs
            var otpEmailInput = this.state.otpEmailInput

            otpEmailInput[index] = value;
            this.setState({ otpEmailInput:otpEmailInput },()=>{
                console.log('otpEmailInput',this.state.otpEmailInput)
            });

        }

        if (index < length - 1 && value) {
            let next = (otpType == "mobile") ? mobInputs[index + 1] : emailInputs[index + 1];
            // console.log("next = ",next);
            this.refs[next].focus();
        }
        if (this.state.otpEmailInput.length == 4) {
            this.setState({
                otpEmail: this.state.otpEmailInput.map(data => {
                    return data
                }).join("")
            })
        }
        // if (this.state.otpMobInput.length == 4) {
        //     var otp = this.state.otpMobInput.map(data => {
        //         return data
        //     }).join("")
        //     this.setState({ otpMob: otp })
        // }
    }
    focusPrevious(key, index, otpType) {
        if (key === 'Backspace' && index !== 0) {
            if (otpType == "mobile") {
                let { mobInputs } = this.state;
                var prev = mobInputs[index - 1];
            } else {
                let { emailInputs } = this.state;
                var prev = emailInputs[index - 1];
            }

            this.refs[prev].focus();
        }
    }

    handleError = (error, name) => {
        console.log("name = ", name, "error = ", error);
        this.setState({
            [name]: error,
        });
    }

    handleSubmit = () => {

        console.log('userId otp',this.state.userId)
        console.log('otpEmail otp',this.state.otpEmail)

        let { otpEmail } = this.state;
        this.setState({ btnLoading: true })

        axios.get('/api/auth/get/checkemailotp/usingID/'+this.state.userId+"/"+this.state.otpEmail)
        .then(response => {
          this.setState({ btnLoading: false })
          if (response.data.message == 'SUCCESS') {
              // =================== Notification OTP ==================
            var sendData = {
                "event": "1",
                "toUser_id": this.state.user_id,
                "toUserRole":"user",
                "variables": {
                  "Username" : this.state.fullName,
                  }
                }
                console.log('sendDataToUser==>', sendData)
                axios.post('/api/masternotifications/post/sendNotification', sendData)
                .then((res) => {
                console.log('sendDataToUser in result==>>>', res.data)
                })
                .catch((error) => { console.log('notification error: ',error)})
              // =================== Notification ==================
            this.props.navigation('Login');
          }else{
            var messageHead = "Please enter correct OTP.";
            var messagesSubHead = "";
            this.props.openModal(true,messageHead, messagesSubHead,"warning");
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            this.setState({ incorrectPwModal: true, btnLoading: false })
          }
        })
    }

    handleResend = () => {
        this.setState({ resendLoading: true, otpEmailInput: ['', '', '', '', '', ''], otpMobInput: ['', '', '', ''], otpEmail: '', otpMob: '' })
        axios.patch('/api/auth/patch/setsendemailotpusingID/'+this.state.userId)
        .then(response => {
          this.setState({ resendLoading: false })
          if (response.data.message == 'OTP_UPDATED') {
            // =================== Notification OTP ==================
          axios.get('/api/ecommusers/' + this.state.user_id)
          .then((result) => {
            this.setState({
              fullName: result.data.profile.fullName,
              mobNumber: result.data.profile.mobile,
            }, () => {
              var sendData = {
                "event": "5",
                "toUser_id": this.state.user_id,
                "toUserRole": "user",
                "variables": {
                  "Username": this.state.fullName,
                  "OTP": result.data.otpEmail,
                }
              }
              // console.log('sendDataToUser==>', sendData)
              axios.post('/api/masternotifications/post/sendNotification', sendData)
                .then((res) => {
                    this.setState({otpresend: true,})
                  // console.log('sendDataToUser in result==>>>', res.data)
                })
                .catch((error) => { console.log('notification error: ', error) })
            })
          })
          .catch((error) => {
            console.log('error', error)
          });
        // =================== Notification ==================
          }else{
            var messageHead = response.data.message;
            var messagesSubHead = "";
            this.props.openModal(true,messageHead, messagesSubHead,"warning");
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            this.setState({resendLoading: false })
          }
        })

    }

    render() {
        const { navigate, dispatch, goBack } = this.props.navigation;
        const { navigation } = this.props;

        return (
            <View>
                <View style={{ width: '100%',}}>
                    <View style={styles.textTitleWrapper}><Text style={styles.otpvtitle}>OTP Verification</Text></View>
                    <View style={styles.textTitleWrapper}><Text style={styles.otpvsubtitle}>Please Enter Verification Code</Text></View>
                    <View style={styles.formWrapper}>
                        <View style={[styles.formInputView, styles.otpWrap]}>
                            {/* <Text style={styles.otpText}>Email</Text> */}
                            <View style={styles.otpInputWrap}>
                                {
                                    this.state.emailInputs.map((data, index) => {
                                        return (
                                            <View key={index} style={styles.otpInput}>
                                                <TextInput
                                                    label=""
                                                    onChangeText={(v) => this.focusNext(index, v, "email", 4)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, index, "email")}
                                                    lineWidth={1}
                                                    tintColor={colors.button}
                                                    inputContainerPadding={0}
                                                    labelHeight={15}
                                                    labelFontSize={sizes.label}
                                                    titleFontSize={15}
                                                    baseColor={'#666'}
                                                    textColor={'#333'}
                                                    // value = {this.state.otpEmail}
                                                    containerStyle={styles.textContainer}
                                                    inputContainerStyle={styles.textInputContainer}
                                                    titleTextStyle={styles.textTitle}
                                                    style={styles.textStyle}
                                                    labelTextStyle={styles.textLabel}
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    ref={data}
                                                    selectTextOnFocus
                                                    selectionColor={colors.primary}
                                                />
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                           {this.state.btnLoading ?
                             <Button
                                // onPress={this.handleSubmit.bind(this)}
                                titleStyle={styles.buttonText}
                                title="Verify"
                                loading
                                buttonStyle={styles.button}
                                containerStyle={styles.button1Container}
                            />
                            :
                             <Button
                                onPress={this.handleSubmit.bind(this)}
                                titleStyle={styles.buttonText}
                                title="Verify"
                                buttonStyle={styles.button}
                                containerStyle={styles.button1Container}
                            />
                          }
                         
                             
                            
                        </View>
                        <Button
                           onPress={this.handleResend.bind(this)}
                            // onPress={this.handleSubmit.bind(this)}
                            titleStyle={styles.buttonText1}
                            title="Resend OTP"
                            buttonStyle={styles.button1}
                            containerStyle={styles.buttonContainer1}
                            icon={
                              <Icon name="chevron-double-left" type="material-community" size={22} color="#666" style={{}} />
                            }
                          />
                    </View>
                </View>
                {this.props.openModal ?
                  <Modal navigation={navigation}/>
                  :
                  null
                }
            </View>
        );

    }
}
const mapStateToProps = (state)=>{
  return {
    user_id             : state.user_id,
    openModal           : state.openModal,
  }
  
};
const mapDispatchToProps = (dispatch)=>{
  return {
      openModal  : (openModal,messageHead,messagesSubHead,messageType)=> dispatch({type: "MODAL",
                             openModal:openModal,
                            messageHead:messageHead,
                            messagesSubHead:messagesSubHead,
                            messageType:messageType,
                  }),
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(RootOTPVerification);