import React,{useEffect,useState} from 'react';
import RadialGradient from 'react-native-radial-gradient';
import {
  ScrollView,
  Text,
  View,ge,
} from 'react-native';
import {Icon,Image}                  from "react-native-elements";
import {HeaderBar3}               from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                   from '../../ScreenComponents/Footer/Footer.js';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {Linking}                from 'react-native'
import Axios                    from 'axios';
import { colors,website_url }   from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';
import { connect,useDispatch,useSelector }  from 'react-redux';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';

export const AboutUs = (props)=>{
    const {navigation}=props;
    const [user_id,setUserId]               = useState('');
    const [pageBlockes,setPageBlocks]       = useState([])
    const [loading,setLoading]              = useState(true);
    
    const store = useSelector(store => ({
        globalSearch : store.globalSearch
      }));

    useEffect(() => {
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
            var token = data[0][1]
            var user_id = data[1][1]
            setUserId(user_id)
        }); 
        getData();
    },[]);


  
    const getData=()=>{
        Axios.get('/api/pages/get/page_block/about-us')
        .then(res=>{
            console.log("res",res);
            setLoading(false);
            setPageBlocks(res.data.pageBlocks)
        })
        .catch(error=>{
            if (error.response.status == 401) {
                AsyncStorage.removeItem('user_id');
                AsyncStorage.removeItem('token');
                setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
                navigation.navigate('Auth')
              }else{
                setToast({text: 'Something went wrong.', color: 'red'});
              }  
        })
    }

    const regex = /(<([^>]+)>)/ig;
    
    if (loading) {
        return (
            <Loading />
        );
    } else {
        return (
            <View style={{flex:1,backgroundColor:"#fff"}}>
            {
                store.globalSearch.search ?
                  <SearchSuggetion />
                :
                <View style={[styles.superparent,{paddingBottom:60,backgroundColor:"#fff"}]}>
                    <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
                    <View style={[styles.aboutUsHeader]}>
                        <RadialGradient style={{flex:1,justifyContent: 'center',alignItems: 'center',}}
                            colors={['#ffffff','#03355480']}
                            radius={220}>
                            <Text style={[styles.HeaderText]}>About Us</Text>
                        </RadialGradient>
                    </View>
                        {
                            pageBlockes && pageBlockes.length>0?
                                pageBlockes.map((item,index)=>{
                                    const result = item.block_id.blockDescription.replace(/<[^>]+>/g, '');
                                    return(
                                        <View style={{flex:1}}>
                                            {item.block_id.fgImage1 &&<Image
                                                source={{uri:item.block_id.fgImage1}}
                                                style={[styles.aboutImg,{}]}
                                                resizeMode={"stretch"}
                                            />}
                                            {index!==0 &&<View style={[styles.textBox]}>
                                                {result!=="" && <HTML ignoredTags={['br']} html={item.block_id.blockDescription} containerStyle={{paddingLeft:15}}/>}                                        
                                            </View>}                                        
                                        </View>                                    
                                    )
                                })
                            :
                            []
                        }
                    </ScrollView>
                </View>
                }
            </View>
        );
    }
}