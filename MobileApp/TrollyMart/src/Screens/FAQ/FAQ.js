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
import {List, Surface} from 'react-native-paper';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { useSelector }        from 'react-redux';
import { NetWorkError } from '../../../NetWorkError.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

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
    },[]);


    const  openControlPanel = () => {
        _drawer.open()
    }

    const getData=()=>{
        Axios.get('/api/pages/get/page_block/about-us')
        .then(res=>{
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
                        <List.Section title="">
                        {
                            pageBlockes && pageBlockes.length>0?
                                pageBlockes.map((item,index)=>{
                                    const result = item.block_id.blockDescription.replace(/<[^>]+>/g, '');
                                    console.log("result",item.block_id.fgImage1)
                                    return(
                                    <List.Accordion index={(index)} style={[styles.queBox]} onPress={handlePress} title={"FAQ" + (index+1)} titleStyle={[CommonStyles.normalText,{fontSize:RFPercentage(2.2),color:"#000000",fontFamily:"Montserrat-SemiBold",}]}>
                                        <View style={[styles.queAns,{marginHorizontal:wp(6)}]}>
                                            <Text style={{fontSize:RFPercentage(1.8),color:'#000000',fontFamily:"Montserrat-Regular",}}>Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.</Text>
                                        </View>
                                    </List.Accordion>
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