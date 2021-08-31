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
import {AddressDefaultComp}       from '../Screens/AddressComponent/AddressDefaultComp.js';
import {AddressComponent}         from '../Screens/AddressComponent/AddressComponent.js';
import AddressComponentforaddress from '../Screens/AddressComponent/AddressComponentforaddressmenu.js';
import AddressMenu                from'../Screens/AddressComponent/AddressMenu.js';
import {SupportSystem}            from '../Screens/Help&Support/SupportSystem.js';
import {AccountDashboard}         from '../Screens/AccountDashboard/AccountDashboard.js';
import {MyAccount}                from '../Screens/MyAccount/MyAccount.js';
import {AccountInformation}       from'../Screens/AccountDashboard/AccountInformation.js';
import ResetPwd                   from'../Screens/AccountDashboard/ResetPwd.js';
import {OrderSummary}             from'../Screens/OrderSummary/OrderSummary.js';
import {Location}                 from '../Screens/Location/Location.js';
import {Confirmation}             from '../Screens/Location/Confirmation.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  HeaderBar2                 from '../ScreenComponents/HeaderBar2/HeaderBar2.js';
import Drawer                     from 'react-native-drawer';
import {AboutUs}                  from '../Screens/AboutUs/AboutUs.js';
import {ContactUs}                from '../Screens/ContactUs/ContactUs.js';
import {TermsAndConditions}       from '../Screens/TermsAndConditions/TermsAndConditions.js';
import {PrivacyPolicy}            from '../Screens/PrivacyPolicy/PrivacyPolicy.js';
import {OrdersView}               from '../Screens/ListofOrders/OrdersView.js';
import {NewOrders}                from '../Screens/ListofOrders/NewOrders.js';
import {AcceptedOrders}           from '../Screens/ListofOrders/AcceptedOrders.js';
import {RunningOrders}            from '../Screens/ListofOrders/RunningOrders.js';
import {CompletedOrders}          from '../Screens/ListofOrders/CompletedOrders.js';
import {MonthlyOrders}            from '../Screens/MonthlyOrders/MonthlyOrders.js';
import {RejectedOrder}            from '../Screens/RejectedOrder/RejectedOrder.js';


const Home = createStackNavigator();
const TransitionScreenOptions = {
  ...TransitionPresets.ModalTransition, // This is where the transition happens
};

const horizontalAnimation = {
  gestureDirection: 'horizontal-inverted',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};


export const HomeStack = () => (
  
  <Home.Navigator 
    initialRouteName ="Dashboard"
    screenOptions={horizontalAnimation}
    
  >
    <Home.Screen name="Dashboard"                   component={Dashboard}  options={getHeaderConfig("",false)}/>
    {/* <Home.Screen name="ConfirmOrderComponent"       component={ConfirmOrderComponent} options={getHeaderConfig("Dashboard")}/> */}
    <Home.Screen name="AddressDefaultComp"          component={AddressDefaultComp} options={getHeaderConfig("Delivery Addresses",true)}/>
    <Home.Screen name="AddressComponent"            component={AddressComponent} options={getHeaderConfig("Add Address",true)}/>
    <Home.Screen name="AddressComponentforaddress"  component={AddressComponentforaddress} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="AddressMenu"                 component={AddressMenu} options={getHeaderConfig("Dashboard")}/>
    <Home.Screen name="AccountDashboard"            component={AccountDashboard} options={getHeaderConfig("Account Dashboard",true)}/>
    <Home.Screen name="ResetPwd"                    component={ResetPwd} options={getHeaderConfig("Reset Password",true)}/>
    <Home.Screen name="AccountInformation"          component={AccountInformation} options={getHeaderConfig("Account Information",true)}/>
    <Home.Screen name="MyAccount"                   component={MyAccount} options={getHeaderConfig("My Account",true)}/>
    <Home.Screen name="SupportSystem"               component={SupportSystem} options={getHeaderConfig("Help & Support",true)}/>
    <Home.Screen name="OrderSummary"                component={OrderSummary} options={getHeaderConfig("Order Summary",true)}/>
    <Home.Screen name="InAppNotification"           component={InAppNotification} options={getHeaderConfig("Notifications",true)}/> 
    <Home.Screen name="AboutUs"                     component={AboutUs} options={getHeaderConfig("About Us",true)}/>
    <Home.Screen name="ContactUs"                   component={ContactUs} options={getHeaderConfig("Contact Us",true)}/>
    <Home.Screen name="TermsConditions"             component={TermsAndConditions} options={getHeaderConfig("Terms & Conditions",true)}/>
    <Home.Screen name="PrivacyPolicy"               component={PrivacyPolicy} options={getHeaderConfig("Privacy Policy",true)}/>
    <Home.Screen name="OrdersView"                  component={OrdersView} options={getHeaderConfig("OrdersList",true)}/>
    <Home.Screen name="NewOrders"                   component={NewOrders} options={getHeaderConfig("New Orders",true)}/>
    <Home.Screen name="AcceptedOrders"              component={AcceptedOrders} options={getHeaderConfig("Accepted Orders",true)}/>
    <Home.Screen name="RunningOrders"               component={RunningOrders} options={getHeaderConfig("Running Orders",true)}/>
    <Home.Screen name="CompletedOrders"             component={CompletedOrders} options={getHeaderConfig("Completed Orders",true)}/>
    <Home.Screen name="MonthlyOrders"               component={MonthlyOrders} options={getHeaderConfig("Monthly Orders",true)}/>
    <Home.Screen name="RejectedOrder"               component={RejectedOrder} options={getHeaderConfig("Rejected Order",true)}/>
  </Home.Navigator>
);


const Tab1 = createDrawerNavigator();
export const Tab2 = () => (
  <Tab1.Navigator 
    drawerContent   = { (props) =>  <Drawer><Menu { ...props } /></Drawer>}
    screenOptions={{swipeEnabled: false}} 
  >
     <Tab.Screen name="App" component={HomeStack} navigationOptions = {{gesturesEnabled: false}} />
  </Tab1.Navigator>
);


const getHeaderConfig = (title,backBtn) => {
  return {
    headerShown: true,
    headerTitle: title,
    headerTitleAlign: "left",
    header: (props) => <HeaderBar2 headerTitle={title} backBtn={backBtn} />,
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
      <App.Screen name="App"              component={Tab2} />
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