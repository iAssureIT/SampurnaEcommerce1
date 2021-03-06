import React,{useEffect,useState} from 'react';
import RadialGradient from 'react-native-radial-gradient';
import {
  ScrollView,
  Text,
  View,ge,
} from 'react-native';
import {Icon,Image}                  from "react-native-elements";
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {Linking}                from 'react-native'
import { colors,website_url }   from '../../AppDesigns/currentApp/styles/styles.js';
import HTML from 'react-native-render-html';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { useSelector }        from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import Axios                from "axios";

export const TermsAndConditions  = (props)=>{
    const {navigation}=props;
    const [user_id,setUserId]               = useState('');
    const [pageBlockes,setPageBlocks]       = useState([]);
    const [loading,setLoading]              = useState(true);
    
    useEffect(() => {
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
            var token = data[0][1]
            var user_id = data[1][1]
            setUserId(user_id)
        }); 
        getData();
    },[]);


    const  openControlPanel = () => {
        _drawer.open()
    }

    const getData=()=>{
        Axios.get('/api/pages/get/page_block/terms-and-conditions-mobile')
        .then(res=>{
            console.log("res",res);
            setLoading(false);
            setPageBlocks(res.data.pageBlocks)
        })
        .catch(error=>{
            if (error.response.status == 401) {
                AsyncStorage.removeItem('user_id');
                AsyncStorage.removeItem('token');
                // setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
                navigation.navigate('Auth')
              }else{
                // setToast({text: 'Something went wrong.', color: 'red'});
              }  
        })
    }

    const regex = /(<([^>]+)>)/ig;
    const store = useSelector(store => ({
        globalSearch    : store.globalSearch
      }));
    
    if (loading) {
        return (
            <Loading />
        );
    } else {
        return (
        <View style={{flex:1,backgroundColor:"#fff"}}>
          <View style={[styles.superparent,{backgroundColor:"#fff"}]}>
                {store.globalSearch.search ?
                    <SearchSuggetion />
                :<ScrollView contentContainerStyle={[styles.container,{paddingBottom:hp(10)}]}  keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={[styles.aboutUsHeader]}>
                        <RadialGradient style={{flex:1,justifyContent: 'center',alignItems: 'center',}}
                                colors={['#ffffff','#03355480']}
                                radius={500}>
                                <Text style={[styles.HeaderText]}>Terms and Conditions</Text>
                        </RadialGradient>
                    </View>
                    {
                        pageBlockes && pageBlockes.length>0?
                            pageBlockes.map((item,index)=>{
                                return(
                                    <View style={{flex:1,paddingHorizontal:wp(4),fontSize:RFPercentage(1.8),color:'#000'}}>
                                         <HTML baseFontStyle={styles.htmlText1} style={{fontSize:RFPercentage(1.8),color:'#000'}} ignoredTags={['br']} html={item.block_id.blockDescription}/>
                                        {item.block_id.fgImage1 &&<Image
                                            source={{uri:item.block_id.fgImage1}}
                                            style={{height:200,width:"100%"}}
                                            resizeMode={"stretch"}
                                        />}
                                    </View>                                    
                                )
                            })
                        :
                        []
                    }
                </ScrollView>}
            </View>
           
            </View>
        );
    }
}