import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';
import {Header, Button, CheckBox, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {FormButton} from '../FormButton/FormButton';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
// import {getServiceCenterList} from '../../redux/serviceCenter/actions';
const window = Dimensions.get('window');

export const SortModal = (props) => {
  const {sortOptions, onSelectItem, selected, visible, closeModal, vendor_id,sectionUrl} = props;
  const dispatch = useDispatch();
  const payload = useSelector(store =>store.productList.searchPayload);
  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          return closeModal();
        }}
        onDismiss={() => {
          return closeModal();
        }}
        transparent={true}
        visible={visible}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            return closeModal();
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
            padding: 0,
          }}>
          <View style={styles.topContainer}>
            <SafeAreaView forceInset={{bottom: 'always'}}>
              <View style={styles.titleContainer}>
                <Text style={CommonStyles.label}>Sort By</Text>
                <Icon name="md-close-circle" type="ionicon" color="#f00" />
              </View>
              {sortOptions.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                        payload.sortProductBy = item.sort_order;
                        payload.scroll        = false;
                        payload.startRange      = 0;
                        payload.limitRange      = 10;
                        dispatch(getCategoryWiseList(payload));
                        closeModal();
                    }}>
                    <Text style={[{padding: 5, paddingLeft: `${5}%`},CommonStyles.text]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sortText: {
    // ...getFontStyleObject(),
    fontSize: 14,
  },
  topContainer: {
    backgroundColor: '#fff',
    width: '100%',
    // height: '30%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 0.8,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    padding:5
  },
  titleContainer: {
    paddingHorizontal: `${5}%`,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.6,
    paddingVertical: `${2}%`,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    paddingHorizontal: `${5}%`,
    paddingVertical: `${5}%`,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});