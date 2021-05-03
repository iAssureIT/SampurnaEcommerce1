import React, { useEffect,useState }   from "react";
import {View,Text}            from "react-native";
import  HomeStack             from "./src/config/routes.js";
import  AuthStack             from "./src/config/routes.js";
import { createAppContainer } from "react-navigation";
import axios                  from 'axios';
import codePush               from 'react-native-code-push';
import {Provider, connect}                    from 'react-redux';
import {Provider as ProviderPaper, Snackbar}  from 'react-native-paper';
import store                                  from './src/redux/store';
import {setToast}                             from './src/redux/AppState';
import { request,check,PERMISSIONS,RESULTS }  from 'react-native-permissions';
const HomeStackContainer = createAppContainer(HomeStack);
const AuthStackContainer = createAppContainer(AuthStack);
// axios.defaults.baseURL = 'http://qaapi-bookstore.iassureit.in/';
axios.defaults.baseURL = 'https://qaapi-sampurna-marketplace.iassureit.in/';
// axios.defaults.baseURL = 'http://localhost:3366/';
// console.disableYellowBox = true;
console.log("axios.defaults.baseURL===>",axios.defaults.baseURL);
console.log("store",store);

 const App = () => {
  const [token, setToken] = useState('');
  const [toast, setAppToast] = React.useState(null);

  useEffect(() => {
    const unSubscribe = store.subscribe(() => {
      setToken(store.getState()?.userReducer?.token || '');
      setAppToast(store.getState()?.appStateReducer?.toastState);
       request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)');
              break;
  
            case RESULTS.DENIED:
              console.log('The permission has not been requested / is denied but requestable');
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              console.log('The permission is denied and not requestable anymore');
              break;
            }
          })
          .catch(error => {
            console.log("error=>",error);
          });
        });
    return () => {
      unSubscribe();
    };
  }, []);
    return( 
        <Provider store={store}>
          <HomeStackContainer />
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
      onDismiss={() => props.setToast(null)}>
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