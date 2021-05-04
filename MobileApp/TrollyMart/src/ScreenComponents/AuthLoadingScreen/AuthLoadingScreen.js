import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class AuthLoadingScreen extends React.Component {
constructor(props) {
super(props);
this._bootstrapAsync();
}

// Fetch the token from storage then navigate to our appropriate place
_bootstrapAsync = async () => {

var token ;
var user_id ;
const userToken = await AsyncStorage.getItem('token');
if(userToken){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ userToken;
}
this.props.navigation.navigate(userToken ? 'App' : 'Auth');
};

// Render any loading content that you like here
/*render() {
return (
<View>
<ActivityIndicator />
<StatusBar barStyle="default" />
</View>
);
}*/
render() {
return (
<View>
<ActivityIndicator />
<StatusBar barStyle="default" />
</View>
);
}

}