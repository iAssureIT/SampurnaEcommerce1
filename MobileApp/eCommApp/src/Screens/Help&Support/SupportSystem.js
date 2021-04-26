import React from 'react';
import {
  ScrollView,Text,View,AsyncStorage,
} from 'react-native';
import {Icon,} from "react-native-elements";
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import {Linking} from 'react-native'
import Axios from 'axios';
export default class SupportSystem extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            inAppNotifications: '',
            user_id: '',
            activesub: ''
        };
    }

    componentDidMount() {
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
            token = data[0][1]
            user_id = data[1][1]
            this.setState({ userId: user_id })
        }); 
        this.getData();
    }

    openControlPanel = () => {
        this._drawer.open()
    }

    getData(){
        Axios.get('/api/entitymaster/get/one')
        .then(res=>{
            console.log("res",res);
        })
        .catch(err=>{
            console.log("err",err);
        })
    }
    
    render() {
        const { navigate, dispatch, goBack } = this.props.navigation;
        if (this.props.loading) {
        return (
            <Loading />
        );
        } else {
        return (
            <React.Fragment>
            <HeaderBar5
                goBack={goBack}
                navigate={navigate}
                headerTitle={"Help & Support"}
                toggle={() => this.toggle.bind(this)}
                openControlPanel={() => this.openControlPanel.bind(this)}
            />
            <View style={styles.superparent}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
                <View styles={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 }}>
                        <View styles={{ marginBottom: 10, borderWidth: 1, borderColor: '#aaa', borderRadius: 5, shadowRadius: 5, }}>
                        <View style={{ paddingHorizontal: 0 }}>
                                <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 15, alignSelf: 'center', justifyContent: 'center', alignItem: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', color: '#333', fontSize: 15 }}>
                                        Are you facing any issue or do you have any feedback for Kokila Bookstore? Please choose any one of the options below to get in touch with us
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.30,marginTop: 5}}>
                                        <Icon size={40} name='whatsapp' type='material-community' color='#ed3c55' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.70,marginTop: 13}}>
                                        <Text onPress={()=>{Linking.openURL('whatsapp://send?text=Dear Kokila Bookstore Support, I need your Help&phone=+9190 2807 9487')}} 
                                            style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                            +91 90280 79487
                                        </Text>

                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.30,marginTop: 5}}>
                                        <Icon size={40} name='phone' type='Feather' color='#77b5fe' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.70,marginTop: 13}}>
                                        <Text onPress={()=>{Linking.openURL('tel:+91 90280 79487');}} 
                                            style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                            +91 90280 79487
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.30,marginTop: 5}}>
                                        <Icon size={40} name='gmail' type='material-community' color='red' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.70,marginTop: 13}}>
                                        <Text onPress={() => Linking.openURL('mailto:nitinmahale31@gmail.com?subject=I need your help &body=Dear Kokila Bookstore Support,') }
                                        style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                            nitinmahale31@gmail.com
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
                                    <View  style={{ flex: 0.30,marginTop: 5}}>
                                        <Icon size={40} name='web' type='material-community' color='#666' style={{}}/>
                                    </View>
                                    <View  style={{ flex: 0.70,marginTop: 13}}>
                                        <Text onPress={() => Linking.openURL('http://qabookstore.iassureit.in/') } 
                                            style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 16 }}>
                                            http://qabookstore.iassureit.in/
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
}






// import React, { Component } from "react";
// import { Text, View, AsyncStorage } from "react-native";
// import { ScrollView, Dimensions } from 'react-native';
// import { Icon } from "react-native-elements";
// import {Linking} from 'react-native'
// import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
// import Footer from '../../ScreenComponents/Footer/Footer1.js';

// class SupportSystem extends React.PureComponent {

//     constructor(props) {
//         super(props);
//         this.state = {
//             inAppNotifications: '',
//             user_id: '',
//             activesub: ''
//         };
//     }
//     componentDidMount() {
//         AsyncStorage.multiGet(['token', 'user_id'])
//             .then((data) => {
//                 token = data[0][1]
//                 user_id = data[1][1]
//                 this.setState({ userId: user_id })
//             }); 
//     }
//     openControlPanel = () => {
//         this._drawer.open()
//     }
//     render() {
//         const { navigate, goBack, state } = this.props.navigation;
//         const {navigation} = this.props;
//         return (
//             <ScrollView keyboardShouldPersistTaps="handled" >
//                   <HeaderBar5
//                     goBack={goBack}
//                     navigate={navigate}
//                     headerTitle={"My Orders"}
//                     toggle={() => this.toggle.bind(this)}
//                     openControlPanel={() => this.openControlPanel.bind(this)}
//                     />
//                 <View styles={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 }}>
//                     <View styles={{ marginBottom: 10, borderWidth: 1, borderColor: '#aaa', borderRadius: 5, shadowRadius: 5, }}>
//                     <View style={{ paddingHorizontal: 0 }}>
//                             <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 15, alignSelf: 'center', justifyContent: 'center', alignItem: 'center' }}>
//                                 <Text style={{ fontFamily: 'Montserrat-SemiBold', color: '#333', fontSize: 13 }}>
//                                     Are you facing any issue or do you have any feedback for UniMandai? Please choose any one of the options below to get in touch with us
//                                 </Text>
//                             </View>
//                             <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
//                                 <View  style={{ flex: 0.30,marginTop: 5}}>
//                                     <Icon size={40} name='whatsapp' type='material-community' color='#666' style={{}}/>
//                                 </View>
//                                 <View  style={{ flex: 0.70,marginTop: 13}}>
//                                     <Text onPress={()=>{Linking.openURL('whatsapp://send?text=Dear UniMandai Support, I need your Help&phone=+9174 9881 2228')}} 
//                                         style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 20 }}>
//                                         +91 74 9881 2228
//                                     </Text>

//                                 </View>
//                             </View>

//                             <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
//                                 <View  style={{ flex: 0.30,marginTop: 5}}>
//                                     <Icon size={40} name='phone' type='Feather' color='#666' style={{}}/>
//                                 </View>
//                                 <View  style={{ flex: 0.70,marginTop: 13}}>
//                                     <Text onPress={()=>{Linking.openURL('tel:+91 74 9881 2228');}} 
//                                         style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 20 }}>
//                                         +91 74 9881 2228
//                                     </Text>
//                                 </View>
//                             </View>

//                             <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
//                                 <View  style={{ flex: 0.30,marginTop: 5}}>
//                                     <Icon size={40} name='email' type='Fontisto' color='#666' style={{}}/>
//                                 </View>
//                                 <View  style={{ flex: 0.70,marginTop: 13}}>
//                                     <Text onPress={() => Linking.openURL('mailto:admin@unimandai.com?subject=I need your help &body=Dear UniMandai Support,') }
//                                      style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 20 }}>
//                                         admin@unimandai.com
//                                     </Text>
//                                 </View>
//                             </View>

//                             <View style={{ flex: 1, flexDirection:'row',   marginTop: 35 }}>
//                                 <View  style={{ flex: 0.30,marginTop: 5}}>
//                                     <Icon size={40} name='web' type='material-community' color='#666' style={{}}/>
//                                 </View>
//                                 <View  style={{ flex: 0.70,marginTop: 13}}>
//                                     <Text onPress={() => Linking.openURL('http://unimandai.com/') } 
//                                         style={{ fontFamily: 'Montserrat-SemiBold', color: '#0000FF', fontSize: 20 }}>
//                                         www.unimandai.com
//                                     </Text>
//                                 </View>
//                             </View>
//                         </View>
//                     </View>  
//                 </View>
//             </ScrollView>
//         );
//     }
// }
// export default SupportSystem;