import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList, Alert,SafeAreaView,RefreshControl,ImageBackground
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
import {Footer}                 from '../../ScreenComponents/Footer/Footer.js';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {STOP_SCROLL}          from '../../redux/productList/types';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { NetWorkError } from '../../../NetWorkError.js';

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
export const ProductVendorList = withCustomerToaster((props)=>{
    const [loading,setLoading] =useState(true);
    const [value,setValue] =useState('lowestprice');
    const section = props.route.params?.section;
    const sectionUrl = props.route.params?.sectionUrl;
    const index = props.route.params?.index;
    const product_id = props.route.params?.product_id;
    const [limit,setLimit] = useState(0);
    const [vendorList,setVendorList] =useState([]);
    const dispatch 		= useDispatch();
    const store = useSelector(store => ({
        location        : store.location,
        userDetails     : store.userDetails,
        preferences     : store.storeSettings.preferences,
        globalSearch    : store.globalSearch
      }));
    const {globalSearch} =store ;
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
        var startRange = 0+limit;
        var limitRange = limit +10;
       var formValues =  {
        "startRange" : 0,
        "limitRange" : 10,
        "product_ID" : product_id,
        "latitude"   : store.location?.address?.latlong?.lat,
        "longitude"  : store.location?.address?.latlong?.lng
    }
        axios.post('/api/vendorlist/post/productwise/vendor/list',formValues)
        .then(res=>{
            console.log("res",res);
            setLoading(false);
            // setLimit(limitRange);
            // if(vendorList.length > 0){
            //     setVendorList(vendorList.concat(res.data));
            // }else{
                setVendorList(res.data);
            // }
        })
        .catch(err=>{
            setLoading(false);
            // console.log("err",err)
        })
    }

    const getCategoryList=(item)=>{
        var payload ={
            "vendor_ID"         : item.vendor_ID,
            "sectionUrl"        : sectionUrl,
            "startRange"        : 0,
            "limitRange"        : 10,
        } 
        console.log("payload",payload);
        dispatch(getCategoryWiseList(payload));
    }


    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity style={{paddingHorizontal:15,paddingLeft:30,marginBottom:5}} 
                onPress={()=> 
                {
                    navigation.navigate('SubCatCompView', { 
                        productID           : product_id,
                        currency            : store?.preferences?.currency,
                        vendorLocation_id   : item.vendorLocation_id,
                        location            : store.location,
                        vendor_id           : item.vendor_ID,
                        // category            : props.category,
                        // subCategory         : subCategory
                }),getCategoryList(item)}} 
                activeOpacity={1}
            >                  
            <Card containerStyle={{padding:0,borderRadius:7,height:100,marginRight:0,elevation:5}} wrapperStyle={{alignItems:'center',flexDirection:'row'}}>
                <View style={styles.logoBox1}>
                    {item.vendorLogo ? <ImageBackground source={{uri:item.vendorLogo}} style={{height:80,width:80}} imageStyle={{borderRadius:100,borderWidth:0.5,borderColor:  '#033554'}} resizeMode="cover" PlaceholderContent={<ActivityIndicator color={colors.theme}/>}></ImageBackground> :null}
                </View>
                <View style={{flex:1,height:100,justifyContent:'center',paddingLeft:60}}>
                    <Text style={[CommonStyles.subHeaderText,{color:"#000",alignSelf:"flex-start"}]}>{item.vendorName}</Text >
                    <Text numberOfLines={2} style={[CommonStyles.text,{color:"#000"}]}>{item.productName}</Text>
                    <Text style={[CommonStyles.text,{color:"#000"}]}>{store?.preferences?.currency} {item.productPrice.toFixed(2)}</Text>
                </View> 
                <ImageBackground 
                    source              = {require("../../AppDesigns/currentApp/images/Time.png")} 
                    style               = {{height:20,justifyContent:"center",alignSelf:"flex-end",marginBottom:5}} 
                    resizeMode          = "contain" 
                    PlaceholderContent  = {<ActivityIndicator color={colors.theme}/>}
                >
                    <Text style={[{color:"#000",opacity:1,marginRight:25,fontSize:10}]}>60 Mins </Text>
                </ImageBackground>
            </Card>   
        </TouchableOpacity>   
        )
    }


    return (
        <View style={{flex:1,backgroundColor:"#fff"}}>
            {
            globalSearch.search ?
            <SearchSuggetion />
            :
            <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled" >
                <MenuCarouselSection
                    navigation  = {navigation} 
                    type        = {value}
                    showImage   = {true}
                    selected    = {section}
                    boxHeight   = {40}
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
                        initialNumToRender            = {6}
                        ListFooterComponent           = {()=>loading && <ActivityIndicator color={colors.theme}/>}
                        onEndReachedThreshold         = {0.5}
                    /> 
                    :
                    <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                        <Text style={CommonStyles.noDataFound}>No Vendor Found</Text>
                    </View>    
            }
                {/* <View style={{height:100,backgroundColor:"#ff0",flex:.5}}>
                    </View>*/}
                </View>
            </ScrollView>}
           
        </View>
    );
})