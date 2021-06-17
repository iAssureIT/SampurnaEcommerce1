import React, { useEffect }       from 'react';
import {NavigationContainer}      from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators,TransitionPresets }   from '@react-navigation/stack';
import { createDrawerNavigator }  from '@react-navigation/drawer';
// import { createAppContainer }     from 'react-navigation';
import { Animated, Easing }       from 'react-native';
import axios                      from 'axios';
import {AuthLoadingScreen}        from '../ScreenComponents/AuthLoadingScreen/AuthLoadingScreen.js';
import InAppNotification          from '../ScreenComponents/InAppNotification/InAppNotification.js';
import {Menu}                     from '../ScreenComponents/Menu/Menu.js';

/*----SystemSecurity -----*/
import {RootLogIn }               from '../Screens/SystemSecurity/RootLogIn/RootLogIn.js';
import {LogIn}                    from '../Screens/SystemSecurity/RootLogIn/LogIn.js';
import {ForgotPassword}           from '../Screens/SystemSecurity/ForgotPassword/ForgotPassword.js';
import {ResetPassword}            from '../Screens/SystemSecurity/ResetPassword/ResetPassword.js';
import {RootSignUp}               from '../Screens/SystemSecurity/Signup/RootSignUp.js';
import {OTPVerification}          from '../Screens/SystemSecurity/OTPVerification/OTPVerification.js';
import {ForgotPasswordOTP}        from '../Screens/SystemSecurity/ForgotPasswordOTP/ForgotPasswordOTP.js';
import Dashboard                  from '../Screens/Dashboard/Dashboard.js';
import {CategoriesComponent}      from'../Screens/CategoriesComponent/CategoriesComponent.js';
import {SubCategoriesComp}        from'../Screens/CategoriesComponent/SubCategoriesComp.js';
import {SubCatCompView}           from'../Screens/CategoriesComponent/SubCatCompView.js';
import {CartComponent}            from '../Screens/CartComponent/CartComponent.js';
import ConfirmOrderComponent      from '../Screens/ConfirmOrderComponent/ConfirmOrderComponent.js';
import {AddressDefaultComp}       from '../Screens/AddressComponent/AddressDefaultComp.js';
import {AddressComponent}         from '../Screens/AddressComponent/AddressComponent.js';
import AddressComponentforaddress from '../Screens/AddressComponent/AddressComponentforaddressmenu.js';
import AddressMenu                from'../Screens/AddressComponent/AddressMenu.js';
import {WishlistComponent}        from'../Screens/WishlistComponent/WishlistComponent.js';
import {MyOrder}                  from '../Screens/MyOrders/MyOrder.js';
import {SupportSystem}            from '../Screens/Help&Support/SupportSystem.js';
import Stores                     from '../Screens/Stores/Stores.js';
import StoreDetails               from '../Screens/Stores/StoreDetails.js';
import {AllProductList}           from '../Screens/AllProductList/AllProductList.js';
import {OrderDetails}             from '../Screens/MyOrders/OrderDetails.js';
import {AccountDashboard}         from '../Screens/AccountDashboard/AccountDashboard.js';
import {MyAccount}                from '../Screens/MyAccount/MyAccount.js';
import {AccountInformation}       from'../Screens/AccountDashboard/AccountInformation.js';
import ResetPwd                   from'../Screens/AccountDashboard/ResetPwd.js';
import MyProductReview            from'../Screens/MyProductReview/MyProductReview.js';
import {OrderSummary}             from'../Screens/OrderSummary/OrderSummary.js';
import {PaymentMethod}            from '../Screens/PaymentMethod/PaymentMethod.js';
import {Location}                 from '../Screens/Location/Location.js';
import {Confirmation}             from '../Screens/Location/Confirmation.js';
import {VendorList}               from '../Screens/VendorList/VendorList.js';
import {ProductVendorList}        from '../Screens/VendorList/ProductVendorList.js';
import {VendorProducts}           from '../Screens/VendorProducts/VendorProducts.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  HeaderBar2                 from '../ScreenComponents/HeaderBar2/HeaderBar2.js';

const Home = createDrawerNavigator();
const TransitionScreenOptions = {
  ...TransitionPresets.ModalTransition, // This is where the transition happens
};



export const HomeStack = () => (

  
  <Home.Navigator 
    headerMode            = "none"
    // mode="modal"
    initialRouteName ="Dashboard"
    screenOptions={{
      gestureEnabled:true,
      gestureDirection:'horizontal',
      cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS
      // transitionSpec:{
      //   open:config,
      //   close:closeConfig
      // }
    }}
    drawerContent   = { (props) => <Menu { ...props } />}
  >
    <Home.Screen name="Dashboard"                   component={Dashboard}  options={getHeaderConfig("",false)}/>
    <Home.Screen name="CategoriesComponent"         component={CategoriesComponent} options={getHeaderConfig("Dashboard",true)}/>
    <Home.Screen name="SubCategoriesComp"           component={SubCategoriesComp}options={getHeaderConfig("Dashboard")} />
    <Home.Screen name="AllProductList"              component={AllProductList} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="SubCatCompView"              component={SubCatCompView} options={getHeaderConfig("Product Details",true)}/>
    <Home.Screen name="CartComponent"               component={CartComponent} options={getHeaderConfig("My Cart",true)}/>
    <Home.Screen name="ConfirmOrderComponent"       component={ConfirmOrderComponent} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="AddressDefaultComp"          component={AddressDefaultComp} options={getHeaderConfig("Delivery Addresses",true)}/>
    <Home.Screen name="AddressComponent"            component={AddressComponent} options={getHeaderConfig("Add Address",true)}/>
    <Home.Screen name="AddressComponentforaddress"  component={AddressComponentforaddress} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="AddressMenu"                 component={AddressMenu} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="WishlistComponent"           component={WishlistComponent} options={getHeaderConfig("My Wishlist",true)}/>
    <Home.Screen name="MyOrder"                     component={MyOrder} options={getHeaderConfig("My Orders",true)}/>
    <Home.Screen name="OrderDetails"                component={OrderDetails} options={getHeaderConfig("Orders Details",true)}/>
    <Home.Screen name="AccountDashboard"            component={AccountDashboard} options={getHeaderConfig("Account Dashboard",true)}/>
    <Home.Screen name="ResetPwd"                    component={ResetPwd} options={getHeaderConfig("Reset Password",true)}/>
    <Home.Screen name="AccountInformation"          component={AccountInformation} options={getHeaderConfig("Account Information",true)}/>
    <Home.Screen name="MyAccount"                   component={MyAccount} options={getHeaderConfig("My Account",true)}/>
    <Home.Screen name="MyProductReview"             component={MyProductReview} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="SupportSystem"               component={SupportSystem} options={getHeaderConfig("Help & Support",true)}/>
    <Home.Screen name="OrderSummary"                component={OrderSummary} options={getHeaderConfig("Order Summary",true)}/>
    <Home.Screen name="PaymentMethod"               component={PaymentMethod} options={getHeaderConfig("Payment Methods",true)}/>
    <Home.Screen name="Stores"                      component={Stores} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="StoreDetails"                component={StoreDetails} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="InAppNotification"           component={InAppNotification} options={getHeaderConfig("Dashboard")}/> 
    <Home.Screen name="VendorList"                  component={VendorList} options={getHeaderConfig("Vendor List",true)}/>
    <Home.Screen name="ProductVendorList"           component={ProductVendorList} options={getHeaderConfig("Vendor List",true)}/>
    <Home.Screen name="VendorProducts"              component={VendorProducts} options={getHeaderConfig("Product List",true)}/>
  </Home.Navigator>
);

const getHeaderConfig = (title,backBtn) => {
  return {
    headerShown: true,
    headerTitle: title,
    headerTitleAlign: "left",
    header: (props) => <HeaderBar2  headerTitle={title} backBtn={backBtn} />,
  };
};

const RegisterRoutes = createStackNavigator();
export const RegisterStack = () => (
  <RegisterRoutes.Navigator headerMode="none" >
    <RegisterRoutes.Screen name={"LogIn"}             component={LogIn} />
    <RegisterRoutes.Screen name={"RootLogIn"}         component={RootLogIn} />
    <RegisterRoutes.Screen name={"ResetPassword"}     component={ResetPassword} />
    <RegisterRoutes.Screen name={"OTPVerification"}   component={OTPVerification} />
    <RegisterRoutes.Screen name={"ForgotPassword"}    component={ForgotPassword} />
    <RegisterRoutes.Screen name={"ForgotPasswordOTP"} component={ForgotPasswordOTP} />
    <RegisterRoutes.Screen name={"Signup"}            component={RootSignUp} />
    <RegisterRoutes.Screen name="Location"            component={Location} />
    {/* <RegisterRoutes.Screen name={"OTPVerification"} component={OTPVerification} /> */}
  </RegisterRoutes.Navigator>
);

const LocationRoutes = createStackNavigator();
export const LocationScreen = () => (
  <RegisterRoutes.Navigator headerMode="none">
      <LocationRoutes.Screen name="Confirmation"  component={Confirmation} />
      <LocationRoutes.Screen name="Location"      component={Location} />
      <LocationRoutes.Screen name="AddressDefaultComp" component={AddressDefaultComp} />
  </RegisterRoutes.Navigator>     
);

const App = createStackNavigator();
const AppStack = () => (
  <App.Navigator headerMode="none">
      <App.Screen name="App"              component={HomeStack} />
      <App.Screen name="Auth"             component={RegisterStack} />
      <App.Screen name="LocationMain"     component={LocationScreen} />
  </App.Navigator>
);

const Auth = createStackNavigator();
const AuthStack = () => (
  <Auth.Navigator headerMode="none">
      <Auth.Screen name="Auth"          component={RegisterStack} />
      <Auth.Screen name="App"           component={HomeStack} />
      <Auth.Screen name="LocationMain"  component={LocationScreen} />
  </Auth.Navigator>
);


const LocationMain = createStackNavigator();
const LocationStack = () => (
      <LocationMain.Navigator headerMode="none">
      <LocationMain.Screen name="LocationMain"  component={LocationScreen} />
      <LocationMain.Screen name="App"           component={HomeStack} />
      <LocationMain.Screen name="Auth"          component={RegisterStack} />
  </LocationMain.Navigator>
);


const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="CartComponent" component={CartComponent} />
      <Tab.Screen name="WishlistComponent" component={WishlistComponent} />
      <Tab.Screen name="MyOrder" component={MyOrder} />
    </Tab.Navigator>
  );
}

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
   duration:500,
   easing:Easing.linear,
  },
};

export const AppContainer = () => {
  return (
    <NavigationContainer>
        <AppStack/>
    </NavigationContainer>
  );
};  

export const LocationContainer = () => {
  return (
    <NavigationContainer >
        <LocationStack/>
    </NavigationContainer>
  );
}; 

export const AuthContainer = () => {
  return (
    <NavigationContainer >
        <AuthStack/>
    </NavigationContainer>
  );
};  