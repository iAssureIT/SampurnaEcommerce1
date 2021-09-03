import { REACT_APP_BASE_URL } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { LogBox, Text, TextInput, View } from 'react-native';
import codePush from 'react-native-code-push';
import Snackbar from 'react-native-snackbar';
import SplashScreen from 'react-native-splash-screen';
import { connect, Provider, useDispatch } from 'react-redux';
import { ExampleComponent } from './ExampleComponent';
import GeneralStatusBarColor from './GeneralStatusBarColor.js';
import { NetworkProvider } from './NetworkProvider';
import { fcmService } from './src/FCMService';
import { localNotificationService } from './src/LocalNotificationService';
import { setToast } from './src/redux/AppState';
import store from './src/redux/store';
import { AuthLoadingScreen } from "./src/ScreenComponents/AuthLoadingScreen/AuthLoadingScreen.js";
import NetInfo from '@react-native-community/netinfo';

console.log("REACT_APP_BASE_URL", REACT_APP_BASE_URL);
axios.defaults.baseURL = REACT_APP_BASE_URL;
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const App = (props) => {
  console.log("props", props);
  const [token, setToken] = useState('');
  const [toast, setAppToast] = React.useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    // enableScreens(false);
    LogBox.ignoreAllLogs();
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)
    setTimeout(() => {
      console.log("called to hide splash")
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

  return (
    <Provider store={ store } >

      <GeneralStatusBarColor backgroundColor="#222222"
        barStyle="light-content" />
      <NetworkProvider>
        <ExampleComponent />
        <AuthLoadingScreen />
        <ToastProvider toast={ toast } />
      </NetworkProvider>
    </Provider>
  );
}




const ToastProviderComponent = props => {
  useEffect(() => {
    if (!!props.toast) {
      setTimeout(() => {
        Snackbar.show({
          text: props.toast.text,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: props.toast?.color,
          fontFamily: 'Montserrat-Regular',
          numberOfLines:3
        });
      }, 600)

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