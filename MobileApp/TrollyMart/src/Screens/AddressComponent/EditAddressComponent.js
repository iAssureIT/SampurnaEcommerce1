
// import React from 'react';
// import {
//   ScrollView,
//   Text,
//   View,
//   BackHandler,
//   Dimensions,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   ImageBackground,
//   Image,
//   TextInput,
//   Alert,
//   Picker,
//   Keyboard

// } from 'react-native';

// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import Drawer from 'react-native-drawer';
// import { TextField } from 'react-native-material-textfield';
// import { Header, Button, Icon, SearchBar,CheckBox } from "react-native-elements";
// import SideMenu from 'react-native-side-menu';
// import StarRating from 'react-native-star-rating';
// import axios from "axios";
// import Menu from '../../ScreenComponents/Menu/Menu.js';
// import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
// // import Footer from '../../ScreenComponents/Footer/Footer.js';
// import Footer from '../../ScreenComponents/Footer/UniFooter.js';
// import Notification from '../../ScreenComponents/Notification/Notification.js'
// import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Addressstyles.js';
// import {colors} from '../../AppDesigns/currentApp/styles/styles.js';
// import Loading from '../../ScreenComponents/Loading/Loading.js';
// const window = Dimensions.get('window');

// export default class EditAddressComponent extends React.Component{
//   constructor(props){
//     super(props);
//     this.state={
//       	inputFocusColor       : colors.textLight,
//       	isOpen: false,
//         starCount: 2.5,
  	  
//     };
//   }

//   UNSAFE_componentWillReceiveProps(nextProps){
//   }

//   updateMenuState(isOpen) {
//     this.setState({ isOpen });
//   }

//   displayValidationError = (errorField) =>{
//     let error = null;
//     if(this.state[errorField]){
//       error = <View style={{width:'100%'}}>
//                 <Text style={{color:'#dc3545'}}>{this.state[errorField][0]}</Text>
//               </View> ;
//     }
//     return error;
//   }

//   toggle() {
//     let isOpen = !this.state.isOpen;
//       this.setState({
//         isOpen
//       });
//   }

//   closeControlPanel = () => {
//     this._drawer.close()
//   }

//   openControlPanel = () => {
//     this._drawer.open()
//   }

//   handleZipChange(value){
//     let x = value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,4})/);
//     let y = !x[2] ? x[1] : x[1]+'-'+x[2];
//     this.setState({
//       zipcode : y,
//     });
//   }

//   handleDelete = (id) => {
//     Alert.alert("", "Are you sure you want to delete ?", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         onPress: () => {
//           this.deleteCompetitor(id);
//         }
//       },
//     ]);
//   };

//   deleteCompetitor(id){
//     console.log("id = ",id);
//     Meteor.call('deleteCompetitor',id,(err,res)=>{
//       if(err){

//       }else{
//         Alert.alert('','Competitor has been deleted');
//       }
//     });
//   }



//   searchUpdated(text){
//     this.setState({ searchText: text });
//   }

   

//   render(){

//     const { navigate,dispatch,goBack } = this.props.navigation;
//     const menu = <Menu navigate={navigate} isOpen={this.state.isOpen}/>;

//     if(this.props.loading){
//       return(
//         <Loading />
//       );
//     }else{
//       return (
//         <Drawer
//           	ref={(ref) => this._drawer = ref}
//           	content={
// 	            <Notification 
// 	              	navigate          = {this.props.navigation.navigate} 
// 	              	updateCount       = {()=>this.updateCount.bind(this)}  
// 	              	closeControlPanel = {()=>this.closeControlPanel.bind(this)} 
// 	            />
//           	}
//           	side="right"
//           	>
//           	<SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
//             <HeaderBar5
//                 goBack={goBack}
//                 headerTitle={ 'Address'}
//             	  navigate={navigate}
//               	toggle={()=>this.toggle.bind(this)} 
//               	openControlPanel={()=>this.openControlPanel.bind(this)}
//             />
//             <View style={styles.addsuperparent}>
//             	<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
//               	<View style={styles.padhr15}>
//                   <View style={styles.addcmpchkbx}>
//                     <View style={styles.addchkbx}>
//                        <CheckBox
//                           center
//                           checkedIcon='dot-circle-o'
//                           uncheckedIcon='circle-o'
//                           checked={this.state.checked}
//                           textStyle={styles.chkbox}
//                           containerStyle={{borderWidth:0,}}
//                         />
//                       <Text style={styles.addname}> Garima Billore (Default)</Text>
//                       <Text style={styles.addoffice}> OFFICE </Text>
//                     </View>
//                     <View style={styles.padhr18}>
//                     <Text style={styles.address}> 323 Amanora Chambers, Amanora Mall,Hadapsar,Pune,411028 Maharashtra uygfewuafyrfuyeuwefegfuyegfuwgefwyegfyuwegfyugewfyuwe jhfjwfwegfw hfuwehuiwef efwfuwehfuw</Text> 
//                     <View style={styles.mobflx}>
//                       <Text style={styles.mobileno}>Mobile:</Text>
//                       <Text style={styles.mobilenum}>79989846513</Text>
//                     </View>
//                     </View>
//                     <View style={styles.flxrow}>
//                       <View style={styles.canclebtn}>
//                         <TouchableOpacity  onPress={()=>this.props.navigation.navigate('CartComponent')}>
//                           <Button
//                           onPress={()=>this.props.navigation.navigate('CartComponent')}
//                           title={"REMOVE"}
//                           buttonStyle={styles.button1}
//                           containerStyle={styles.buttonContainer1}
//                           />
//                       </TouchableOpacity>
//                       </View>
//                      <View style={styles.canclebtn}>
//                       <TouchableOpacity >
//                         <Button
//                         onPress={()=>this.props.navigation.navigate('AddressComponent')}
//                         title={"EDIT"}
//                         buttonStyle={styles.button1}
//                         containerStyle={styles.buttonContainer1}
            
//                         />
//                     </TouchableOpacity>
//                     </View>
//                     </View>
//                   </View>
//                 </View>
              	
//             	</ScrollView>
//             	<Footer/>
//             </View>
//           </SideMenu>
//         </Drawer>
//       );  
//     }
//   }
// }



