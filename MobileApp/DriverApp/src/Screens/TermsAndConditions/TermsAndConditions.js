import React,{useEffect,useState} from 'react';
import {
  ScrollView,
  Text,
  View,ge,
} from 'react-native';
import {Icon,Image}                  from "react-native-elements";
import {HeaderBar3}               from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                   from '../../ScreenComponents/Footer/Footer1.js';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {Linking}                from 'react-native'
import Axios                    from 'axios';
import { colors,website_url }   from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';

export const TermsAndConditions  = (props)=>{
    const {navigation}=props;
    const [user_id,setUserId]               = useState('');
    const [pageBlockes,setPageBlocks]       = useState([])
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
        Axios.get('/api/pages/get/page_block/terms-and-conditions')
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
            <React.Fragment>
            {/* <HeaderBar3
                goBack={navigation.goBack}
                navigate={navigation.navigate}
                headerTitle={"Help & Support"}
                toggle={() => toggle()}
                openControlPanel={() => openControlPanel()}
            /> */}
          <View style={[styles.superparent,{paddingBottom:60,backgroundColor:"#fff"}]}>
                <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
                    {
                        pageBlockes && pageBlockes.length>0?
                            pageBlockes.map((item,index)=>{
                                const result = item.block_id.blockDescription.replace(/<[^>]+>/g, '');
                                return(
                                    <View style={{flex:1,paddingHorizontal:15}}>
                                        {result!=="" && <HTML ignoredTags={['br']} html={item.block_id.blockDescription}/>}
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
                </ScrollView>
            </View>
            <Footer />
            </React.Fragment>
        );
    }
}