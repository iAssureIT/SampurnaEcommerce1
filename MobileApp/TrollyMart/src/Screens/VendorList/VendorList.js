import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList, Alert,SafeAreaView,RefreshControl
} from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/vendorListStyles.js';
import { Card }   from "react-native-elements";
import axios                    from 'axios';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
import {
        useDispatch,
        useSelector }           from 'react-redux';
import { ActivityIndicator }    from 'react-native-paper';
import {HeaderBar3}             from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {MenuCarouselSection}    from '../../ScreenComponents/Section/MenuCarouselSection.js';
import { ScrollView }           from 'react-native';
import {Footer}                 from '../../ScreenComponents/Footer/Footer1.js';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {STOP_SCROLL}          from '../../redux/productList/types';

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
export const VendorList = withCustomerToaster((props)=>{
    const [loading,setLoading] =useState(true);
    const [value,setValue] =useState('lowestprice');
    const section = props.route.params?.section;
    const sectionUrl = props.route.params?.sectionUrl;
    const index = props.route.params?.index;
    console.log("index",index);
    const [vendorList,setVendorList] =useState([]);
    const dispatch 		= useDispatch();
    const store = useSelector(store => ({
        location        : store.location,
        userDetails     : store.userDetails,
      }));
    // const {location} =store.location ;
    const {navigation} =props;
    useEffect(() => {
        setLoading(true);
        getData();
    },[props]);

    const getData = ()=>{
        dispatch({
            type:STOP_SCROLL,
            payload:false
          })
       var formValues =  {
        "startRange" : 0,
        "limitRange" : 10,
        "sectionUrl" : sectionUrl,
        "latitude"   : store.location?.address?.latlong?.lat,
        "longitude"  : store.location?.address?.latlong?.lng
    }
    console.log("formValues",formValues);
        axios.post('/api/vendorlist/post/vendor/list',formValues)
        .then(res=>{
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
            "vendor_ID"         : vendor.vendor_ID,
            "sectionUrl"        : sectionUrl,
            "startRange"        : 0,
            "limitRange"        : 8,
          } 
        dispatch(getCategoryWiseList(payload));
        
        navigation.navigate('VendorProducts',{vendor:vendor,sectionUrl:sectionUrl,section:section,index:index,vendorLocation_id:vendor.vendorLocation_id});
    }

    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity  style={{elevation:5}} onPress={()=>goToProductList(item)}>
                <Card containerStyle={{flex:1,padding:0,marginHorizontal:0}} >
                    <Card.Image source={require("../../AppDesigns/currentApp/images/sm4.jpeg")} style={{backgroundColor: 'rgba(0,0,0,0.5)',height:100}}>
                        <View style={{flex:1,flexDirection:"row"}}>
                            {/* <Card.Title style={[CommonStyles.headerText,{color:"#fff",opacity:1,alignSelf:"flex-start",paddingHorizontal:5}]}>{item.vendorAddress}</Card.Title> */}
                            <View style={{flex:0.3,justifyContent:'center'}}>
                                <View style={{justifyContent:"center",alignItems:"center",backgroundColor:"#fff",borderRadius:100,marginHorizontal:5,height:80,width:80}}>
                                    {item.vendorLogo ? <Card.Image source={{uri:item.vendorLogo}} style={{height:80,width:80,borderRadius:100}} resizeMode="cover" PlaceholderContent={<ActivityIndicator color={colors.theme}/>}></Card.Image> :null}
                                </View>
                            </View>    
                            <View style={{flex:0.7}}>
                                <View style={{flex:.6}}>
                                    <Card.Title style={[CommonStyles.headerText,{color:"#fff",opacity:1,alignSelf:"flex-start",paddingHorizontal:5,fontSize:20}]}>{item.vendorName}</Card.Title>
                                </View>
                                <View style={{justifyContent:"flex-end",alignItems:"flex-end",flex:.6}}>
                                    <Card.Title style={[{color:"#fff",opacity:1,paddingHorizontal:5}]}>Delivery Time : {item.expectedDiliveryTime ? item.expectedDiliveryTime +" Min" : "60 Min"}</Card.Title>
                                </View>    
                             </View>
                        </View>
                    </Card.Image>    
                </Card>
            </TouchableOpacity>        
        )
    }


    return (
        <React.Fragment>
            {/* <HeaderBar3
                goBack={navigation.goBack}
                navigate={navigation.navigate}
                headerTitle={"Vendor List"}
                toggle={() => toggle()}
                openControlPanel={() => openControlPanel()}
            /> */}
            <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled" >
                <MenuCarouselSection
                    navigation  = {navigation} 
                    type        = {value}
                    showImage   = {true}
                    selected    = {section}
                    boxHeight   = {60}
                    index       = {index}
                />
                <View style={styles.proddets}>
                {loading ?
                    <Loading />
                    :
                    vendorList && vendorList.length >0 ?
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
                    :
                    <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                        <Text style={CommonStyles.noDataFound}>No Vendor Found</Text>
                    </View>    
            }
                {/* <View style={{height:100,backgroundColor:"#ff0",flex:.5}}>
                    </View>*/}
                </View>
        </ScrollView>
        <Footer/>
        </React.Fragment>
    );
})