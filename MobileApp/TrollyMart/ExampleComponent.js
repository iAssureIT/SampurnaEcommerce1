import React from 'react';
import { View, Text, Platform,ActivityIndicator } from 'react-native';
import { Icon }             from "react-native-elements";
import { NetworkContext } from './NetworkProvider';
import Snackbar from 'react-native-snackbar';
import { colors } from './src/AppDesigns/currentApp/styles/styles';

export class ExampleComponent extends React.PureComponent {
  static contextType = NetworkContext;
  render() {
    return(
      Platform.OS!== "ios" &&!this?.context?.isInternetReachable &&<View style={{justifyContent:"center",backgroundColor:colors.warning,flexDirection:'row'}}>
            <ActivityIndicator size={15} color="#fff"/>
            <Text style={{alignSelf:"center",color:"#fff"}}>Wating for network...</Text>
      </View>
    )  
        
  }
}