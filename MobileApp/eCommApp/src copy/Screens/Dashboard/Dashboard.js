import React from 'react';
import {ScrollView,View,AsyncStorage,} from 'react-native';

import { Header, Button, Icon, SearchBar } from "react-native-elements";
import SideMenu from 'react-native-side-menu';
import Menu from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar2 from '../../ScreenComponents/HeaderBar2/HeaderBar2.js';
import BannerComponent from '../../ScreenComponents/BannerComponent/BannerComponent.js';
import MenuCarouselSection from '../../ScreenComponents/Section/MenuCarouselSection.js';
import FeatureProductComponent from'../../ScreenComponents/FeatureProductComponent/FeatureProductComponent.js';
import ExclusiveProductsData from'../../ScreenComponents/ExclusiveproductsComponent/Exclusiveproducts.js';
import DiscountedProductComponent from'../../ScreenComponents/DiscountedProductComponent/DiscountedProductComponent.js';
import SearchProducts from'../Search/SearchProducts.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import Notification from '../../ScreenComponents/Notification/Notification.js'
import { connect }        from 'react-redux';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import {colors} from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import Drawer from 'react-native-drawer';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import axios from "axios";

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state={
      inputFocusColor   : colors.textLight,
      isOpen            : false,
      sections          : [],
      exclusiveProducts : [],
      featuredProducts  : [],
      discountedProducts  : [],
      featuredproductsloading : true
    };
    // this.getSections();
    this.exclusiveProductsData();
    this.featuredProductData();
    this.discountedProductsData();

    this.SearchProducts();
    this.countfun();
  }

componentDidMount(){
  this.focusListener = this.props.navigation.addListener('didFocus', () => {
    console.log("this.componentDidMount IN ===>");
    AsyncStorage.multiGet(['user_id', 'token'])
      .then((data) => {
        userId = data[0][1]
        // console.log('userId on Dashboard===>', userId);
        this.setState({
          userId : userId
      },()=>{
        this.countfun();
      })
      })
      .catch((error) => {
        console.log('error', error);
      })
    // this.getSections();
    this.featuredProductData();
    this.exclusiveProductsData();
    this.discountedProductsData();
    this.getWishData();
    
     
  })
}
componentWillUnmount () {
  this.focusListener.remove()
}

  UNSAFE_componentWillReceiveProps(nextProps){
      this.SearchProducts();
      this.featuredProductData();
      this.exclusiveProductsData();
      this.discountedProductsData();
      this.getWishData();
      this.countfun();
  }
  countfun(){
    // console.log('footer userId==>', this.state.userId)
            axios.get("/api/Carts/get/count/" + this.state.userId)
              .then((response) => {
                // console.log('footer response.data==>', response.data)
                this.setState({
                  getCartCountData: response.data,
                })
              })
              .catch((error) => { })
  }
  // getSections(){
  //     axios.get('/api/sections/get/list')
  //     .then((response)=>{
  //         console.log('sect',response.data)
  //         this.setState({
  //             sections : response.data
  //         })
  //     })
  //     .catch((error)=>{
  //         console.log('error', error);
  //     })
  // }
  SearchProducts(){
    // console.log("Name serarch==>",this.props.searchText);
    // axios.get("/api/products/get/search/" + this.props.searchText)
    axios.get("/api/products/get/searchproducts/" + this.props.searchText)
          .then((response) => {
            this.setState({
              SearchProductsDetails: response.data,
            },()=>{
              console.log("searchResult of serarch==>",this.state.SearchProductsDetails);
            })
            
          })
          .catch((error) => {})
  }
  featuredProductData(){
    var productType1 = 'featured';
    axios.get("/api/products/get/products/listbytype/"+productType1)
      .then((response)=>{
        this.setState({
          featuredproductsloading:false,
          featuredProducts : response.data
        })
      })
      .catch((error)=>{
      })
  }
  // featuredProductData(){
  //   var section = 'featured';
  //   axios.get("/api/products/get/list/mobile/"+section)      
  //         .then((response)=>{
  //           if(response.data){
  //           console.log('featuredProductData Products ==== ' , response.data)
  //           this.setState({
  //             vegetableProductsloading:false,
  //             featuredProducts : response.data
  //           })
  //         }
  //         })
  //         .catch((error)=>{
  //             console.log('error', error);
  //         })
  // }
  // exclusiveProductsData(){
  //   var section = 'exclusive';
  //   axios.get("/api/products/get/list/mobile/"+section)      
  //         .then((response)=>{
  //           if(response.data){
  //           // console.log('vegetables Products ==== ' , response.data)
  //           this.setState({
  //             exclusiveProductsloading:false,
  //             exclusiveProducts : response.data
  //           })
  //         }
  //         })
  //         .catch((error)=>{
  //             console.log('error', error);
  //         })
  // }

  exclusiveProductsData(){
    var productType2 = 'exclusive';
    axios.get("/api/products/get/products/listbytype/"+productType2)
    .then((response)=>{
      this.setState({
        exclusiveprloading:false,
        exclusiveProducts : response.data
      })
    })
    .catch((error)=>{
        // console.log('error', error);
    })
  }

  discountedProductsData(){
    var productType2 = 'discounted';
    axios.get("/api/products/get/products/listbytype/"+productType2)
    .then((response)=>{
      this.setState({
        discountedprloading:false,
        discountedProducts : response.data
      })
    })
    .catch((error)=>{
        // console.log('error', error);
    })
  }

  getWishData(){
    // var user_ID = localStorage.getItem('user_ID');
    axios.get('/api/wishlist/get/userwishlist/')
    .then((response)=>{
      this.featuredProductData();
      this.exclusiveProductsData();
      this.discountedProductsData();
      // this.newProductsData();
      // this.bestSellerData();
      this.setState({
        wishList : response.data
      },()=>{
      })
    })
    .catch((error)=>{
      // console.log('error', error);
    })
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
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
        <Drawer>
          <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
            <HeaderBar2 
              navigation={this.props.navigation}
              toggle={()=>this.toggle.bind(this)} 
              openControlPanel={()=>this.openControlPanel.bind(this)}
          
            />
            <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View  style={styles.formWrapper}>
                {/* <View style={styles.bannerwrap}> */}
                { this.props.searchText ?
                  null
                     
                :
                  <BannerComponent />
                }
                {/* </View> */}
                <View>
                { this.props.searchText ?
                  null
                     
                :
                  <MenuCarouselSection  navigate = {navigate}/>
                }
                  </View>
                { this.props.searchText ?
                     <SearchProducts navigate = {navigate} title={'Search Products'} searchProds={this.state.SearchProductsDetails}  />
                     
                :
                  (this.state.featuredProducts.length > 0 ? 
                    // <FeatureProductComponent navigate = {navigate} title={'FEATURE PRODUCTS'}  newProducts={this.state.featuredProducts} type={'featured'} getWishData={this.getWishData.bind(this)} wishList={this.state.wishList} userId={this.state.userId} categories={this.state.categories}/>
                    <FeatureProductComponent navigate = {navigate} title={'Featured Books'}  newProducts={this.state.featuredProducts} type={'featured'} getWishData={this.getWishData.bind(this)} wishList={this.state.wishList} userId={this.state.userId} categories={this.state.categories}/>
                    : null
                  )
                }
                {/* {console.log("this.props.searchText====>",this.props.searchText)} */}
                {
                this.props.searchText ? null :
                    (this.state.exclusiveProducts.length > 0 ? 
                      // <ExclusiveProductsData navigate = {navigate} title={'EXCLUSIVE PRODUCTS'}  newProducts={this.state.exclusiveProducts} type={'exclusive'} getWishData={this.getWishData.bind(this)} wishList={this.state.wishList} userId={this.state.userId} categories={this.state.categories}/>
                      <ExclusiveProductsData navigate = {navigate} title={'Exclusive Books'}  newProducts={this.state.exclusiveProducts} type={'exclusive'} getWishData={this.getWishData.bind(this)} wishList={this.state.wishList} userId={this.state.userId} categories={this.state.categories}/>
                      : null
                    )
                }
                                {
                this.props.searchText ? null :
                    (this.state.exclusiveProducts.length > 0 ? 
                      // <ExclusiveProductsData navigate = {navigate} title={'EXCLUSIVE PRODUCTS'}  newProducts={this.state.exclusiveProducts} type={'exclusive'} getWishData={this.getWishData.bind(this)} wishList={this.state.wishList} userId={this.state.userId} categories={this.state.categories}/>
                      <DiscountedProductComponent navigate = {navigate} title={'Discounted Books'}  newProducts={this.state.discountedProducts} type={'exclusive'} getWishData={this.getWishData.bind(this)} wishList={this.state.wishList} userId={this.state.userId} categories={this.state.categories}/>
                      : null
                    )
                }

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

const mapStateToProps = (state) => {
  // console.log("Name serarch state==>",state.searchText);
  return {
      searchText: state.searchText,
  }
};
export default connect(mapStateToProps)(Dashboard);
