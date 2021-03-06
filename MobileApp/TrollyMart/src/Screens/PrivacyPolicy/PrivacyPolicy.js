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
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { useSelector }        from 'react-redux';
import { NetWorkError } from '../../../NetWorkError.js';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const PrivacyPolicy  = (props)=>{
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
        Axios.get('/api/pages/get/page_block/privacy-policy-mobile')
        .then(res=>{
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
    console.log("res.data.pageBlocks",pageBlockes);
    const store = useSelector(store => ({
        globalSearch    : store.globalSearch
      }));


      function hasOnlyBrChildren(node) {
        return node.children.every(
          (child) => child.type === 'p' && child.name === '&nbsp'
        );
      }
      
      function alterChildren(node) {
        return node.children.filter(
          (child) =>
            child.type !== 'tag' ||
            !(child.name === 'p' && hasOnlyBrChildren(child))
        );
      }
    
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
            <View style={[styles.superparent,{backgroundColor:"#fff"}]}>
            {store.globalSearch.search ?
              <SearchSuggetion />
                :
                <ScrollView contentContainerStyle={[styles.container,{paddingBottom:hp(10)}]}keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={[styles.aboutUsHeader]}>
                        <RadialGradient style={{flex:1,justifyContent: 'center',alignItems: 'center',}}
                                colors={['#ffffff','#03355480']}
                                radius={500}>
                                <Text style={[styles.HeaderText]}>Privacy Policy</Text>
                        </RadialGradient>
                    </View>
                    {
                        pageBlockes && pageBlockes.length>0?
                            pageBlockes.map((item,index)=>{
                                // console.log("result",result);
                                return(
                                    <View style={{paddingHorizontal:wp(4),fontSize:RFPercentage(1.8),color:'#000'}}>
                                        {item.block_id.blockDescription!=="" && <HTML baseFontStyle={styles.htmlText1} style={{fontSize:RFPercentage(1.8),color:'#000'}} alterChildren={alterChildren} ignoredTags={['br']} html={item.block_id.blockDescription}/>}
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
           
            </React.Fragment>
        );
    }
}