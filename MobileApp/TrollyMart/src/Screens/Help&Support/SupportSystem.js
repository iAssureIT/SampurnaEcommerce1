import React,{useEffect,useState} from 'react';
import {
  ScrollView,
  Text,
  View,ge,
} from 'react-native';
import {Icon,}                  from "react-native-elements";
import {HeaderBar3}               from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                   from '../../ScreenComponents/Footer/Footer1.js';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import {Linking}                from 'react-native'
import Axios                    from 'axios';
import { colors }   from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
;

export const SupportSystem = (props)=>{
    const {navigation}=props;
    const [user_id,setUserId]               = useState('');
    const [companyName,setCompanyName]      = useState('');
    const [companyEmail,setCompanyEmail]    = useState('');
    const [companyPhone,setCompanyPhone]    = useState('');
    const [loading,setLoading]              = useState(true);
    const [website_url,setWebsiteURL]       = useState('');
    
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
        Axios.get('/api/entitymaster/getCompany/1')
        .then(res=>{
            setCompanyName(res.data.companyName);
            setCompanyPhone(res.data.companyPhone);
            setCompanyEmail(res.data.companyEmail);
            setWebsiteURL(res.data.website)
            setLoading(false)
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
            <View style={styles.superparent}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
                <View styles={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 }}>
                        <View styles={{ marginBottom: 10, borderWidth: 1, borderColor: '#aaa', borderRadius: 5, shadowRadius: 5, }}>
                        <View style={{ paddingHorizontal: 0 }}>
                                <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 15, alignSelf: 'center', justifyContent: 'center', alignItem: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', color: '#333', fontSize: 15 }}>
                                        Are you facing any issue or do you have any feedback for {companyName}? Please choose any one of the options below to get in touch with us.
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.15,marginTop: 5}}>
                                        <Icon size={30} name='whatsapp' type='material-community' color='#5FCD65' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.85,marginTop: 13}}>
                                        <Text onPress={()=>{Linking.openURL('whatsapp://send?text='+companyName+' Support, I need your Help&phone='+companyPhone)}} 
                                            style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                            {companyPhone}
                                        </Text>

                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.15,marginTop: 5}}>
                                        <Icon size={30} name='phone' type='Feather' color='#77b5fe' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.85,marginTop: 13}}>
                                        <Text onPress={()=>{Linking.openURL('tel:'+companyPhone);}} 
                                            style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                           {companyPhone}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.15,marginTop: 5}}>
                                        <Icon size={30} name='gmail' type='material-community' color='red' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.85,marginTop: 13}}>
                                        <Text onPress={() => Linking.openURL('mailto:'+companyEmail+'?subject=I need your help &body=Dear '+companyName+' Support,') }
                                        style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                            {companyEmail}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.15,marginTop: 5}}>
                                        <Icon size={30} name='web' type='material-community' color='#666' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.85,marginTop: 13}}>
                                        <Text onPress={() => Linking.openURL(website_url) } 
                                            style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                            {website_url}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>  
                    </View>
                </ScrollView>

            </View>
            <Footer />
            </React.Fragment>
        );
    }
}