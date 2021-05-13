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
import {ForgotPassword}           from '../Screens/SystemSecurity/ForgotPassword/ForgotPassword.js';
import {ResetPassword}              from '../Screens/SystemSecurity/ResetPassword/ResetPassword.js';
import {RootSignUp}               from '../Screens/SystemSecurity/Signup/RootSignUp.js';
import {OTPVerification}            from '../Screens/SystemSecurity/OTPVerification/OTPVerification.js';
import {ForgotPasswordOTP}        from '../Screens/SystemSecurity/ForgotPasswordOTP/ForgotPasswordOTP.js';
import {Dashboard}                from '../Screens/Dashboard/Dashboard.js';
import {CategoriesComponent}       from'../Screens/CategoriesComponent/CategoriesComponent.js';
import {SubCategoriesComp}          from'../Screens/CategoriesComponent/SubCategoriesComp.js';
import {SubCatCompView}             from'../Screens/CategoriesComponent/SubCatCompView.js';
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
import {AccountInformation}         from'../Screens/AccountDashboard/AccountInformation.js';
import ResetPwd                   from'../Screens/AccountDashboard/ResetPwd.js';
import MyProductReview            from'../Screens/MyProductReview/MyProductReview.js';
import {OrderSummary}             from'../Screens/OrderSummary/OrderSummary.js';
import {PaymentMethod}            from '../Screens/PaymentMethod/PaymentMethod.js';

const Home = createDrawerNavigator();
console.log("TransitionPresets",TransitionPresets);

const TransitionScreenOptions = {
  ...TransitionPresets.ModalTransition, // This is where the transition happens
};


export const HomeStack = () => (
  <Home.Navigator 
    headerMode            = "none"
    mode="modal"
    drawerContent   = { (props) => <Menu { ...props } />}
  >
    <Home.Screen name="Dashboard"                   component={Dashboard} />
    <Home.Screen name="CategoriesComponent"         component={CategoriesComponent} />
    <Home.Screen name="SubCategoriesComp"           component={SubCategoriesComp} />
    <Home.Screen name="AllProductList"          component={AllProductList} />
    <Home.Screen name="SubCatCompView"              component={SubCatCompView} />
    <Home.Screen name="CartComponent"               component={CartComponent} />
    <Home.Screen name="ConfirmOrderComponent"       component={ConfirmOrderComponent} />
    <Home.Screen name="AddressDefaultComp"          component={AddressDefaultComp} />
    <Home.Screen name="AddressComponent"            component={AddressComponent} />
    <Home.Screen name="AddressComponentforaddress"  component={AddressComponentforaddress} />
    <Home.Screen name="AddressMenu"                 component={AddressMenu} />
    <Home.Screen name="WishlistComponent"           component={WishlistComponent} />
    <Home.Screen name="MyOrder"                     component={MyOrder} />
    <Home.Screen name="OrderDetails"                component={OrderDetails} />
    <Home.Screen name="AccountDashboard"            component={AccountDashboard} />
    <Home.Screen name="ResetPwd"                    component={ResetPwd} />
    <Home.Screen name="AccountInformation"          component={AccountInformation} />
    <Home.Screen name="MyProductReview"             component={MyProductReview} />
    <Home.Screen name="SupportSystem"               component={SupportSystem} />
    <Home.Screen name="OrderSummary"                component={OrderSummary} />
    <Home.Screen name="PaymentMethod"               component={PaymentMethod} />
    <Home.Screen name="Stores"                      component={Stores} />
    <Home.Screen name="StoreDetails"                component={StoreDetails} />
    <Home.Screen name="InAppNotification"           component={InAppNotification} /> 
  </Home.Navigator>
);


const RegisterRoutes = createStackNavigator();
export const RegisterStack = () => (
  <RegisterRoutes.Navigator
    headerMode="none"
    initialRouteName={"RootLogIn"}>
    <RegisterRoutes.Screen name={"RootLogIn"}         component={RootLogIn} />
    <RegisterRoutes.Screen name={"ResetPassword"}     component={ResetPassword} />
    <RegisterRoutes.Screen name={"OTPVerification"}   component={OTPVerification} />
    <RegisterRoutes.Screen name={"ForgotPassword"}    component={ForgotPassword} />
    <RegisterRoutes.Screen name={"ForgotPasswordOTP"} component={ForgotPasswordOTP} />
    <RegisterRoutes.Screen name={"Signup"}        component={RootSignUp} />
    {/* <RegisterRoutes.Screen name={"OTPVerification"} component={OTPVerification} /> */}
  </RegisterRoutes.Navigator>
);

const App = createStackNavigator();
const AppStack = () => (
  <App.Navigator headerMode="none" >
      <App.Screen name="App" component={HomeStack} />
      <App.Screen name="Auth" component={RegisterStack} />
      <App.Screen name="SubCatCompView" component={SubCatCompView} />
      <App.Screen name="Dashboard" component={Dashboard} />
  </App.Navigator>
);

export const AppContainer = () => {
  return (
    <NavigationContainer>
        <AppStack />
    </NavigationContainer>
  );
};  