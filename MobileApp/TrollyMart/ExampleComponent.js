import React from 'react';
import { View, Text, Platform } from 'react-native';

import { NetworkContext } from './NetworkProvider';

export class ExampleComponent extends React.PureComponent {
  static contextType = NetworkContext;

  render() {
    return (
      Platform.OS!== "ios" &&<View style={{alignItems:"center",backgroundColor:"#f00"}}>
        {this.context.connection_Status === "Offline" && <Text style={{color:"#fff",alignSelf:"center"}}>You are now {this.context.connection_Status}</Text>}
      </View>
    );
  }
}