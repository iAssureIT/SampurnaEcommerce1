import React from 'react';
import {
    ScrollView,
    Text,
    View,
} from 'react-native';
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer} from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/StoreDetails.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
import axios from 'axios';

export default class StoreDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        const storeid = this.props.navigation.getParam('storeid', 'No storeid');
        this.getEntitiesInfo(storeid);
    }
    getEntitiesInfo(storeid) {
        axios.get("/api/entitymaster/get/one/" + storeid)
            .then((response) => {
                console.log("entityInfo===>", response.data[0])
                this.setState({
                    entityInfo: response.data[0],
                    companyName: response.data[0].companyName,
                    contacts: response.data[0].companyPhone,
                    companyEmail: response.data[0].companyEmail,
                    locations: response.data[0].locations[0].addressLine1,
                });
            })
            .catch((error) => {
            })
    }


    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <React.Fragment>
                <HeaderBar5
                    goBack={goBack}
                    navigate={navigate}
                    headerTitle={"Stores Details"} />
                <ScrollView >
                    <View style={styles.formWrapper}>
                        <View style={styles.storeparent}>
                            <View style={styles.acdashparent}>
                                <View style={styles.accuserinfo}>
                                    <View style={styles.padhr18}>
                                        <View style={styles.accusermobinfo}>
                                            <Text style={styles.accusermob}>Store Name:</Text>
                                            <Text style={styles.accmobnumber}>: {this.state.companyName}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.padhr18}>
                                        <View style={styles.accusermobinfo}>
                                            <Text style={styles.accusermob}>Store Address</Text>
                                            <Text style={styles.accmobnumber}>: {this.state.locations} </Text>
                                        </View>
                                    </View>
                                    <View style={styles.padhr18}>
                                        <View style={styles.accusermobinfo}>
                                            <Text style={styles.accusermob}>Store Mobile:</Text>
                                            <Text style={styles.accmobnumber}>: {this.state.contacts}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.padhr18}>
                                        <View style={styles.accusermobinfo}>
                                            <Text style={styles.accusermob}>Store EmailId:</Text>
                                            <Text style={styles.accmobnumber}>: {this.state.companyEmail}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>


                        </View>
                    </View>
                </ScrollView>
                <Footer />
            </React.Fragment>
        );
    }
}
