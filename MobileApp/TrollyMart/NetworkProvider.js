import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({ isConnected: true });

export class NetworkProvider extends React.PureComponent {
  state = {
    isConnected: true,
    isInternetReachable:true
  };

  componentDidMount() {
    NetInfo?.addEventListener(this.handleConnectivityChange);
  }

  // componentWillUnmount() {
  //   NetInfo?.removeEventListener(this.handleConnectivityChange);
  // }

  handleConnectivityChange = state => {
    console.log("state",state);
    if(state.isInternetReachable){
      this.setState({isInternetReachable:state.isInternetReachable})
    }
    if(state.isConnected) {
      this.setState({connection_Status: 'Online'});
    } else {
      this.setState({connection_Status: 'Offline'});
    }
  };

  render() {
    return (
      <NetworkContext.Provider value={this.state}>
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}