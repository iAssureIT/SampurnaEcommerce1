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
import SideMenu from 'react-native-side-menu';
import {Menu} from '../../layouts/Menu/Menu.js';
import HeaderBar2 from '../../layouts/HeaderBar2/HeaderBar2.js';
import BestSellers from '../../layouts/BestSellers/BestSellers.js';
import BannerComponent from '../../layouts/BannerComponent/BannerComponent.js';
import MenuCarousel from '../../layouts/MenuCarousel/MenuCarousel.js';
import PopularComponent from'../../layouts/PopularComponent/PopularComponent.js';
import Footer from '../../layouts/Footer/Footer.js';
import Notification from '../../layouts/Notification/Notification.js'
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/HomeStyles.js';
import {colors} from '../../AppDesigns/currentApp/styles/styles.js';
import Drawer from 'react-native-drawer';
import Loading from '../../layouts/Loading/Loading.js';

import axios                      from 'axios';
const window = Dimensions.get('window');

export default class Home extends React.Component{
  constructor(props){
    super(props);
    this.state={
      inputFocusColor       : colors.textLight,
      isOpen: false,
  
    };
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



  searchUpdated(text){
    this.setState({ searchText: text });
  }

  render(){

    const { navigate,dispatch } = this.props.navigation;
    const menu = <Menu navigate={navigate} isOpen={this.state.isOpen}/>;

    if(this.props.loading){
      return(
        <Loading />
      );
    }else{
      return (
        <Drawer
          ref={(ref) => this._drawer = ref}
          content={
            <Notification 
              navigate          = {this.props.navigation.navigate} 
              updateCount       = {()=>this.updateCount.bind(this)}  
              closeControlPanel = {()=>this.closeControlPanel.bind(this)} 
            />
          }
          side="right"
          >
          <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
            <HeaderBar2 
              
              navigate={navigate}
              toggle={()=>this.toggle.bind(this)} 
              openControlPanel={()=>this.openControlPanel.bind(this)}
          
            />
            <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View  style={styles.formWrapper}>
                <View>
                  <BannerComponent />
                </View>
                <View>
                  <MenuCarousel  navigate = {navigate} />
                </View>
                <View>
                  <PopularComponent />
                </View>
                <View>
                 <BestSellers />
                </View>
              </View>
            </ScrollView>
            <Footer/>

            </View>
          </SideMenu>
        </Drawer>
      );  
    }
    
    
  }
}



