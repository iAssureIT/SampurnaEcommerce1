import React,{useState,useEffect} from "react";
import {
  Text, View, TouchableOpacity,Image
} from "react-native";
import { Icon, SearchBar }                from 'react-native-elements';
import styles                             from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FooterStyles1.js';
import AsyncStorage                       from '@react-native-async-storage/async-storage';
import axios                              from 'axios';
import { connect,
        useDispatch,
        useSelector }                     from 'react-redux';
import {withCustomerToaster}              from '../../redux/AppState.js';
import { useNavigation }                  from '@react-navigation/native';
import { colors } from "../../AppDesigns/currentApp/styles/styles.js";

export const Footer =(props)=>{
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const store = useSelector(store => ({
    userDetails  : store.userDetails,
  }));
  const {userDetails,cartCount} = store;
  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

    return (
      <View>
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => {
                navigation.push('NewOrders')}
               } >
                <View style={{alignItems:'center'}}>
                 {
                    props.selected && props.selected === "0" ?
                    <Image
                    resizeMode="contain"
                    source={require("../../AppDesigns/currentApp/images/newGreen.png")}
                    style={{height:21,width:21}}
                    />
                    :
                    <Image
                    resizeMode="contain"
                    source={require("../../AppDesigns/currentApp/images/newOrder.png")}
                    style={{height:21,width:21}}
                    />
                 }    
                </View>
                  
                <Text style={[styles.footerTitle,{color:props.selected && props.selected === "0" ? '#0D8919' :"#000"}]}>New Order</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => {
                navigation.push('AcceptedOrders')}
               } >
                  <View style={{alignItems:'center'}}>
                    {
                      props.selected && props.selected === "1" ?
                      <Image
                      resizeMode="contain"
                      source={require("../../AppDesigns/currentApp/images/acceptGreen.png")}
                      style={{height:21,width:21}}
                      />
                      :
                      <Image
                      resizeMode="contain"
                      source={require("../../AppDesigns/currentApp/images/acceptB.png")}
                      style={{height:21,width:21}}
                      />
                    }  
                  </View>              
                <Text style={[styles.footerTitle,{color:props.selected && props.selected === "1" ? '#0D8919' :"#000"}]}>Accepted</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => {
                navigation.push('RunningOrders')}
               } >
                 <View style={{alignItems:'center'}}>
                    {
                      props.selected && props.selected === "2" ?
                      <Image
                      resizeMode="contain"
                      source={require("../../AppDesigns/currentApp/images/delivery-manGreen.png")}
                      style={{height:21,width:21}}
                      />
                      :
                      <Image
                      resizeMode="contain"
                      source={require("../../AppDesigns/currentApp/images/Running.png")}
                      style={{height:21,width:21}}
                      />
                    }
                 </View>
                <Text style={[styles.footerTitle,{color:props.selected && props.selected === "2" ? '#0D8919' :"#000"}]}>On My Way</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => {
                navigation.push('CompletedOrders')}
               } >
                <View style={{alignItems:'center'}}>
                  {
                    props.selected && props.selected === "3" ?
                    <Image
                    resizeMode="contain"
                    source={require("../../AppDesigns/currentApp/images/delivery-boxGreen.png")}
                    style={{height:21,width:21}}
                    />
                    :
                    <Image
                    resizeMode="contain"
                    source={require("../../AppDesigns/currentApp/images/Delivered.png")}
                    style={{height:21,width:21}}
                    />
                  }   
                 </View>    
                <Text style={[styles.footerTitle,{color:props.selected && props.selected === "3" ? '#0D8919' :"#000"}]}>Delivered</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
}