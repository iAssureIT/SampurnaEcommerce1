import React, 
      { useEffect,useState }  from "react";
import axios                  from 'axios';
import codePush               from 'react-native-code-push';
import {Provider, connect,useDispatch,useSelector}    from 'react-redux';
import {Provider as ProviderPaper, 
      }               from 'react-native-paper';
import store                  from './src/redux/store';
import {setToast}             from './src/redux/AppState';
import { LogBox,StatusBar }   from 'react-native';
import {AuthLoadingScreen}    from "./src/ScreenComponents/AuthLoadingScreen/AuthLoadingScreen.js";
// import SplashScreen           from 'react-native-splash-screen';
import {localNotificationService} from './src/LocalNotificationService';
import {fcmService} from './src/FCMService';
import {REACT_APP_BASE_URL} from '@env'
import GeneralStatusBarColor from './GeneralStatusBarColor.js';
import { NetWorkError } from './NetWorkError';
import { Alert,Text,TextInput,View } from "react-native";
import crashlytics from '@react-native-firebase/crashlytics';
import { enableScreens } from 'react-native-screens';
import { Platform } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { NetworkProvider } from './NetworkProvider';
import { ExampleComponent } from './ExampleComponent';
import Snackbar from 'react-native-snackbar';
import SplashScreen from "react-native-lottie-splash-screen";
import NetInfo from '@react-native-community/netinfo';

console.log("REACT_APP_BASE_URL",REACT_APP_BASE_URL);
axios.defaults.baseURL = REACT_APP_BASE_URL;
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

 const App = (props) => {
    console.log("props",props);
    const [token, setToken] = useState('');
    const [toast, setAppToast] = React.useState(null);
    const dispatch              = useDispatch();

  
  
  

  useEffect(() => {
    // enableScreens(false);
    LogBox.ignoreAllLogs();
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    const unSubscribe = store.subscribe(() => {
      setAppToast(store.getState()?.appStateReducer?.toastState);
      setToken(store.getState()?.userReducer?.token || '');
    });
    function onOpenNotification(notify) {
      console.log("[App] onOpenNotification: ", notify)
      alert("Open Notification: " + notify.body)
    }

    function onRegister(token) {
      console.log("[App] onRegister: ", token)
      // AsyncStorage.setItem('notification_token', token);
    }

    function onNotification(notify) {
      console.log("[App] onNotification: ", notify)
      const options = {
        soundName: 'default',
        playSound: true //,
        // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
      }
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      )
    }
    return () => {
      console.log("[App] unRegister")
      unSubscribe();
      fcmService.unRegister();
      localNotificationService.unregister();
    }
  }, []);

  return( 
    <Provider store={store} >
      
      <GeneralStatusBarColor backgroundColor="#222222"
      barStyle="light-content" />
       <NetworkProvider>
       <ExampleComponent/>
        <AuthLoadingScreen />
        <ToastProvider toast={toast} />
       </NetworkProvider>
    </Provider>  
  );
}




const ToastProviderComponent = props => {
  // const handleConnectivityChange = (state) => {
  //   console.log("state",state);
  //   if (!!state.isInternetReachable) {
  //     setTimeout(() => { Snackbar.show({
  //       text: "Waiting for network...",
  //       duration: Snackbar.LENGTH_INDEFINITE,
  //       fontFamily: 'Montserrat-Regular',
  //       action: {
  //         text: 'CANCEL',
  //         textColor: 'white',
  //         onPress: () => { /* Do something. */ },
  //       },
  //     });}, 1000)
  //   }else{
  //     Snackbar.dismiss();
  //   }
  // }

  useEffect(() => {
    // NetInfo.addEventListener(handleConnectivityChange);

    if (!!props.toast) {
      setTimeout(() => { Snackbar.show({
        text: props.toast.text,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: props.toast?.color,
        fontFamily: 'Montserrat-Regular',
      });}, 1000)

    }
  }, [props]);
  return <View id="RootApp" />;
};

 const ToastProvider = connect(
  null,
  dispatch => ({
    setToast: payload => dispatch(setToast(payload)),
  }),
)(ToastProviderComponent);

const codePushOptions = {
 checkFrequency: codePush.CheckFrequency.ON_APP_START 
};

export default codePush(codePushOptions)(App);
// export default App;