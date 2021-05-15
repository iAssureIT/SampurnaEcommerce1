import React,{useState,useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Header, 
        Icon,}                from 'react-native-elements';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HeaderBar3Styles.js';
import {colors}               from '../../AppDesigns/currentApp/styles/styles.js';
import { useNavigation }                from '@react-navigation/native';

export const HeaderBar3 = (props)=>{ 
  const [headerTitle,setHeaderTitle]=useState('');
  const navigation=useNavigation();
  console.log("navigation",navigation);
  useEffect(() => {
    setHeaderTitle(props.headerTitle)
  },[props]);

  return (
    <View style={{ "borderBottomWidth": 1,
      "borderBottomColor": colors.theme,
      "backgroundColor": colors.theme, "elevation":4,
      "boxShadow": "10px 5px 5px black"}}>
        <Header 
          backgroundColor={'transparent'}
          placement="left"
          leftContainerStyle={{backgroundColor:'transparent',paddingHorizontal:15,justifyContent:"center",alignItems:"center"}}
          centerContainerStyle={{backgroundColor:'transparent',paddingLeft:0,paddingRight:0,paddingTop:0,justifyContent:"center",alignItems:"center"}}
          rightContainerStyle={{backgroundColor:'transparent'}}
          leftComponent={
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                <Icon size={30} name='keyboard-arrow-left' type='MaterialIcons' color='#fff' />
              </View>
            </TouchableOpacity>
          }
          centerComponent={ <Text style={[{fontSize:18,color:'#fff',fontFamily:"Montserrat-SemiBold",textAlign:'center',alignSelf:'center'}]}>{headerTitle}</Text>}
          rightComponent={
              <View style={{flexDirection:'row'}}>
                  <TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                      <Icon name="bell-o" type="font-awesome" size={23}  color="#fff" style={styles.bellIcon}/>
                    </View>
                  </TouchableOpacity>
              </View>
          }
          containerStyle={styles.container}
        />
      </View>
    );
  }
