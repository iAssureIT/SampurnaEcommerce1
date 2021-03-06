import React,{useEffect,useState} from 'react';
import RadialGradient from 'react-native-radial-gradient';
import {
  ScrollView,
  Text,
  View,ge,
} from 'react-native';
import {Icon,Image}             from "react-native-elements";
import {HeaderBar3}             from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                 from '../../ScreenComponents/Footer/Footer.js';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {Linking}                from 'react-native'
import Axios                    from 'axios';
import { colors,website_url }   from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import HTML                     from 'react-native-render-html';
import {List, Surface}          from 'react-native-paper';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { useSelector }          from 'react-redux';
import { NetWorkError }         from '../../../NetWorkError.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage }         from 'react-native-responsive-fontsize';

export const FAQ = (props)=>{
    const {navigation}=props;
    const [user_id,setUserId]               = useState('');
    const [pageBlockes,setPageBlocks]       = useState([])
    const [loading,setLoading]              = useState(true);
    const [expanded, setExpanded] = React.useState(true);

    const handlePress = () => setExpanded(!expanded);

    
    const store = useSelector(store => ({
    globalSearch    : store.globalSearch
    }));
    
    useEffect(() => {
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
            var token = data[0][1]
            var user_id = data[1][1]
            setUserId(user_id)
        }); 
        getData();
    },[props]);


    const  openControlPanel = () => {
        _drawer.open()
    }

    const getData=()=>{
        Axios.get('/api/pages/get/page_block/faq')
        .then(res=>{
            console.log("res",res);
            setLoading(false);
            setPageBlocks(res.data.pageBlocks[res.data.pageBlocks.length-1].block_id.repeatedBlocks)
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
    
    if (loading) {
        return (
            <Loading />
        );
    } else {
        return (
            <View style={{flex:1,backgroundColor:"#fff"}}>
                {store.globalSearch.search ?
                    <SearchSuggetion />
                :
                <View style={[styles.superparent,{paddingBottom:60,backgroundColor:"#fff"}]}>
                    <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
                        <View style={[styles.aboutUsHeader]}>
                            <RadialGradient style={{flex:1,justifyContent: 'center',alignItems: 'center',}}
                                    colors={['#ffffff','#03355480']}
                                    radius={500}>
                                    <Text style={[styles.HeaderText]}>FAQ</Text>
                            </RadialGradient>
                        </View>
                        <List.Section title="" style={{backgroundColor:"#fff",paddingHorizontal:wp(5),paddingBottom:15}} >
                        {
                            pageBlockes && pageBlockes.length>0?
                                pageBlockes.map((item,index)=>{
                                    const result = item.Description.replace(/<[^>]+>/g, '');
                                    return(
                                        <View style={{
                                            marginBottom:15,
                                            backgroundColor:"#fff",
                                            ...Platform.select({
                                                ios:{
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                    width: -2,
                                                    height: 2,
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    elevation: 5,
                                                    backgroundColor:"#0000",
                                                },
                                            })
                                        
                                        }}>
                                            <List.Accordion index={(index)} style={[styles.queBox]} 
                                            theme={{colors: "#fff"}}
                                            titleNumberOfLines={5} onPress={handlePress} title={item.Title} titleStyle={[CommonStyles.normalText,{fontSize:RFPercentage(2.2),color:"#000000",fontFamily:"Montserrat-SemiBold",}]}>
                                                <View style={[styles.queAns,{marginHorizontal:wp(3)}]}>
                                                    <Text style={{fontSize:RFPercentage(1.8),color:'#000000',fontFamily:"Montserrat-Regular",textTransform:'capitalize'}}>{result}</Text>
                                                </View>
                                            </List.Accordion>
                                        </View>    
                                    )
                                })
                            :
                            []
                        }
                        </List.Section>
                    </ScrollView>
                </View>}
            </View>
        );
    }
}