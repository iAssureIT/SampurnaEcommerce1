import React from 'react';
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
  Linking,
  AsyncStorage
} from 'react-native';
import { Button, Icon }       from "react-native-elements";
import ValidationComponent    from "react-native-form-validator";
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/ModelStyles.js';
import Modal                  from "react-native-modal";
import { connect }            from 'react-redux';

const window = Dimensions.get('window');

class OpenModal extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal : false

    };
  }

  componentDidMount(){
    console.log("this.props=>",this.props)
    this.setState({
      openModal:this.props.openModal,
    })
  }

 
  render() {
    const { navigate, dispatch } = this.props.navigation;
    return (
        <React.Fragment>

        {this.props.openModal ?
          <Modal isVisible={this.props.openModal}
            onBackdropPress={() => this.props.closeModal(false,"","")}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={styles.modvw}
            animationOutTiming={500}>
            <View style={styles.modparent}>
              {this.props.messageType === "success" ?
                <View style={styles.modicn}>
                  <Icon size={28} name='check' type='fontAwesome5' color='#fff' style={{}} />
                </View>
                :
                this.props.messageType === "warning" ?
                <View style={styles.icnmod}>
                  <Icon size={28} name='exclamation' type='font-awesome' color='#fff' style={{}} />
                </View>
                :
                this.props.messageType === "error" ?
                <View style={styles.icnmodel}>
                  <Icon size={28} name='close' type='font-awesome' color='#fff' style={{}} />
                </View>
                :
                null
              }  
              <Text style={styles.modmsghead}>
                {this.props.messageHead}
              </Text>
              {this.props.messagesSubHead!==""?
                <Text style={styles.modsubhead}>
                  {this.props.messagesSubHead}
                </Text>
                :
                null
              }
              <View style={styles.modbtn}>
                <Button
                  onPress         = {()=>this.props.closeModal(false,"","")}
                  titleStyle      = {styles.buttonText}
                  title           = "OK"
                  buttonStyle     = {styles.modbtnstyle}
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
  console.log("bState===",state);
  return {
    openModal             : state.openModal,
    messageHead           : state.messageHead,
    messagesSubHead       : state.messagesSubHead,
    messageType           : state.messageType,
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