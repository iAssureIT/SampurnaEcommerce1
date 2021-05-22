import React, 
      { useEffect,useState }  from "react";
import axios                  from 'axios';
import codePush               from 'react-native-code-push';
import {Provider, connect}    from 'react-redux';
import {Provider as ProviderPaper, 
      Snackbar}               from 'react-native-paper';
import store                  from './src/redux/store';
import {setToast}             from './src/redux/AppState';
import { request,
        check,
        PERMISSIONS,
        RESULTS }             from 'react-native-permissions';
import { LogBox,StatusBar }             from 'react-native';
import {AuthLoadingScreen}    from "./src/ScreenComponents/AuthLoadingScreen/AuthLoadingScreen.js";
import {NavigationContainer}  from "@react-navigation/native";
import SplashScreen           from 'react-native-splash-screen';
// axios.defaults.baseURL = 'http://qaapi-bookstore.iassureit.in/';
// axios.defaults.baseURL = 'https://qaapi-sampurna-marketplace.iassureit.in/';
axios.defaults.baseURL = 'https://devapi.knock-knockeshop.com/';
// axios.defaults.baseURL = 'https://qaapi-sampurna-marketplace.iassureit.in';
// axios.defaults.baseURL = 'http://10.39.1.103:3366';
console.log("axios.defaults.baseURL ",axios.defaults.baseURL);
 const App = (props) => {
  const [token, setToken] = useState('');
  const [toast, setAppToast] = React.useState(null);
  console.log("props",props);
  useEffect(() => {
    LogBox.ignoreAllLogs();
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    const unSubscribe = store.subscribe(() => {
      StatusBar.setHidden(true);
      setAppToast(store.getState()?.appStateReducer?.toastState);
      setToken(store.getState()?.userReducer?.token || '');
    });
    return () => {
      unSubscribe();
    };
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
      // position= {'top'}
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