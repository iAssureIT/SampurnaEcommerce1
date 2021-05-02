import React from 'react';
import axios from 'axios';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/PaymentMethodStyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';

export default class PGWebView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: 'first',
      inputFocusColor: colors.textLight,
      isOpen: false,
      btnLoading: false,
      paymentmod: false,
      paymentmethods: "cod",
    };
  }
componentDidMount() {
    const pinepgurl = this.props.navigation.getParam('pinepgurl', 'NO-ID');
    setstate({pinepgurl : pinepgurl,})
}
render() {
    const { checked } = this.state;
    const { navigate, goBack } = this.props.navigation;
      return (
        <React.Fragment>
            <HeaderBar5
            goBack={goBack}
            navigate={navigate}
            headerTitle={"UniMandai"}
          />
          <View style={styles.superparent}>
            <WebView
            ignoreSslError={false}
            startInLoadingState={true}
            source={{ uri: this.state.pinepgurl}}
            />
          </View>
        </React.Fragment>
      );
    }
}
