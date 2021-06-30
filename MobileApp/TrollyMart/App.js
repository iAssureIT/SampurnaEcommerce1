import React, 
      { useEffect,useState }  from "react";
import axios                  from 'axios';
import codePush               from 'react-native-code-push';
import {Provider, connect}    from 'react-redux';
import {Provider as ProviderPaper, 
      Snackbar}               from 'react-native-paper';
import store                  from './src/redux/store';
import {setToast}             from './src/redux/AppState';
import { LogBox,StatusBar }   from 'react-native';
import {AuthLoadingScreen}    from "./src/ScreenComponents/AuthLoadingScreen/AuthLoadingScreen.js";
import SplashScreen           from 'react-native-splash-screen';
import {localNotificationService} from './src/LocalNotificationService';
import {fcmService} from './src/FCMService';
import {REACT_APP_BASE_URL} from '@env'
// axios.defaults.baseURL = 'https://devapi.knock-knockeshop.com';
// axios.defaults.baseURL = 'https://192.168.43.213:3366';
console.log("REACT_APP_BASE_URL",REACT_APP_BASE_URL);
axios.defaults.baseURL = REACT_APP_BASE_URL;
// console.log("axios.defaults.baseURL ",axios.defaults.baseURL);
StatusBar.setHidden(true);

 const App = () => {
  const [token, setToken] = useState('');
  const [toast, setAppToast] = React.useState(null);
  useEffect(() => {
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
    <Provider store={store}>
        <AuthLoadingScreen />
        <ToastProvider toast={toast} />
    </Provider>  
  );
}

const ToastProviderComponent = props => {
  return (
    <Snackbar
      visible={!!props.toast}
      style={{backgroundColor: props.toast?.color}}
      duration={1000}
      onDismiss={() => props.setToast(null)}
      >
      {props.toast?.text}
    </Snackbar>
  );
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