import React, { Component }   from "react";
import {View,Text}            from "react-native";
import  HomeStack             from "./src/config/routes.js";
import  AuthStack             from "./src/config/routes.js";
import { createAppContainer } from "react-navigation";
import axios                  from 'axios';
import codePush               from 'react-native-code-push';

const HomeStackContainer = createAppContainer(HomeStack);
const AuthStackContainer = createAppContainer(AuthStack);
// console.log("Config.API_KEY==>" ,Config.API_URL);
// axios.defaults.baseURL = 'http://localhost:3066/';
// axios.defaults.baseURL = 'http://qaunimandaiapi.iassureit.com/';
// axios.defaults.baseURL = 'http://uatapi.unimandai.com/';
axios.defaults.baseURL = 'http://qaapi-bookstore.iassureit.in/';
axios.defaults.baseURL = 'https://qaapi-sampurna-marketplace.iassureit.in/';
// axios.defaults.baseURL = 'http://localhost:3366/';
console.disableYellowBox = true;
console.log("axios.defaults.baseURL===>",axios.defaults.baseURL);
class App extends Component {
  constructor(props) {
    super(props);
      this.state={
        user_id :"",
        token   :""
    }
  }
  render() {
    return( 
        <HomeStackContainer />
      );
  }
}
const codePushOptions = {
 checkFrequency: codePush.CheckFrequency.ON_APP_START 
};
export default codePush(codePushOptions)(App);
// export default App;