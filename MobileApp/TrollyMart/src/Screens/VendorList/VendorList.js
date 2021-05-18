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

export const VendorList = withCustomerToaster((props)=>{
    console.log("props",props);
    const [loading,setLoading] =useState(false);
    const [value,setValue] =useState('lowestprice');
    const section = props.route.params?.section;
    const section_id = props.route.params?.section_id;
    const [vendorList,setVendorList] =useState([
        {
            companyName : "Choitaram",
            companyLogo : require("../../AppDesigns/currentApp/images/vendorlogo1.jpeg"),
            image       : require( "../../AppDesigns/currentApp/images/sm2.jpeg"),
            kmRange     : "1 Km"
        },
        {
            companyName : "Almaya",
            companyLogo : require("../../AppDesigns/currentApp/images/vendorlogo2.png"),
            image       : require( "../../AppDesigns/currentApp/images/sm3.jpeg"),
            kmRange     : "1.2 Km"
        },
        {
            companyName : "Al Madina",
            companyLogo : require("../../AppDesigns/currentApp/images/vendorlogo3.png"),
            image       : require( "../../AppDesigns/currentApp/images/sm2.jpeg"),
            kmRange     : "2 Km"
        },
        {
            companyName : "Lulu",
            companyLogo : require("../../AppDesigns/currentApp/images/vendorlogo4.png"),
            image       : require( "../../AppDesigns/currentApp/images/sm3.jpeg"),
            kmRange     : "3.3 Km"
        }
    ]);
    const {navigation} =props;
    useEffect(() => {
        getData();
    },[props]);

    const getData = ()=>{
       var formValues =  {
            "startRange" : 0,
            "limitRange" : 10,
            "section_ID" : section_id,
            "latitude"   : "",
            "longitude"  : ""
        }
        axios.post('/api/entitymaster/post/vendor/list',formValues)
        .then(res=>{
            console.log("getData res",res);
            setVendorList(res.data)
        })
        .catch(err=>{
            console.log("err",err)
        })
    }

    const _renderlist = ({ item, index })=>{
        return (
            <Card containerStyle={{flex:1,padding:0,marginHorizontal:0}}>
                <Card.Image  style={{backgroundColor: 'rgba(0,0,0,0.5)',flexDirection:"row"}}>
                    <View style={{flex:0.5}}>
                        <Card.Title style={[CommonStyles.headerText,{color:"#fff",opacity:1,alignSelf:"flex-start",paddingHorizontal:5}]}>{item.companyName}</Card.Title>
                        <Card.Image source={{uri:item.companyLogo[0]}} style={{height:80,width:80,marginHorizontal:5}}>
                         </Card.Image>    
                    </View>
                    <View style={{flex:0.5}}>
                        <Card.Title style={[{color:"#fff",opacity:1,alignSelf:"flex-end",paddingHorizontal:5}]}>{item.kmRange}</Card.Title>
                    </View>    
                </Card.Image>    
            </Card>    
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
                        showImage   = {false}
                        selected    = {section}
                        // section     = {section}
                    />
                    <View style={styles.proddets}>
                    {vendorList &&
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