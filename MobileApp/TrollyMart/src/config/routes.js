import React, { useEffect }       from 'react';
import {NavigationContainer}      from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators,TransitionPresets }   from '@react-navigation/stack';
import { createDrawerNavigator }  from '@react-navigation/drawer';
// import { createAppContainer }     from 'react-navigation';
import {InAppNotification}          from '../ScreenComponents/InAppNotification/InAppNotification.js';

/*----SystemSecurity -----*/
import {LogIn}                    from '../Screens/SystemSecurity/RootLogIn/LogIn.js';
import {ForgotPassword}           from '../Screens/SystemSecurity/ForgotPassword/ForgotPassword.js';
import {ResetPassword}            from '../Screens/SystemSecurity/ResetPassword/ResetPassword.js';
import {RootSignUp}               from '../Screens/SystemSecurity/Signup/RootSignUp.js';
import {OTPVerification}          from '../Screens/SystemSecurity/OTPVerification/OTPVerification.js';
import {ForgotPasswordOTP}        from '../Screens/SystemSecurity/ForgotPasswordOTP/ForgotPasswordOTP.js';
import Dashboard                  from '../Screens/Dashboard/Dashboard.js';
import {SubCatCompView}           from'../Screens/CategoriesComponent/SubCatCompView.js';
import {CartComponent}            from '../Screens/CartComponent/CartComponent.js';
// import ConfirmOrderComponent      from '../Screens/ConfirmOrderComponent/ConfirmOrderComponent.js';
import {AddressDefaultComp}       from '../Screens/AddressComponent/AddressDefaultComp.js';
import AddressComponent         from '../Screens/AddressComponent/AddressComponent.js';
import AddressMenu                from'../Screens/AddressComponent/AddressMenu.js';
import {WishlistComponent}        from'../Screens/WishlistComponent/WishlistComponent.js';
import {MyOrder}                  from '../Screens/MyOrders/MyOrder.js';
import {SupportSystem}            from '../Screens/Help&Support/SupportSystem.js';
import {AllProductList}           from '../Screens/AllProductList/AllProductList.js';
import {SearchList}               from '../Screens/SearchList/SearchList.js';
import {OrderDetails}             from '../Screens/MyOrders/OrderDetails.js';
import {AccountDashboard}         from '../Screens/AccountDashboard/AccountDashboard.js';
import {MyAccount}                from '../Screens/MyAccount/MyAccount.js';
import {AccountInformation}       from'../Screens/AccountDashboard/AccountInformation.js';
import {ResetPwd}                   from'../Screens/AccountDashboard/ResetPwd.js';
import {OrderSummary}             from'../Screens/OrderSummary/OrderSummary.js';
import {PaymentMethod}            from '../Screens/PaymentMethod/PaymentMethod.js';
import {PaymentConfirmation}      from '../Screens/PaymentMethod/PaymentConfirmation.js';
import {PaymentFailed}            from '../Screens/PaymentMethod/PaymentFailed.js';
import {Location}                 from '../Screens/Location/Location.js';
import {Confirmation}             from '../Screens/Location/Confirmation.js';
import {VendorList}               from '../Screens/VendorList/VendorList.js';
import {ProductVendorList}        from '../Screens/VendorList/ProductVendorList.js';
import VendorProducts           from '../Screens/VendorProducts/VendorProducts.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  HeaderBar2                 from '../ScreenComponents/HeaderBar2/HeaderBar2.js';
// import Drawer                     from 'react-native-drawer';
import {AboutUs}                  from '../Screens/AboutUs/AboutUs.js';
import {FAQ}                      from '../Screens/FAQ/FAQ.js';
import {TermsAndConditions}               from '../Screens/TermsAndConditions/TermsAndConditions.js';
import {PrivacyPolicy}               from '../Screens/PrivacyPolicy/PrivacyPolicy.js';
import {RewardsPoint}               from '../Screens/RewardsPoints/RewardsPoint.js';
import {Footer}                 from '../ScreenComponents/Footer/Footer.js';

const horizontalAnimation = {
  gestureDirection: 'horizontal',
  // cardStyleInterpolator:
  // CardStyleInterpolators.forHorizontalIOS
  cardStyleInterpolator: ({ current, layouts }) => {
    console.log("layouts",layouts);
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

const getHeaderConfig = (title,backBtn) => {
  return {
    headerShown: true,
    headerTitle: title,
    headerTitleAlign: "left",
    header: (props) => <HeaderBar2  headerTitle={title} backBtn={backBtn} />,
  };
};

const App = createStackNavigator();
export const BottomNavScreen = () => (
  <App.Navigator 
  initialRouteName ="Dashboard"
  screenOptions={horizontalAnimation}
  // tabBar={props => <Footer {...props} />}
  // tabBarOptions={{
  //   style: {
  //     height: 0,
  //     margin:0,
  //     padding:0
  //  }
  // }}
    // drawerContent   = { (props) =>  <Drawer  options={{ swipeEnabled: false }}><Menu { ...props } /></Drawer>}
  >
    <App.Screen name="Dashboard"                   component={Dashboard}  options={getHeaderConfig("",false)}/>
    <App.Screen name="MyAccount"                   component={MyAccount} options={getHeaderConfig("My Account",true)}/>
    <App.Screen name="CartComponent"               component={CartComponent} options={getHeaderConfig("My Cart",true)}/>
    <App.Screen name="WishlistComponent"           component={WishlistComponent} options={getHeaderConfig("My Wishlist",true)}/>
    <App.Screen name="InAppNotification"           component={InAppNotification} options={getHeaderConfig("Notifications",true)}/> 
    <App.Screen name="AllProductList"              component={AllProductList} options={getHeaderConfig("Product List",true)}/>
    <App.Screen name="SearchList"                  component={SearchList} options={getHeaderConfig("Search List",true)}/>
    <App.Screen name="SubCatCompView"              component={SubCatCompView} options={getHeaderConfig("Product Details",true)}/>
    {/* <App.Screen name="ConfirmOrderComponent"       component={ConfirmOrderComponent} options={getHeaderConfig("Dashboard")}/> */}
    <App.Screen name="AddressDefaultComp"          component={AddressDefaultComp} options={getHeaderConfig("Delivery Addresses",true)}/>
    <App.Screen name="AddressComponent"            component={AddressComponent} options={getHeaderConfig("Add Address",true)}/>
    <App.Screen name="AddressMenu"                 component={AddressMenu} options={getHeaderConfig("Dashboard")}/>
    <App.Screen name="MyOrder"                     component={MyOrder} options={getHeaderConfig("My Orders",true)}/>
    <App.Screen name="OrderDetails"                component={OrderDetails} options={getHeaderConfig("Orders Details",true)}/>
    <App.Screen name="AccountDashboard"            component={AccountDashboard} options={getHeaderConfig("Account Dashboard",true)}/>
    <App.Screen name="ResetPwd"                    component={ResetPwd} options={getHeaderConfig("Reset Password",true)}/>
    <App.Screen name="AccountInformation"          component={AccountInformation} options={getHeaderConfig("Account Information",true)}/>
    <App.Screen name="SupportSystem"               component={SupportSystem} options={getHeaderConfig("Help & Support",true)}/>
    <App.Screen name="OrderSummary"                component={OrderSummary} options={getHeaderConfig("Order Summary",true)}/>
    <App.Screen name="PaymentMethod"               component={PaymentMethod} options={getHeaderConfig("Payment Methods",true)}/>
    <App.Screen name="PaymentConfirmation"         component={PaymentConfirmation} options={getHeaderConfig("Payment Confirmation",false)}/>
    <App.Screen name="PaymentFailed"              component={PaymentFailed} options={getHeaderConfig("Payment Failed",true)}/>
    <App.Screen name="VendorList"                  component={VendorList} options={getHeaderConfig("Vendor List",true)}/>
    <App.Screen name="ProductVendorList"           component={ProductVendorList} options={getHeaderConfig("Vendor List",true)}/>
    <App.Screen name="VendorProducts"              component={VendorProducts} options={getHeaderConfig("Product List",true)}/>
    <App.Screen name="AboutUs"                     component={AboutUs} options={getHeaderConfig("About Us",true)}/>
    <App.Screen name="TermsConditions"             component={TermsAndConditions} options={getHeaderConfig("Terms & Conditions",true)}/>
    <App.Screen name="PrivacyPolicy"             component={PrivacyPolicy} options={getHeaderConfig("Privacy Policy",true)}/>
    <App.Screen name="RewardsPoint"             component={RewardsPoint} options={getHeaderConfig("My Rewards",true)}/>
    <App.Screen name="FAQ"                         component={FAQ} options={getHeaderConfig("Frequently Asked Questions",true)}/>
  </App.Navigator>
);

const RegisterRoutes = createStackNavigator();
export const RegisterStack = () => (
  <RegisterRoutes.Navigator headerMode="none"  initialRouteName="LogIn" screenOptions={horizontalAnimation}>
    <RegisterRoutes.Screen name={"LogIn"}             component={LogIn} />
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
  <LocationRoutes.Navigator headerMode="none" screenOptions={horizontalAnimation}>
      <LocationRoutes.Screen name="Confirmation"  component={Confirmation} />
      <LocationRoutes.Screen name="Location"      component={Location} />
      <LocationRoutes.Screen name="AddressDefaultComp" component={AddressDefaultComp} />
  </LocationRoutes.Navigator>     
);



const Tab1 = createBottomTabNavigator();
export const Tab2 = () => (
  <Tab1.Navigator 
  initialRouteName ="Dashboard"
  screenOptions={horizontalAnimation}
  tabBar={props => <Footer {...props} />}
  tabBarOptions={{
    style: {
      height: 0,
      margin:0,
      padding:0
   }
  }}
  >
     <Tab.Screen name="App" component={BottomNavScreen}  />
  </Tab1.Navigator>
);


const Tab = createStackNavigator();
const AppStack = () => (
  <Tab.Navigator >
    <Tab.Screen name="App" component={Tab2} 
      options={{
        headerShown: false,
      }} />
      <Tab.Screen name="Auth"             component={RegisterStack} options={{headerShown: false}}/>
      <Tab.Screen name="LocationMain"     component={LocationScreen} options={{headerShown: false}} />
      <Tab.Screen name="ProductVendorList"           component={ProductVendorList} options={getHeaderConfig("Vendor List",true)}/>
  </Tab.Navigator>
);

const Auth = createStackNavigator();
const AuthStack = () => (
  <Auth.Navigator >
      <Auth.Screen name="Auth"          component={RegisterStack}  options={{headerShown: false}}/>
      <Tab.Screen name="App" component={Tab2} 
      options={{
        headerShown: false,
      }} />
      <Auth.Screen name="LocationMain"  component={LocationScreen} options={{headerShown: false}}/>
  </Auth.Navigator>
);


const LocationMain = createStackNavigator();
const LocationStack = () => (
      <LocationMain.Navigator >
      <LocationMain.Screen name="LocationMain"  component={LocationScreen}   options={{headerShown: false}}/>
      <Tab.Screen name="App" component={Tab2} 
      options={{
        headerShown: false,
      }} />
      <LocationMain.Screen name="Auth"          component={RegisterStack} options={{headerShown: false}} />
  </LocationMain.Navigator>
);

export const AppContainer = (props) => {
  return (
    <NavigationContainer>
        <AppStack />
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