import React,{useState} from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import CodePush from 'react-native-code-push';

export const  NetWorkError =()=>{
  const [loading,setLoading] = useState(false);
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text>Connect to the internet</Text>
        <Text>You are offline. Check Your connection</Text>
        <View style={{marginVertical:15}}>
          <Button
            onPress={()=>{CodePush.restartApp();setLoading(true)}}
            title="TAP TO RETRY"
            loading={loading}
          />
        </View>  
      </View>
    );
}