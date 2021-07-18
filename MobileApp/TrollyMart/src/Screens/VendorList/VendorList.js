import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity,
  FlatList,
} from 'react-native';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/vendorListStyles.js';
import { Card }                 from "react-native-elements";
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

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
export const VendorList = withCustomerToaster((props)=>{
    const [loading,setLoading] =useState(true);
    const section = props.route.params?.section;
    const sectionUrl = props.route.params?.sectionUrl;
    const [limit,setLimit] = useState(0);
    const index = props.route.params?.index;
    const [vendorList,setVendorList] =useState([]);
    const dispatch 		= useDispatch();
    const store = useSelector(store => ({
        location        : store.location,
        userDetails     : store.userDetails,
        globalSearch    : store.globalSearch
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
            <TouchableOpacity  style={{paddingLeft:20,paddingRight:15,marginBottom:5,justifyContent:'flex-end'}} onPress={()=>goToProductList(item)} activeOpacity={1}>                
                <Card containerStyle={{padding:0,borderRadius:7,height:65,marginRight:0,elevation:5}} wrapperStyle={{alignItems:'center',flexDirection:'row'}}>
                    <View style={styles.logoBox}>
                        {item.vendorLogo ? <ImageBackground source={{uri:item.vendorLogo}} style={{height:54,width:54}} imageStyle={{borderRadius:100,borderWidth:0.5,borderColor:  '#033554'}} resizeMode="cover" PlaceholderContent={<ActivityIndicator color={colors.theme}/>}></ImageBackground> :null}
                    </View>
                    <View style={{flex:1,height:65,justifyContent:'center'}}>
                         <Text numberOfLines={1} style={[CommonStyles.headerText,{color:"#000",paddingLeft:40,alignSelf:"flex-start",fontSize:17}]}>{item.vendorName}</Text >
                    </View> 
                    <ImageBackground 
                        source={require("../../AppDesigns/currentApp/images/Time.png")} 
                        style={{height:20,justifyContent:"center",alignSelf:"flex-end",marginBottom:5}} 
                        resizeMode="contain" 
                        PlaceholderContent={<ActivityIndicator color={colors.theme}/>}>
                            <Text style={[{color:"#000",opacity:1,marginRight:25,fontSize:10}]}>60 Mins </Text>
                    </ImageBackground>
                </Card>   
            </TouchableOpacity>        
        )
    }


    return (
        <View style={{flex:1,backgroundColor:"#fff"}}>
            {globalSearch.search ?
            <SearchSuggetion />
            :
            <View style={[styles.container]} keyboardShouldPersistTaps="handled" >
                <MenuCarouselSection
                    navigation  = {navigation} 
                    showImage   = {true}
                    selected    = {section}
                    boxHeight   = {40}
                    index       = {index}
                />
                <View style={{flexDirection:'row',justifyContent:'center',height:35,backgroundColor:'#5B8E7E',marginTop:10}}>
                    <Text style={styles.topText}>Delivery time <Text style={{fontSize:20,color:'#AC3A3A'}}>9</Text>am to <Text style={{fontSize:20,color:'#AC3A3A',paddingVertical:3}}>11</Text>pm or next day delivery</Text>
                </View>
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
                        // refreshControl={
                        //     <RefreshControl
                        //     //   refreshing={refresh}
                        //     //   onRefresh={() => refreshControl()}
                        //     />
                        // } 
                    /> 
                    :
                    <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                        <Text style={CommonStyles.noDataFound}>No Vendor Found</Text>
                    </View>    
            }
             </View>
        </View>}
        </View>
    );
})