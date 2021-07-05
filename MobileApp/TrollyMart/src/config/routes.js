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
// import ConfirmOrderComponent      from '../Screens/ConfirmOrderComponent/ConfirmOrderComponent.js';
import {AddressDefaultComp}       from '../Screens/AddressComponent/AddressDefaultComp.js';
import AddressComponent         from '../Screens/AddressComponent/AddressComponent.js';
import AddressComponentforaddress from '../Screens/AddressComponent/AddressComponentforaddressmenu.js';
import AddressMenu                from'../Screens/AddressComponent/AddressMenu.js';
import {WishlistComponent}        from'../Screens/WishlistComponent/WishlistComponent.js';
import {MyOrder}                  from '../Screens/MyOrders/MyOrder.js';
import {SupportSystem}            from '../Screens/Help&Support/SupportSystem.js';
import Stores                     from '../Screens/Stores/Stores.js';
import StoreDetails               from '../Screens/Stores/StoreDetails.js';
import {AllProductList}           from '../Screens/AllProductList/AllProductList.js';
import {SearchList}               from '../Screens/SearchList/SearchList.js';
import {OrderDetails}             from '../Screens/MyOrders/OrderDetails.js';
import {AccountDashboard}         from '../Screens/AccountDashboard/AccountDashboard.js';
import {MyAccount}                from '../Screens/MyAccount/MyAccount.js';
import {AccountInformation}       from'../Screens/AccountDashboard/AccountInformation.js';
import {ResetPwd}                   from'../Screens/AccountDashboard/ResetPwd.js';
import MyProductReview            from'../Screens/MyProductReview/MyProductReview.js';
import {OrderSummary}             from'../Screens/OrderSummary/OrderSummary.js';
import {PaymentMethod}            from '../Screens/PaymentMethod/PaymentMethod.js';
import {Location}                 from '../Screens/Location/Location.js';
import {Confirmation}             from '../Screens/Location/Confirmation.js';
import {VendorList}               from '../Screens/VendorList/VendorList.js';
import {ProductVendorList}        from '../Screens/VendorList/ProductVendorList.js';
import VendorProducts           from '../Screens/VendorProducts/VendorProducts.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  HeaderBar2                 from '../ScreenComponents/HeaderBar2/HeaderBar2.js';
// import Drawer                     from 'react-native-drawer';
import {AboutUs}                  from '../Screens/AboutUs/AboutUs.js';
import {ContactUs}                from '../Screens/ContactUs/ContactUs.js';
import {FAQ}                      from '../Screens/FAQ/FAQ.js';
import {TermsAndConditions}               from '../Screens/TermsAndConditions/TermsAndConditions.js';
import {PrivacyPolicy}               from '../Screens/PrivacyPolicy/PrivacyPolicy.js';
import {RewardsPoint}               from '../Screens/RewardsPoints/RewardsPoint.js';
import {Footer}                 from '../ScreenComponents/Footer/Footer.js';

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

const getHeaderConfig = (title,backBtn) => {
  return {
    headerShown: true,
    headerTitle: title,
    headerTitleAlign: "left",
    header: (props) => <HeaderBar2  headerTitle={title} backBtn={backBtn} />,
  };
};

const Tab = createBottomTabNavigator();
export const BottomNavScreen = () => (
  <Tab.Navigator 
  initialRouteName ="Dashboard"
  screenOptions={horizontalAnimation}
  tabBar={props => <Footer {...props} />}
  tabBarOptions={{
    style: {
      height: 40,
      margin:0,
      padding:0
   }
  }}
    // drawerContent   = { (props) =>  <Drawer  options={{ swipeEnabled: false }}><Menu { ...props } /></Drawer>}
  >
    <Tab.Screen name="Dashboard"                   component={Dashboard}  options={getHeaderConfig("",false)}/>
    <Tab.Screen name="MyAccount"                   component={MyAccount} options={getHeaderConfig("My Account",true)}/>
    <Tab.Screen name="CartComponent"               component={CartComponent} options={getHeaderConfig("My Cart",true)}/>
    <Tab.Screen name="WishlistComponent"           component={WishlistComponent} options={getHeaderConfig("My Wishlist",true)}/>
    <Tab.Screen name="InAppNotification"           component={InAppNotification} options={getHeaderConfig("Notifications",true)}/> 
    <Tab.Screen name="CategoriesComponent"         component={CategoriesComponent} options={getHeaderConfig("Dashboard",true)}/>
    <Tab.Screen name="SubCategoriesComp"           component={SubCategoriesComp}options={getHeaderConfig("Product List",true)} />
    <Tab.Screen name="AllProductList"              component={AllProductList} options={getHeaderConfig("Product List",true)}/>
    <Tab.Screen name="SearchList"                  component={SearchList} options={getHeaderConfig("Search List",true)}/>
    <Tab.Screen name="SubCatCompView"              component={SubCatCompView} options={getHeaderConfig("Product Details",true)}/>
    {/* <Tab.Screen name="ConfirmOrderComponent"       component={ConfirmOrderComponent} options={getHeaderConfig("Dashboard")}/> */}
    <Tab.Screen name="AddressDefaultComp"          component={AddressDefaultComp} options={getHeaderConfig("Delivery Addresses",true)}/>
    <Tab.Screen name="AddressComponent"            component={AddressComponent} options={getHeaderConfig("Add Address",true)}/>
    <Tab.Screen name="AddressComponentforaddress"  component={AddressComponentforaddress} options={getHeaderConfig("Dashboard")}/>
    <Tab.Screen name="AddressMenu"                 component={AddressMenu} options={getHeaderConfig("Dashboard")}/>
    <Tab.Screen name="MyOrder"                     component={MyOrder} options={getHeaderConfig("My Orders",true)}/>
    <Tab.Screen name="OrderDetails"                component={OrderDetails} options={getHeaderConfig("Orders Details",true)}/>
    <Tab.Screen name="AccountDashboard"            component={AccountDashboard} options={getHeaderConfig("Account Dashboard",true)}/>
    <Tab.Screen name="ResetPwd"                    component={ResetPwd} options={getHeaderConfig("Reset Password",true)}/>
    <Tab.Screen name="AccountInformation"          component={AccountInformation} options={getHeaderConfig("Account Information",true)}/>
    <Tab.Screen name="MyProductReview"             component={MyProductReview} options={getHeaderConfig("Dashboard")}/>
    <Tab.Screen name="SupportSystem"               component={SupportSystem} options={getHeaderConfig("Help & Support",true)}/>
    <Tab.Screen name="OrderSummary"                component={OrderSummary} options={getHeaderConfig("Order Summary",true)}/>
    <Tab.Screen name="PaymentMethod"               component={PaymentMethod} options={getHeaderConfig("Payment Methods",true)}/>
    <Tab.Screen name="Stores"                      component={Stores} options={getHeaderConfig("Dashboard")}/>
    <Tab.Screen name="StoreDetails"                component={StoreDetails} options={getHeaderConfig("Dashboard")}/>
    <Tab.Screen name="VendorList"                  component={VendorList} options={getHeaderConfig("Vendor List",true)}/>
    <Tab.Screen name="ProductVendorList"           component={ProductVendorList} options={getHeaderConfig("Vendor List",true)}/>
    <Tab.Screen name="VendorProducts"              component={VendorProducts} options={getHeaderConfig("Product List",true)}/>
    <Tab.Screen name="AboutUs"                     component={AboutUs} options={getHeaderConfig("About Us",true)}/>
    <Tab.Screen name="ContactUs"                   component={ContactUs} options={getHeaderConfig("Contact Us",true)}/>
    <Tab.Screen name="TermsConditions"             component={TermsAndConditions} options={getHeaderConfig("Terms & Conditions",true)}/>
    <Tab.Screen name="PrivacyPolicy"             component={PrivacyPolicy} options={getHeaderConfig("Privacy Policy",true)}/>
    <Tab.Screen name="RewardsPoint"             component={RewardsPoint} options={getHeaderConfig("My Rewards",true)}/>
    <Tab.Screen name="FAQ"                         component={FAQ} options={getHeaderConfig("Frequently Asked Questions",true)}/>
  </Tab.Navigator>
);

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
  <App.Navigator>
    <App.Screen name="App" component={BottomNavScreen} 
      options={{
        headerShown: true,
        headerTitleAlign: "left",
        header: props => <HeaderBar2  {...props} />,
      }} />
      <App.Screen name="Auth"             component={RegisterStack} options={{headerShown: false}}/>
      <App.Screen name="LocationMain"     component={LocationScreen} options={{headerShown: false}} />
  </App.Navigator>
);

const Auth = createStackNavigator();
const AuthStack = () => (
  <Auth.Navigator >
      <Auth.Screen name="Auth"          component={RegisterStack}  options={{headerShown: false}}/>
      <Auth.Screen name="App"           component={BottomNavScreen} options={{
        headerShown: true,
        headerTitleAlign: "left",
        header: (props) => <HeaderBar2  {...props} />,
      }} />
      <Auth.Screen name="LocationMain"  component={LocationScreen} options={{headerShown: false}}/>
  </Auth.Navigator>
);


const LocationMain = createStackNavigator();
const LocationStack = () => (
      <LocationMain.Navigator >
      <LocationMain.Screen name="LocationMain"  component={LocationScreen}   options={{headerShown: false}}/>
      <LocationMain.Screen name="App"           component={BottomNavScreen} options={{
        headerShown: true,
        headerTitleAlign: "left",
        header: (props) => <HeaderBar2  {...props} />,
      }}/>
      <LocationMain.Screen name="Auth"          component={RegisterStack} options={{headerShown: false}} />
  </LocationMain.Navigator>
);

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