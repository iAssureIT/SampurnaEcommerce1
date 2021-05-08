
import React from 'react';
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
  Picker,
  Keyboard

} from 'react-native';
import { Header, Button, Icon, SearchBar } from "react-native-elements";

import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/ConfirmOrderStyles.js';
import {colors} from '../../AppDesigns/currentApp/styles/styles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import axios from "axios";
export default class ConfirmOrderComponent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      	inputFocusColor       : colors.textLight,
      	isOpen: false,
  	};
  }

  UNSAFE_componentWillReceiveProps(nextProps){
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }
  

  displayValidationError = (errorField) =>{
    let error = null;
    if(this.state[errorField]){
      error = <View style={{width:'100%'}}>
                <Text style={{color:'#dc3545'}}>{this.state[errorField][0]}</Text>
              </View> ;
    }
    return error;
  }

  toggle() {
    let isOpen = !this.state.isOpen;
      this.setState({
        isOpen
      });
  }

  closeControlPanel = () => {
    this._drawer.close()
  }

  openControlPanel = () => {
    this._drawer.open()
  }


  render(){

    // const { goBack,navigate } = this.props.navigation;
    // const menu = <Menu navigate={navigate} isOpen={this.state.isOpen}/>;

    if(this.props.loading){
      return(
        <Loading />
      );
    }else{
      return (
    
            <View style={styles.superparent}>
              		<View  style={styles.formWrapper}>
               			<View style={styles.parent}>
                      <Text style={styles.confirmorder}>Women Red Solid Fit and Flare Dress</Text>
                      <View style={styles.ordervw}>
                        <View style={styles.flx3}>
                          <Text  style={styles.titletxt}>Quantity</Text>
                          <Text style={styles.titletxt}>Price</Text> 
                        </View>
                        <View style={styles.flx3}>
                          <Text  style={styles.ordertxt}> 2 </Text>
                         <View style={styles.icnvw}>
                            <Icon
                            name="rupee"
                            type="font-awesome"
                            size={15}
                            color="#c10000"
                            iconStyle={styles.icn}
                            />
                            <Text style={styles.rsprice}>3,140</Text>
                        </View>
                        </View>
                        <View style={styles.imgvw}>
                           <Image
                            style={styles.imgstyle}
                            source= {require("../../AppDesigns/currentApp/images/15.png")}
                          />
                        </View>
                      </View>
                    <View style={styles.deleveryvw}>
                      <Text style={styles.deleverydate}>Delivery by, Mon Sep 1</Text>
                    </View>
                    <View>
                    </View>
                    </View>
                  </View>
                </View>
      );  
    }
  }
}



