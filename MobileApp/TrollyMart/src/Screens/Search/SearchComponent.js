// import React from 'react';
// import {
//   ScrollView,
//   Text,
//   View,
//   BackHandler,
//   Dimensions,
//   AsyncStorage,
//   KeyboardAvoidingView,
//   ImageBackground,
//   Image,
//   TextInput,
//   Alert,
//   Picker,
//   Keyboard

// } from 'react-native';

// import SideMenu from 'react-native-side-menu';
// import Menu from '../../ScreenComponents/Menu/Menu.js';
// import HeaderBar2 from '../../ScreenComponents/HeaderBar2/HeaderBar2.js';
// import searchProducts from'../../Screens/Search/searchProducts.js';
// import {Footer} from '../../ScreenComponents/Footer/Footer1.js';

// import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
// import {colors} from '../../AppDesigns/currentApp/styles/styles.js';
// import Drawer from 'react-native-drawer';
// import Loading from '../../ScreenComponents/Loading/Loading.js';
// import axios from "axios";

// export default class SearchComponent extends React.Component{
//   constructor(props){
//     super(props);
//     this.state={
//       inputFocusColor   : colors.textLight,
//       isOpen            : false,
//       sections          : [],
//       exclusiveProducts : [],
//       featuredProducts  : [],
//       featuredproductsloading : true
//     };
//     this.getSections();
//     this.exclusiveProductsData();
//     this.featuredProductData();
//   }

//   componentDidMount() {
//     AsyncStorage.multiGet(['user_id', 'token'])
//       .then((data) => {
//         userId = data[0][1]
//         console.log('userId on Dashboard===>', userId);
//         this.setState({
//           userId : userId
//       })
//       })
//       .catch((error) => {
//         console.log('error', error);
//       })
//     this.getSections();
//     this.exclusiveProductsData();
//     this.getWishData();
//     // console.log("this.props.userId addCart =========>", this.props.searchText);
//     // this.searchproducts();
//   }  

//   getSections(){
//       axios.get('/api/sections/get/list')
//       .then((response)=>{
//           console.log('sect',response.data)
//           this.setState({
//               sections : response.data
//           })
//       })
//       .catch((error)=>{
//           console.log('error', error);
//       })
//   }

//   featuredProductData(){
//     var productType1 = 'featured';
//     axios.get("/api/products/get/listbytype/"+productType1)
//       .then((response)=>{
//         this.setState({
//           featuredproductsloading:false,
//           featuredProducts : response.data
//         })
//       })
//       .catch((error)=>{
//       })
//     }
 

//   exclusiveProductsData(){
//     var productType2 = 'exclusive';
//     axios.get("/api/products/get/listbytype/"+productType2)
//     .then((response)=>{
//       this.setState({
//         exclusiveprloading:false,
//         exclusiveProducts : response.data
//       })
//     })
//     .catch((error)=>{
//         // console.log('error', error);
//     })
//   }

//   getWishData(){
//     // var user_ID = localStorage.getItem('user_ID');
//     axios.get('/api/wishlist/get/userwishlist/')
//     .then((response)=>{
//       this.featuredProductData();
//       this.exclusiveProductsData();
//       this.newProductsData();
//       this.bestSellerData();
//       this.setState({
//         wishList : response.data
//       },()=>{
//       })
//     })
//     .catch((error)=>{
//       // console.log('error', error);
//     })
//   }

//   UNSAFE_componentWillReceiveProps(nextProps){
//   }

//   updateMenuState(isOpen) {
//     this.setState({ isOpen });
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

//   searchUpdated(text){
//     this.setState({ searchText: text });
//   }

//   render(){

//     const { navigate,dispatch } = this.props.navigation;
//     const menu = <Menu navigate={navigate} isOpen={this.state.isOpen}/>;

//     if(this.props.loading){
//       return(
//         <Loading />
//       );
//     }else{
//       return (
        
//         <Drawer>
//           <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
//             <HeaderBar2 
//               navigate={navigate}
//               toggle={()=>this.toggle.bind(this)} 
//               openControlPanel={()=>this.openControlPanel.bind(this)}
          
//             />
//             <View style={styles.superparent}>
//             <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
//               <View  style={styles.formWrapper}>                
//                 {
//                   (this.state.ProductsDetails.length > 0 ? 
//                     <searchProducts navigate = {navigate} title={'FEATURE PRODUCTS'}  newProducts={this.state.ProductsDetails} type={'featured'} getWishData={this.getWishData.bind(this)} wishList={this.state.wishList} userId={this.state.userId} categories={this.state.categories}/>
//                     : null
//                   )
//                 }
               
//               </View>
//             </ScrollView>
//             <Footer/>

//             </View>
//            </SideMenu>
//         </Drawer>
//       );  
//     }
    
    
//   }
// }
