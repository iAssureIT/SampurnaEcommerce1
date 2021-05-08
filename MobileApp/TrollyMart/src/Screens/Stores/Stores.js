import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer} from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class Stores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
componentDidMount() {
    this.getEntities();
    AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
            token = data[0][1]
            user_id = data[1][1]
            this.setState({ userId: user_id })
        }); 
}
getEntities() {
    var entityType = "franchise";
    axios.get( "/api/entitymaster/get/"+entityType)
    .then((response) => {
        console.log("response of franchise==>",response.data);
        this.setState({ storeDetails: response.data,loading: false })
    })
    .catch((error) => {
        this.setState({ loading: false, })
    })
}
getStoreDetails(storeId) {
    this.props.navigation.navigate('StoreDetails',{storeid:storeId});
}

render() {
    const { navigate, goBack } = this.props.navigation;
    return (
        <React.Fragment>
            <HeaderBar5
                goBack={goBack}
                navigate={navigate}
                headerTitle={"Our Stores"}/>
            <ScrollView >
              <View style={styles.formWrapper}>
                <View style={styles.storeparent}>
                    {   !this.state.loading ?
                        this.state.storeDetails && this.state.storeDetails.length > 0 ?
                        this.state.storeDetails.map((data, index) => {
                            return (
                                <View key={index} style={styles.prodinfoparent}>
                                    <TouchableOpacity onPress={()=>this.getStoreDetails(data._id)}>
                                        <View style={styles.myorderdets}>
                                            <View style={{flex:1}}>                    
                                                <View style={{flexDirection:'row',marginBottom:5}}>
                                                    <View style={{flex:1,}}>
                                                        <Text style={{fontFamily:"Montserrat-SemiBold",color:'#333',fontSize:16}}>{data.companyName}  </Text>
                                                        {/* <Text style={{fontFamily:"Montserrat-SemiBold"}}>{data.companyPhone}</Text> */}
                                                    </View>
                                                </View>
                                                <View>
                                                    <Text style={{color:'#666',fontFamily:"Montserrat-SemiBold"}}>{data.locations[0].addressLine1}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    : 
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                            <Image source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}/>
                        </View>
                    :
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                            <ActivityIndicator size="large" color={colors.theme} />
                        </View>
                    }
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </React.Fragment>
    );
  }
}
