import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform
} from 'react-native';
import {StatusBar} from 'react-native';
import {Header, Button, CheckBox}   from 'react-native-elements';
import {connect}                    from 'react-redux';
// import {FormButton} from '../../components/FormButton/FormButton';
import { colors }                   from '../../AppDesigns/currentApp/styles/styles.js';
import axios                        from 'axios';
// import {getServiceCenterList} from '../../redux/serviceCenter/actions';
import {useSelector, useDispatch}   from 'react-redux';
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import {
  SET_CATEGORY_WISE_LIST,STOP_SCROLL
} from '../../redux/productList/types';
// import {Text} from '../../components/Text';
const window = Dimensions.get('window');

const FilterModal = (props) => {
  const {visible, 
        filterOptions, 
        closeModal, 
        filterList,
        subCategory,
        brandsArray,
        sizeArray,
        category,
        section,
        vendorLocation_id
    } = props;
  const [activeTab, setActiveTab] = useState(filterOptions[0]);
  const [current_category, setCategory] = useState(filterOptions[0]);
  const [localFilters, setFilters] = useState({
    subCategory: [],
    brandsArray:[],
    sizeArray:[],
  });
  const payload = useSelector(store =>store.productList.searchPayload);
//   const [filterListLocal, setFilterListLocal] ==================== useState(vehicleCategory);
  const dispatch = useDispatch();
//   useEffect(() => {
//     setFilterListLocal(filterList);
//   }, [filterList]);
  useEffect(() => {
    // setCategory(category);
    // if(current_category !== category){
      setFilters({
        subCategory: [],
        brandsArray:[],
        sizeArray:[],
      })
    // }
   
  }, [props]);

  return (
    <SafeAreaView forceInset={{vertical: 'always'}} >
    <StatusBar  backgroundColor={"#222222"} />
      <Modal
        onRequestClose={() => {
          return closeModal();
        }}
        onDismiss={() => {
          return closeModal();
        }}
        // transparent={true}
        visible={visible}>
       <Header
         statusBarProps={{ backgroundColor:colors.theme }}
          rightComponent={
            <Text
              style={{color: 'red'}}
              onPress={() =>
                setFilters({
                    subCategory: [],
                    brandsArray:[],
                    sizeArray:[],
                })
                
              }>
                Clear All
            </Text>
          }
          leftComponent={
            <Text style={{fontSize: 18, fontWeight: '500'}}>{"Filters"}</Text>
          }
          containerStyle={{
            padding: 0,
            paddingTop: 20,
            height: window.height * 0.08,
            backgroundColor: '#fff',
            borderBottomWidth: 0.8,
            height:80,
          }}
        />
        <View style={{flex: 1, borderTopWidth: 0.2}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.4,
                backgroundColor: '#F8F8F8',
                borderRightWidth: 0.5,
              }}>
              {filterOptions.map((option, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setActiveTab(option)}
                    style={[
                      styles.optionTab,
                      activeTab === option
                        ? {borderRightWidth: 5, borderRightColor: colors.theme}
                        : {},
                    ]}
                    key={index}>
                    <Text style={[styles.option]}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{flex: 0.6, backgroundColor: '#fff',fontFamily:'Montserrat-SemiBold',}}>
              {
                {
                  "Sub Category": (
                    <MultiSelectComponent
                      onSelect={(values) => {
                        setFilters({...localFilters, subCategory: values});
                      }}
                      selected={localFilters.subCategory}
                      options={subCategory}
                    />
                  ),
                }[activeTab]
              }
              {
                {
                  "Brand": (
                    <MultiSelectComponent
                      onSelect={(values) => {
                        setFilters({...localFilters, brandsArray: values});
                      }}
                      selected={localFilters.brandsArray}
                      options={brandsArray}
                    />
                  ),
                }[activeTab]
              }
              {
                {
                  "Size": (
                    <MultiSelectComponent
                      onSelect={(values) => {
                        setFilters({...localFilters, sizeArray: values});
                      }}
                      selected={localFilters.sizeArray}
                      options={sizeArray}
                    />
                  ),
                }[activeTab]
              }
            </View>
          </View>
          <View style={{flexDirection: 'row', width: '100%',marginBottom:Platform.OS === 'ios'?30:0,justifyContent:"space-between",paddingHorizontal:5}}>
            <Button
            TouchableComponent={TouchableOpacity}
              title="Cancel"
              containerStyle={{
                marginVertical: 0,
                width: '49%',
              }}
              buttonStyle={{borderRadius: 0,borderWidth: 0.5, backgroundColor: '#fff',borderColor: 'red'}}
              titleStyle={{color: 'red'}}
              onPress={() => {
                closeModal();
              }}
            />
            <Button
              containerStyle={{
                marginVertical: 0,
                width: '49%',
              }}
              TouchableComponent={TouchableOpacity}
              title='Apply'
              onPress={async() => {
                payload.categoryUrl     = localFilters.subCategory[0]?.value.split("^")[0];
                payload.subCategoryUrl  = localFilters.subCategory.map(e=>e.value?.split("^")[1]);
                payload.subCategory     = localFilters.subCategory.map(e=>e.label);
                payload.brand           = localFilters.brandsArray.map(e=>e.value);
                payload.scroll          = false;
                payload.startRange      = 0;
                payload.limitRange      = 10;
                dispatch({
                  type:SET_CATEGORY_WISE_LIST,
                  payload:[]
                })
                dispatch(getCategoryWiseList(payload));
                closeModal();
                dispatch({
                  type: STOP_SCROLL,
                  payload: false,
              });
                // navigation.push('VendorProducts',
                // {
                //   category          : category,
                //   sectionUrl        : section?.replace(/\s/g, '-').toLowerCase(),
                //   section           : section,
                //   // index             : props.index,
                //   vendorLocation_id : vendorLocation_id,
                // });
              }}
              // disabled={localFilters.subCategory.length>0||localFilters.brandsArray.length>0?false:true}
              titleStyle={{color: colors.theme}}
              buttonStyle={{borderRadius: 0, backgroundColor: colors.layoutColor, borderWidth: 0.5,borderColor: colors.theme}}
            />
          </View>
        </View> 
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  optionTab: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  option: {
    fontSize: 16,
  },
});

const MultiSelectComponent = (props) => {
  const {options, selected, onSelect} = props;
  const onPressItem = (item) => {
    if (selected.some((S) => S.value === item.value)) {
      const arr = selected.filter((S) => S.value !== item.value);
      return onSelect(arr);
    } else {
      return onSelect([...selected, item]);
    }
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={options}
        keyExtractor={(item, index) => `${index}`}
        ListEmptyComponent={
          <Text style={{fontFamily:'Montserrat-Regular',color:'#000', fontSize: 12,paddingVertical:5,paddingHorizontal:5}}>
           No data available.
          </Text>
        }
        renderItem={({item, index}) => (
          <CheckBox
            onPress={() => onPressItem(item)}
            checked={selected.some((s) => s.value === item.value)}
            title={item.label}
          />
        )}
      />
    </View>
  );
};

const mapStateToProps = (state)=>{
    return {
      openModal        : state.openModal,
    }
  };
  const mapDispatchToProps = (dispatch)=>{
    return {
        filterVehicles : (data)=> dispatch({type: "VEHICLE_LIST",
            vehicleList:data,
        })
    }
  };
export default connect(mapStateToProps,mapDispatchToProps)(FilterModal);