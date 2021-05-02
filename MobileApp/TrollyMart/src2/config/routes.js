import { createSwitchNavigator }  from 'react-navigation';
import { createDrawerNavigator }  from 'react-navigation-drawer';
import { createStackNavigator }   from 'react-navigation-stack';
import { createAppContainer }     from 'react-navigation';
import { Animated, Easing } from 'react-native';
import axios                      from 'axios';
import AuthLoadingScreen from '../ScreenComponents/AuthLoadingScreen/AuthLoadingScreen.js';
import InAppNotification from '../ScreenComponents/InAppNotification/InAppNotification.js';

import Menu from '../ScreenComponents/Menu/Menu.js';

/*----SystemSecurity -----*/
import {Login}                      from '../Screens/SystemSecurity/Login/Login1.js';
import ForgotPassword             from '../Screens/SystemSecurity/ForgotPassword/ForgotPassword1.js';
import ResetPassword              from '../Screens/SystemSecurity/ResetPassword/ResetPassword1.js';
import Signup                     from '../Screens/SystemSecurity/Signup/Signup1.js';
import OTPVerification            from '../Screens/SystemSecurity/OTPVerification/OTPVerification.js';
import ForgotPasswordOTP          from '../Screens/SystemSecurity/ForgotPasswordOTP/ForgotPasswordOTP1.js';


import Dashboard from '../Screens/Dashboard/Dashboard.js';
import CategoriesComponent from'../Screens/CategoriesComponent/CategoriesComponent.js';
import SubCategoriesComp from'../Screens/CategoriesComponent/SubCategoriesComp.js';
import SubCatCompView from'../Screens/CategoriesComponent/SubCatCompView.js';
import CartComponent from '../Screens/CartComponent/CartComponent.js';
import ConfirmOrderComponent from '../Screens/ConfirmOrderComponent/ConfirmOrderComponent.js';
import AddressDefaultComp from '../Screens/AddressComponent/AddressDefaultComp.js';
import AddressComponent from '../Screens/AddressComponent/AddressComponent.js';
import AddressComponentforaddressmenu from '../Screens/AddressComponent/AddressComponentforaddressmenu.js';
import AddressMenu from'../Screens/AddressComponent/AddressMenu.js';
import WishlistComponent from'../Screens/WishlistComponent/WishlistComponent.js';
import MyOrder from '../Screens/MyOrders/MyOrder.js';
import SupportSystem from '../Screens/Help&Support/SupportSystem.js';
import Stores from '../Screens/Stores/Stores.js';
import StoreDetails from '../Screens/Stores/StoreDetails.js';
import AllFeatureProducts from '../Screens/FeatureProducts/AllFeatureProducts.js';
import AllExclusiveProducts from '../Screens/ExclusiveProducts/AllExclusiveProducts.js';
import AllDiscountedProducts from '../Screens/DiscountedProducts/AllDiscountedProducts.js';
import OrderDetails from '../Screens/MyOrders/OrderDetails.js';
import AccountDashboard from '../Screens/AccountDashboard/AccountDashboard.js';
import AccountInformation from'../Screens/AccountDashboard/AccountInformation.js';
import ResetPwd from'../Screens/AccountDashboard/ResetPwd.js';
import MyProductReview from'../Screens/MyProductReview/MyProductReview.js';
import OrderSummary from'../Screens/OrderSummary/OrderSummary.js';
import PaymentMethod from '../Screens/PaymentMethod/PaymentMethod.js';
// import PGWebView from '../Screens/PaymentMethod/PGWebView.js';
// import searchProducts from '../Screens/Search/searchProducts.js';
// import SearchComponent from '../Screens/Search/SearchComponent.js';

let SlideFromRight = (index, position, width)=>{
  const translateX = position.interpolate({
    inputRange: [index -1,index],
    outputRange: [width, 0],
  })
  return {transform: [{translateX}]}
};

let SlideFromBottom = (index, position, height)=>{
  const translateY = position.interpolate({
    inputRange: [index -1,index],
    outputRange: [height, 0],
  })
  return {transform: [{translateY}]}
};

let SlideFromTop = (index, position, height)=>{
  const translateXY = position.interpolate({
    inputRange: [index-1,index,index+1],
    outputRange: [height,0,0],
  })
  return {transform: [{translateY:translateXY}]}
};

const TransitionConfiguration = () =>{
  return {
    transitionSpec : {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const height = layout.initHeight;
      const { index, route } = scene;
      const params = route.params || {};
      const transition = params.transition || 'default';
      return {
        default : SlideFromRight(index, position, width),
        bottomTransition: SlideFromBottom(index, position, height),
        topTransition: SlideFromTop(index, position, height)
      }[transition];
    },
  }
}

const HomeStack = createStackNavigator({
  
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {
     header: null,
     headerBackTitleVisible:false,
    }
  },
  CategoriesComponent: {
    screen: CategoriesComponent,
    navigationOptions: {
      header: null,
    }
  },
 
  SubCategoriesComp: {
    screen: SubCategoriesComp,
    navigationOptions: {
       header: null,
    }
  },
  AllFeatureProducts: {
    screen: AllFeatureProducts,
    navigationOptions: {
      header: null,
    }
  },
  AllExclusiveProducts: {
    screen: AllExclusiveProducts,
    navigationOptions: {
      header: null,
    }
  },
  AllDiscountedProducts:{
    screen: AllDiscountedProducts,
    navigationOptions: {
      header: null,
    }
  },

  SubCatCompView: {
    screen: SubCatCompView,
    navigationOptions: {
      header: null,
    }
  },
  CartComponent:{
    screen: CartComponent,
    navigationOptions: {
     header: null,
    }
  },
   ConfirmOrderComponent:{
    screen: ConfirmOrderComponent,
    navigationOptions: {
    header: null,
    }
  },
  AddressDefaultComp:{
    screen: AddressDefaultComp,
    navigationOptions: {
     header: null,
    }
  },
  AddressComponent:{
    screen:AddressComponent,
    navigationOptions:{
     header: null,
    }
  },
  AddressComponentforaddressmenu:{
    screen:AddressComponentforaddressmenu,
    navigationOptions:{
     header: null,
    }
  },
  AddressMenu:{
    screen:AddressMenu,
    navigationOptions:{
    header: null,
    }
  },
WishlistComponent:{
   screen:WishlistComponent,
    navigationOptions:{
    header:null
    }
},
MyOrder:{
   screen:MyOrder,
    navigationOptions:{
     header: null,
    }
},
OrderDetails:{
   screen:OrderDetails,
    navigationOptions:{
     header: null,
    }
},
AccountDashboard:{
   screen:AccountDashboard,
    navigationOptions:{
     header: null,
    }
},
ResetPwd:{
   screen:ResetPwd,
    navigationOptions:{
     header: null,
    }
},
AccountInformation:{
   screen:AccountInformation,
    navigationOptions:{
    header: null,
    }
},
MyProductReview:{
   screen:MyProductReview,
    navigationOptions:{
     header: null,
    }
}, 
SupportSystem:{
   screen:SupportSystem,
    navigationOptions:{
     header: null,
    }
}, 
 
OrderSummary:{
   screen:OrderSummary,
    navigationOptions:{
     header: null,
    }
}, 
PaymentMethod:{
   screen:PaymentMethod,
    navigationOptions:{
     header: null,
    }
}, 
Stores:{
  screen:Stores,
   navigationOptions:{
    header: null,
   }
},
StoreDetails:{
  screen:StoreDetails,
   navigationOptions:{
    header: null,
   }
},
InAppNotification: {
  screen: InAppNotification,
  navigationOptions: {
    header: null
  }
},
},{
  transitionConfig: TransitionConfiguration
});

const AuthStack = createStackNavigator({


  Login: {
    screen: Login,
    headerMode : "none",
    navigationOptions: {
      header:null,
    }
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: {
      header:null,
      // headerShown: false
    }
  },

  OTPVerification: {
    screen: OTPVerification,
    navigationOptions: {
      header:null,
      // headerShown: false
    }
  },

  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header:null,
      // headerShown: false
    }
  },
  ForgotPasswordOTP: {
    screen: ForgotPasswordOTP,
    navigationOptions: {
      header:null,
      // headerShown: false
    }
  },
  Signup: {
    screen: Signup,
    navigationOptions: {
      header:null,
      
      // headerShown: false
    }
  },
  OTPVerification: {
    screen: OTPVerification,
    navigationOptions: {
      header:null,
      // headerShown: false
    }
  },

});

// const drawer = createDrawerNavigator({
//   Home : {
//     screen: HomeStack
//   }
// },{
//     drawerLockMode: 'locked-closed',
//     contentComponent: Menu,
//     drawerPosition: 'right'
// });


// export default createAppContainer(createSwitchNavigator(
//   {
//     AuthLoading : AuthLoadingScreen,
//     App         : drawer,
//     Auth        : AuthStack,
//   },
//   {
//     initialRouteName: 'AuthLoading',
//     unmountInactiveRoutes: true,
//   }
// ));


const drawer = createDrawerNavigator({
  Home: {
    screen: HomeStack
  }
},{
    drawerLockMode: 'locked-closed',
    contentComponent: Menu,
    drawerPosition: 'right'
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: drawer,
    Auth: AuthStack,
  },
  {
    unmountInactiveRoutes: true,
    initialRouteName: 'AuthLoading',
  }
));