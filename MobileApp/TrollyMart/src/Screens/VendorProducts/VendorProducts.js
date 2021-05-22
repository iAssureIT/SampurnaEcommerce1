import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList, Alert,SafeAreaView,RefreshControl
} from 'react-native';
import Modal                  from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown-v2';
// import DropDownPicker from 'react-native-dropdown-picker';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/vendorListStyles.js';
import { Icon, Button, Card }   from "react-native-elements";
import axios                    from 'axios';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import { connect,
        useDispatch,
        useSelector }           from 'react-redux';
import { useNavigation }        from '@react-navigation/native';
import { ActivityIndicator }    from 'react-native-paper';
import { useIsFocused }         from "@react-navigation/native";
import {HeaderBar3}             from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {MenuCarouselSection}    from '../../ScreenComponents/Section/MenuCarouselSection.js';
import { ScrollView }           from 'react-native';
import {Footer}                 from '../../ScreenComponents/Footer/Footer1.js';

export const VendorProducts = withCustomerToaster((props)=>{
    console.log("props",props);
    const [loading,setLoading] =useState(false);
    const [value,setValue] =useState('lowestprice');
    const section = props.route.params?.section;
    const section_id = props.route.params?.section_id;
    const [vendorList,setVendorList] =useState([]);
    const {route,navigation}=props;
    const store = useSelector(store => ({
        location        : store.location,
      }));
      const {vendor_id}=route.params;
      console.log("vendor_id",vendor_id);
    // const {location} =store.location ;
    console.log("store",store.location); 
    useEffect(() => {
        getData();
    },[props]);

    const getData = ()=>{
        setLoading(true);
       var formValues =  {
        "startRange" : 0,
        "limitRange" : 10,
        "section_ID" : section_id,
        "userLatitude"   : store.location?.coords?.latitude,
        "userLongitude"  : store.location?.coords?.longitude
    }
    console.log("formValues",formValues);
        // axios.post('/api/vendorlist/post/vendor/list',formValues)
        // .then(res=>{
        //     console.log("getData res",res);
        //     setLoading(false);
        //     setVendorList(res.data)
        // })
        // .catch(err=>{
        //     setLoading(false);
        //     console.log("err",err)
        // })
    }


    return (
        <React.Fragment>
            <HeaderBar3
                goBack={navigation.goBack}
                navigate={navigation.navigate}
                headerTitle={"Vendor Products"}
                toggle={() => toggle()}
                openControlPanel={() => openControlPanel()}
            />
            <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled" >
                <View  style={[styles.formWrapper,{paddingHorizontal:15,paddingVertical:5, marginBottom:'18%'}]}> 
                    <MenuCarouselSection
                        navigation  = {navigation} 
                        type        = {value}
                        showImage   = {true}
                        selected    = {section}
                        // section     = {section}
                    />
                    <View style={styles.proddets}>
                    </View>
                </View>     
            </ScrollView>
            <Footer/>
        </React.Fragment>
    );
})