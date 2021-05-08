
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { Header, Button, Icon, SearchBar } from "react-native-elements";
import SideMenu from 'react-native-side-menu';
import {Menu} from '../../ScreenComponents/Menu/Menu.js';
import Footer from '../../ScreenComponents/Footer/Footer.js';
import Notification from '../../ScreenComponents/Notification/Notification.js'
// import styles from './Contactusstyles.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Contactusstyles.js';
import {colors} from '../../AppDesigns/currentApp/styles/styles.js.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
export default class ContactUs extends React.Component{
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

    const { navigate,dispatch,goBack } = this.props.navigation;
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
            <HeaderBar5
              goBack={goBack}
              headerTitle={ 'Contact Us'}
          	  navigate={navigate}
            	toggle={()=>this.toggle.bind(this)} 
            	openControlPanel={()=>this.openControlPanel.bind(this)}
            />
            <View style={styles.superparent}>
            	<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              		<View  style={styles.formWrapper}>
               			<View style={styles.parent}>
                     <Text style={styles.contactdets}>Details: </Text>
                     <View style={styles.contactvw}>
                      <View style={styles.flxdir}>
                        <View style={styles.imgvw}>
                          <Image
                            style={styles.imgbg}
                            source={{uri: 'https://www.lulus.com/video/so_3/product/390882.jpg'}}
                          />
                        </View>
                        <View style={styles.rscontact}>
                          <Text style={styles.contactcontent}>Women Red Solid Fit and Flare Dress(Red)</Text>
                          <View style={styles.constacimgvw}>
                            <View style={styles.rsvw}>
                                <Icon
                                name="rupee"
                                type="font-awesome"
                                size={15}
                                color="#666"
                                iconStyle={styles.contacticns}
                                />
                                <Text style={{textDecorationLine: 'line-through',fontSize:12,fontFamily:"Montserrat-Regular",}}>3,140</Text>
                            </View>
                            <View style={styles.flxdir}>
                                <Icon
                                name="rupee"
                                type="font-awesome"
                                size={15}
                                color="#666"
                                iconStyle={styles.contacticns}
                                />
                                <Text style={styles.pricers}>2,141</Text>
                                <Text style={styles.peroffcont}> 68% OFF</Text>
                            </View>
                          </View>
                          <View style={styles.constacimgvw}>
                            <Text style={styles.soldby}>Sold by : </Text>
                            <Text style={styles.fashioncontact}>Kuki Fashion</Text>
                          </View>
                          <View style={styles.constacimgvw}>
                            <TouchableOpacity>
                              <View style={styles.contacticn}>
                                  <Icon
                                    name="minus-circle-outline"
                                    type="material-community"
                                    size={15}
                                    color="#666"
                                    iconStyle={styles.mincircleicn}
                                  />
                              </View>
                            </TouchableOpacity>
                            <View style={styles.qty15}>
                              <Text style={{}}>Qty : 15</Text>
                            </View>
                            <TouchableOpacity>
                              <View style={styles.contimgvw}>
                                <Icon
                                  name="plus-circle-outline"
                                  type="material-community"
                                  size={15}
                                  color="#666"
                                  iconStyle={styles.plusciricn}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View  style={styles.deletevw}>
                              <View style={styles.delvws}>
                              <TouchableOpacity>
                                <Button
                                  titleStyle={styles.buttonText2}
                                  title="Delete"
                                  buttonStyle={styles.button2}
                                  containerStyle={styles.buttonContainer2}
                                />
                              </TouchableOpacity>
                              </View>
                            <View style={styles.mvtowishlist}>
                              <TouchableOpacity>
                                <Button
                                  titleStyle={styles.buttonText2}
                                  title="Move to Wishlist"
                                  buttonStyle={styles.button2}
                                  containerStyle={styles.buttonContainer2}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>

                     </View>
                    <View style={styles.totalvw}>
                      <View style={styles.totvw}>
                      <View style={styles.flx5}>
                        <Text style={styles.totalprod}>Subtotal (2 Item) </Text>
                        <Text style={styles.totalprod}>Your Saving </Text>
                        <Text style={styles.totalprod}>Shipping </Text>
                        <Text style={styles.totalprod}>Order Total</Text>
                      </View>
                      <View  style={styles.flx5}>
                        <View style={styles.icnvws}> 
                           <Icon
                              name="rupee"
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.contacticns}
                              />
                            <Text style={styles.conactprices}>4500</Text>
                        </View>
                        <View style={styles.icnvws}> 
                           <Icon
                              name="rupee"
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.contacticns}
                              />
                            <Text style={styles.conactprices}>4500</Text>
                        </View>
                        <View style={styles.icnvws}> 
                           <Icon
                              name="rupee"
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.contacticns}
                              />
                            <Text style={styles.conactprices}>50</Text>
                        </View>
                        <View style={styles.icnvws}> 
                           <Icon
                              name="rupee"
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.contacticns}
                              />
                            <Text style={styles.conactprices}>4500</Text>
                        </View>
                      </View>
                     </View>
                     <View style={styles.mg20}>
                        <TouchableOpacity >
                          <Button
                          onPress={()=>this.props.navigation.navigate('AddressDefaultComp')}
                          title={"PROCEED TO CHECKOUT"}
                          buttonStyle={styles.button1}
                          containerStyle={styles.buttonContainer1}
                          />
                        </TouchableOpacity>
                    </View>
                     </View>
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



