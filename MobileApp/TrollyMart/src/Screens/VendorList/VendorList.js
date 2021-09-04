import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
  Image
} from 'react-native';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/vendorListStyles.js';
import { Card,Icon }                 from "react-native-elements";
import axios                    from 'axios';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
import {
        useDispatch,
        useSelector }           from 'react-redux';
import { ActivityIndicator }    from 'react-native-paper';
import {MenuCarouselSection}    from '../../ScreenComponents/Section/MenuCarouselSection.js';
import { ScrollView }           from 'react-native';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {STOP_SCROLL}            from '../../redux/productList/types';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { ImageBackground }      from 'react-native';
import { NetWorkError } from '../../../NetWorkError.js';
import FastImage              from 'react-native-fast-image';
import { CommonActions } from "@react-navigation/native";
import {SET_CATEGORY_LIST,
    SET_CATEGORY_WISE_LIST}  from '../../redux/productList/types';
    import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const window = Dimensions.get('window');


TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
export const VendorList = withCustomerToaster((props)=>{
    const [loading,setLoading] =useState(true);
    const section = props.route.params?.section;
    const sectionUrl = props.route.params?.sectionUrl;
    const [limit,setLimit] = useState(0);
    const index = props.route.params?.index;
    const [vendorList,setVendorList] =useState([]);
    const [refresh,setRefresh]=useState(false);
    const dispatch 		= useDispatch();
    const store = useSelector(store => ({
        location        : store.location,
        userDetails     : store.userDetails,
        globalSearch    : store.globalSearch,
        isConnected: store.netWork.isConnected
      }));
    const {globalSearch} =store;
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
            "sectionUrl" : sectionUrl,
            "latitude"   : store.location?.address?.latlong?.lat,
            "longitude"  : store.location?.address?.latlong?.lng
        }
        axios.post('/api/vendorlist/post/vendor/list',formValues)
        .then(res=>{
            setLoading(false);
            setRefresh(false);
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

    const goToProductList=(vendor)=>{
        dispatch({
            type : SET_CATEGORY_WISE_LIST,
            payload : []
        })
        var payload ={
            "vendor_ID"         : vendor.vendor_ID,
            "sectionUrl"        : sectionUrl,
            "startRange"        : 0,
            "limitRange"        : 8,
        } 
        dispatch(getCategoryWiseList(payload));
        navigation.push('VendorProducts',{vendor:vendor,sectionUrl:sectionUrl,section:section,index:index,vendorLocation_id:vendor.vendorLocation_id});
    }

    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity  style={{marginBottom:hp(0.5),alignItems:'flex-end'}} onPress={()=>goToProductList(item)} activeOpacity={1}>                
                <Card containerStyle={{padding:0,borderRadius:7,height:wp(18),width:"91%",marginHorizontal:0,elevation:5}} wrapperStyle={{}}>
                        <View style={styles.logoBox}>
                            {item.vendorLogo ? 
                            <FastImage 
                                source          =   {{
                                                        uri:item.vendorLogo,
                                                        priority: FastImage.priority.high, 
                                                        cache: FastImage.cacheControl.immutable,
                                                    }} 
                                style      =   {{
                                    borderRadius:hp(100),
                                    borderWidth:0.5,
                                    borderColor:'#033554',
                                    height:wp(13),
                                    width:wp(13),
                                    backgroundColor:"#fff",
                                    alignSelf:'center'
                                }} resizeMode="contain" 
                                PlaceholderContent={<ActivityIndicator color={colors.theme}/>}></FastImage> 
                                :
                                <FastImage 
                                source          =   {require("../../AppDesigns/currentApp/images/notavailable.png")} 
                                style      =   {{
                                    borderRadius:hp(100),
                                    borderWidth:0.5,
                                    borderColor:'#033554',
                                    height:wp(13),
                                    width:wp(13),
                                    backgroundColor:"#fff",
                                    alignSelf:'center'
                                }} resizeMode="contain" 
                                PlaceholderContent={<ActivityIndicator color={colors.theme}/>}></FastImage>
                                }
                        </View>
                        <View style={{justifyContent:'center',alignItems:'center',height:wp(18)}}>
                            <Text numberOfLines={1} style={[{color:"#000",paddingLeft:wp(10),alignSelf:"flex-start",fontSize:RFPercentage(2),fontFamily:"Montserrat-Bold"}]}>{item.vendorName}</Text >
                        </View> 
                        {/* <View style={{height:20,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginRight:5}}>
                            <Text style={[{color:"#000",opacity:1,fontSize:10,marginTop:5}]}>60 Mins </Text>
                            <Image
                                source      = {require("../../AppDesigns/currentApp/images/time.png")} 
                                style       =   {{height:15,marginTop:8,width:15}} 
                                resizeMode  = "contain" 
                                PlaceholderContent={<ActivityIndicator color={colors.theme}/>}/>
                        </View>     */}
                    
                </Card>   
            </TouchableOpacity>        
        )
    }
    
    const refreshControl=()=>{
        setRefresh(true);
        getData();
    }

    return (
        <React.Fragment>
        {!store.isConnected?
            <NetWorkError />
            :
            <View style={{flex:1,backgroundColor:"#fff"}}>
                {globalSearch.search ?
                <SearchSuggetion />
                :
                <View style={[styles.container]} keyboardShouldPersistTaps="handled" >
{/* 
                    <MenuCarouselSection
                        navigation  = {navigation} 
                        showImage   = {true}
                        selected    = {section}
                        boxHeight   = {4}
                        fontSize    = {2}
                        index       = {index}
                    />
                    <View style={{backgroundColor:colors.cartButton,marginTop:hp(1)}}>
                        <Text style={styles.topText}>Delivery time <Text style={{fontSize:RFPercentage(3),fontFamily:'Montserrat-Bold'}}>9</Text><Text style={{fontFamily:'Montserrat-Bold'}}>am</Text> to <Text style={{fontSize:RFPercentage(3),fontFamily:'Montserrat-Bold'}}>11</Text><Text style={{fontFamily:'Montserrat-Bold'}}>pm</Text> or next day delivery</Text>
*/}
                    {/* { vendorList && vendorList.length >0 ? */}
                    <View>
                        <MenuCarouselSection
                            navigation  = {navigation} 
                            showImage   = {true}
                            selected    = {section}
                            boxHeight   = {4}
                            fontSize    = {2}
                            index       = {index}
                        />                    
                        <View style={{backgroundColor:colors.cartButton,marginTop:10}}>
                            <Text style={styles.topText}>Delivery time <Text style={{fontSize:RFPercentage(3),fontFamily:'Montserrat-Bold'}}>9</Text><Text style={{fontFamily:'Montserrat-Bold'}}>am</Text> to <Text style={{fontSize:RFPercentage(3),fontFamily:'Montserrat-Bold'}}>11</Text><Text style={{fontFamily:'Montserrat-Bold'}}>pm</Text> or next day delivery</Text>
                        </View>
                    </View>
                    {/* :
                    null
                    } */}
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
                                // keyExtractor                  = {item => item._id.toString()}
                                initialNumToRender            = {6}
                                ListFooterComponent           = {()=>loading && <ActivityIndicator color={colors.theme}/>}
                                onEndReachedThreshold         = {0.01}
                                onEndReached={({ distanceFromEnd }) => {
                                    if(distanceFromEnd >= 0 && limit > 6) {
                                        getData();
                                    }
                                }}
                                getItemLayout={(data, index) => ({
                                    length: 65, 
                                    offset: 65 * index, 
                                index
                                })}
                                refreshControl={
                                    <RefreshControl
                                    refreshing={refresh}
                                    onRefresh={() => refreshControl()}
                                    />
                                } 
                            /> 
                        :
                        // <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                        //     <Text style={CommonStyles.noDataFound}>We are currently not working in your area. However, we will come there soon. So please visit this website again shortly.</Text>
                        // </View>
                    <View style={{height:window.height-135,}}>
                        <View style={{height:300}}>
                            <Image
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/NoVendor.png'}}
                            style={{width:window.width,height:275}}
                            resizeMode='contain'
                            />
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:26,color:"#033554",opacity: 1}}>Coming Soon to you!</Text>
                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:"Montserrat-Medium",fontSize:14,color:"#000"}}>We are expanding to your area very soon</Text>
                                <Text style={[CommonStyles.linkText,{fontFamily:"Montserrat-Italic",fontSize:10}]}>stay tuned</Text>
                            </View>
                        </View>
                        {/* <View style={{height:70,backgroundColor:"#ff0"}}>
                            <Image
                                style={{height:'100%',width:"100%"}}
                                source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/NoVendorFooter.png'}}                                
                                resizeMode='contain'
                                />
                        </View> */}
                        {/* 
                        <View style={{alignItems:'center'}}>
                          
                        </View>
                        <View style={{alignItems:'center',height:115}}>
                            
                        </View> */}
                    </View>
                    }
                    </View>
                </View>}
            </View>}
        </React.Fragment>
    );
})