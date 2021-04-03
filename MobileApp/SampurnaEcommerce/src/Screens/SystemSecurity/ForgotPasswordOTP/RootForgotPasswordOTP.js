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
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { TextField } from "react-native-material-textfield";
import { Button, Icon } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
import axios from "axios";
// import Modal from "../../Modal/OpenModal.js";
import Modal from "react-native-modal";
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/ForgotPasswordOTPStyles.js';
import { colors, sizes } from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import Loading from '../../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';
import { connect }        from 'react-redux';

const window = Dimensions.get('window');

class RootOTPVerification extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            inputFocusColor: colors.textLight,
            email: '',
            Password: '',
            resend: false,
            resendMobOtp: '',
            resendEmailOtp: '',
            otpMobInputError: '',
            otpEmailInputError: '',
            otpMobInput: ["", "", "", ""],
            mobInputs: ["m1", "m2", "m3", "m4"],
            otpEmailInput: ["", "", "", "", "", ""],
            emailInputs: ["e1", "e2", "e3", "e4"],
            btnLoading: false,
            resendLoading: false,
            userId: "",
            otpresend: false,
        };
    }

    componentDidMount() {
        // const userId = this.props.navigation.getParams('user_id','No user_id');
        // const userId = this.props.navigation.getParam('userID', 'No userID');
        console.log("user_id :===>",this.props.user_id);
        this.setState({
            userId: this.props.user_id,
        });
    }

    focusNext(index, value, otpType, length) {

        if (otpType == "mobile") {
            var { mobInputs, otpMobInput } = this.state;
            otpMobInput[index] = value;
            this.setState({ otpMobInput });
        } else if (otpType == "email") {
            var { emailInputs, otpEmailInput } = this.state;
            otpEmailInput[index] = value;
            this.setState({ otpEmailInput });
        }

        if (index < length - 1 && value) {
            let next = (otpType == "mobile") ? mobInputs[index + 1] : emailInputs[index + 1];
            // console.log("next = ",next);
            this.refs[next].focus();
        }
        if (this.state.otpEmailInput.length == 6) {
            this.setState({
                otpEmail: this.state.otpEmailInput.map(data => {
                    return data
                }).join("")
            })
        }
        if (this.state.otpMobInput.length == 6) {
            var otp = this.state.otpMobInput.map(data => {
                return data
            }).join("")
            this.setState({ otpMob: otp })
        }
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
        let { otpEmail } = this.state;
        this.setState({ btnLoading: true })
        axios.get('/api/auth/get/checkemailotp/usingID/'+this.state.userId+"/"+otpEmail)
        .then(response => {
          this.setState({ btnLoading: false })
          if (response.data.message == 'SUCCESS') {
            this.props.navigation('ResetPassword');
          }else{
            // var messageHead = "Please enter correct OTP.";
            // var messagesSubHead = "";
            // this.props.openModal(true,messageHead, messagesSubHead,"warning");
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
          console.log('setsendemailotpusingID in result==>>>', response.data)

          if (response.data.message == 'OTP_UPDATED') {
            // =================== Notification OTP ==================
          axios.get('/api/ecommusers/' + response.data.userID)
          .then((res) => {
            this.setState({
              fullName: res.data.profile.fullName,
              mobNumber: res.data.profile.mobile,
            }, () => {
              var sendData = {
                "event": "5",
                "toUser_id": response.data.userID,
                "toUserRole": "user",
                "variables": {
                  "Username": this.state.fullName,
                  "OTP": response.data.otpEmail,
                }
              }
              console.log('sendDataToUser==>', sendData)
              axios.post('/api/masternotifications/post/sendNotification', sendData)
                .then((res) => {
                    this.setState({otpresend: true,})
                  console.log('sendDataToUser in result==>>>', res.data)
                })
                .catch((error) => { console.log('notification error: ', error) })
            })
          })
          .catch((error) => {
            console.log('error', error)
          });
        // =================== Notification ==================
          }else{
            // var messageHead = response.data.message;
            // var messagesSubHead = "";
            // // this.props.openModal(true,messageHead, messagesSubHead,"warning");
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
                    <View style={styles.textTitleWrapper}><Text style={{ fontSize: 25, color:"#ed3c55", fontFamily: 'Montserrat-SemiBold',textAlign:'center' }}>OTP Verification</Text></View>
                    <View style={styles.textTitleWrapper}><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Regular' }}>Please Enter Verification Code</Text></View>
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
                           <ActivityIndicator size="large" color="#ed3c55" />
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
                <Modal isVisible={this.state.otpresend}
                    onBackdropPress={() => this.setState({ otpresend: false })}
                    coverScreen={true}
                    hideModalContentWhileAnimating={true}
                    style={{ zIndex: 999 }}
                    animationOutTiming={500}>
                    <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:"#ed3c55" }}>
                    <View style={{ justifyContent: 'center', }}>
                        <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
                    </View>
                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20, }}>
                        OTP has been Re-send to your Email Id.
                    </Text>
                    <View style={styles.yesmodalbtn}>
                        <Button
                        onPress={() => this.setState({ otpresend: false })}
                        titleStyle={styles.modalText}
                        title="OK"
                        buttonStyle={styles.modalGreen1}
                        containerStyle={styles.buttonContainer1}
                        />
                    </View>
                    </View>
                </Modal>
            </View>
        );

    }
}

const mapStateToProps = (state) => {
    console.log("Name serarch state==>",state.user_id);
    return {
        user_id: state.user_id,
    }
  };
  export default connect(mapStateToProps)(RootOTPVerification);