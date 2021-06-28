import React,{Component} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  Linking
} from 'react-native';
import { Button, Icon }       from "react-native-elements";
import ValidationComponent    from "react-native-form-validator";
import styles                 from './styles.js';
import Modal                  from "react-native-modal";
import { connect }            from 'react-redux';
import { colors, sizes }       from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get('window');

class OpenModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal : false

    };
  }

  componentDidMount(){
    this.setState({
      openModal:this.props.openModal,
    })
  }

 
  render() {
    const { navigate, dispatch } = this.props.navigation;
    console.log("navigate",navigate);
    return (
        <React.Fragment>

        {this.props.openModal ?
          <Modal 
            isVisible                         = {this.props.openModal}
            onBackdropPress                   = {() => this.props.closeModal(false,"","")}
            coverScreen                       = {true}
            hideModalContentWhileAnimating    = {true}
            style                             = {{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming                = {500}
            backdropOpacity={Platform.OS === 'android'? 0.5 : 0.7}
          >
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10 }}>
              {this.props.messageType === "success" ?
                <View style={{ justifyContent: 'center', backgroundColor: "#34be34", width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                  <Icon size={28} name='check' type='fontAwesome5' color='#fff' style={{}} />
                </View>
                :
                this.props.messageType === "warning" ?
                <View style={{ justifyContent: 'center', backgroundColor: "#ec971f", width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                  <Icon size={28} name='exclamation' type='font-awesome' color='#fff' style={{}} />
                </View>
                :
                this.props.messageType === "error" ?
                <View style={{ justifyContent: 'center', backgroundColor: "#FAD162", width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                  <Icon size={28} name='close' type='font-awesome' color='#fff' style={{}} />
                </View>
                :
                null
              }  
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                {this.props.messageHead}
              </Text>
              {this.props.messagesSubHead!==""?
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 10 }}>
                  {this.props.messagesSubHead}
                </Text>
                :
                null
              }
              <View style={{borderBottomRightRadius:500,marginTop:15,flexDirection:'row'}}>
                <Button
                  onPress         = {()=>{this.props.closeModal(false,"","");this.props.route && navigate(this.props.route)}}
                  titleStyle      = {styles.buttonText}
                  title           = "OK"
                  buttonStyle     = {{width:'100%',height:45,alignItems:'center',justifyContent:'center',borderRadius:50,backgroundColor:colors.button}}
                  containerStyle  = {styles.buttonContainer}
                />
              </View>
            </View>
          </Modal>
          :
          null
        }
        </React.Fragment>
    );

  }
}
 const mapStateToProps = (state)=>{
   console.log("state",state);
  return {
    openModal             : state.openModal,
    messageHead           : state.messageHead,
    messagesSubHead       : state.messagesSubHead,
    messageType           : state.messageType,
    route                 : state.route,
  }
  
};

const mapDispatchToProps = (dispatch)=>{
  return {
    closeModal  : (openModal,message,messageType)=> dispatch({type: "MODAL",
                            openModal:openModal,
                            message:message,
                            messageType:messageType,
                  }),
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(OpenModal);