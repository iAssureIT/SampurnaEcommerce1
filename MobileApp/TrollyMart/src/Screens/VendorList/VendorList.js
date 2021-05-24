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
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
export const VendorList = withCustomerToaster((props)=>{
    const [loading,setLoading] =useState(false);
    const [value,setValue] =useState('lowestprice');
    const section = props.route.params?.section;
    const sectionUrl = props.route.params?.sectionUrl;
    const [vendorList,setVendorList] =useState([]);
    const dispatch 		= useDispatch();
    const store = useSelector(store => ({
        location        : store.location,
        userDetails     : store.userDetails
      }));
    // const {location} =store.location ;
    const {navigation} =props;
    useEffect(() => {
        getData();
    },[props]);

    const getData = ()=>{
        setLoading(true);
       var formValues =  {
        "startRange" : 0,
        "limitRange" : 10,
        "sectionUrl" : sectionUrl,
        "userLatitude"   : store.location?.coords?.latitude,
        "userLongitude"  : store.location?.coords?.longitude
    }
    console.log("formValues",formValues);
        axios.post('/api/vendorlist/post/vendor/list',formValues)
        .then(res=>{
            console.log("getData res",res);
            setLoading(false);
            setVendorList(res.data)
        })
        .catch(err=>{
            setLoading(false);
            console.log("err",err)
        })
    }

    const goToProductList=(vendor)=>{
        var payload ={
            "vendorID"          : vendor.vendor_ID,
            "sectionUrl"        : sectionUrl,
            "startRange"        : 0,
            "limitRange"        : 20
          } 
        dispatch(getCategoryWiseList(payload));
        navigation.navigate('VendorProducts',{vendor:vendor,sectionUrl:sectionUrl,section:section});
    }

    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity onPress={()=>goToProductList(item)}>
                <Card containerStyle={{flex:1,padding:0,marginHorizontal:0}} >
                    <Card.Image source={require("../../AppDesigns/currentApp/images/sm4.jpeg")} style={{backgroundColor: 'rgba(0,0,0,0.5)',flexDirection:"row"}}>
                        <View style={{flex:1}}>
                            <Card.Title style={[CommonStyles.headerText,{color:"#fff",opacity:1,alignSelf:"flex-start",paddingHorizontal:5}]}>{item.vendorName}</Card.Title>
                            {/* <Card.Title style={[CommonStyles.headerText,{color:"#fff",opacity:1,alignSelf:"flex-start",paddingHorizontal:5}]}>{item.vendorAddress}</Card.Title> */}
                            {item.vendorLogo ? <Card.Image source={{uri:item.vendorLogo}} style={{height:80,width:80,marginHorizontal:5}}></Card.Image> :null}
                            
                        </View>
                        <View style={{flex:0.5}}>
                            <Card.Title style={[{color:"#fff",opacity:1,alignSelf:"flex-end",paddingHorizontal:5}]}>{item.vendorDistance} Km</Card.Title>
                        </View>    
                    </Card.Image>    
                </Card>
            </TouchableOpacity>        
        )
    }


    return (
        <React.Fragment>
            <HeaderBar3
                goBack={navigation.goBack}
                navigate={navigation.navigate}
                headerTitle={"Vendor List"}
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
                        boxHeight   = {60}
                    />
                    <View style={styles.proddets}>
                    {loading ?
                        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                            <ActivityIndicator/>
                        </View>
                        :
                        vendorList &&
                        <FlatList
                            data                          = {vendorList}
                            showsVerticalScrollIndicator  = {false}
                            renderItem                    = {_renderlist} 
                            nestedScrollEnabled           = {true}
                            // numColumns                    = {2}
                            //   keyExtractor                  = {item => item._id.toString()}
                            // nestedScrollEnabled
                            initialNumToRender            = {6}
                            ListFooterComponent           = {()=>loading && <ActivityIndicator color={colors.theme}/>}
                            onEndReachedThreshold         = {0.5}
                            // onEndReached={({ distanceFromEnd }) => {
                            //     if(distanceFromEnd >= 0 && limit > 6) {
                            //     onEnd();
                            //         //Call pagination function
                            //     }
                            // }}
                            // onEndReached                  = {()=>{limit > 6 && onEnd()}}
                            // onScroll                      = {()=>{limit > 6 && onEnd()}}       
                            // refreshControl={
                            //     <RefreshControl
                            //       refreshing={refresh}
                            //       onRefresh={() => refreshControl()}
                            //     />
                            // } 
                        /> 
                }
                    {/* <View style={{height:100,backgroundColor:"#ff0",flex:.5}}>
                        </View>*/}
                    </View>
                </View>     
            </ScrollView>
            <Footer/>
        </React.Fragment>
    );
})