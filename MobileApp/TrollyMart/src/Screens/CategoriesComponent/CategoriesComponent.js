import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,Alert,
  TouchableOpacity,
  Image,ActivityIndicator,
  FlatList,
  SafeAreaView
} from 'react-native';
import {HeaderBar3}        from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}           from '../../ScreenComponents/Footer/Footer1.js';
import BouncingPreloader  from 'react-native-bouncing-preloader';
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import {colors}           from '../../AppDesigns/currentApp/styles/styles.js';
import Loading            from '../../ScreenComponents/Loading/Loading.js';
import axios              from 'axios';
import { getCategoryWiseList } from '../../redux/productList/actions.js';
import { connect,useDispatch,useSelector }      from 'react-redux';

export const CategoriesComponent=(props)=>{
  const {navigation,route}=props;
  const [isOpen,setOpen] =useState(false);
  const [categories,setCategories] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [category_ID,setCategoryId] = useState('');
  const [categoryName,setCategoryName] = useState('');
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch();
  const {section_id}=route.params;
  const store = useSelector(store => ({
    userDetails : store.userDetails,
  }));
  const {userDetails} = store;

  useEffect(() => {
     getCategories(section_id);
  },[props]);

  const getCategories=(section_id)=>{
    axios.get("/api/category/get/list/"+section_id)
    .then((response)=>{
      setLoading(false)
      setCategories(response.data);
    })
    .catch((error)=>{ setLoading(false)})
  }

  const handlePressCategoryMenu=(id)=>{
    axios.get("/api/category/get/one/"+id)
      .then((res)=>{
        setCategoryId(id);
        setCategoryName(res.data.category);
        setSubCategory(res.data.subCategory);
        if(res.data.subCategory.length>0){
          dispatch(getCategoryWiseList(id,userDetails.user_id ? userDetails.user_id : null));
          navigation.navigate('SubCategoriesComp',{category_ID:id,categoryName:res.data.category})
          let subcatid = [];
          let subcategorys = res.data.subCategory ? res.data.subCategory : [];
            for(var i=0;i<subcategorys.length;i++){
            subcatid.push({
              '_id':  subcategorys[i]._id,
            })
          }
       }else{
           dispatch(getCategoryWiseList(category_ID));
            props.navigation.navigate('SubCategoriesComp',{category_ID:category_ID, categoryName:categoryName})
        }
       })
    .catch((error)=>{})
  }


  const toggle=()=>{
    let isOpen = !isOpen;
    setOpen(isOpen)
  }


  const openControlPanel = () => {
   _drawer.open()
  }

  const _renderlist = ({ item, i })=>{
    return (
     <View key={i} style={[styles.colmwisecat]}>
      <TouchableOpacity onPress={()=>handlePressCategoryMenu(item._id)}>
        <View style={styles.imageMenucatsub} >
          {
            item.categoryImage.length > 0 ?
              <Image
                source={{ uri: item.categoryImage }}
                style={styles.subcatimgbig}
                resizeMode="contain"
              />
            :
              <Image
                source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                style={styles.subcatimgbig}
              />
          }
        </View>
      </TouchableOpacity>
      <View>
        {item.categoryNameRlang ? 
        <Text style={styles.categoryNameRlang}>{item.categoryNameRlang}</Text>:
        <Text style={styles.categoryname}>{item.category}</Text>
        }
      </View>
    </View>
    )
  }
  
    return (
      <React.Fragment>
          <HeaderBar3 
              goBack ={props.navigation.goBack}
              navigate={props.navigation.navigate}
              headerTitle={"Categories"}
              toggle={()=>toggle} 
              // openControlPanel={()=>this.openControlPanel.bind(this)}
          />
          <View style={styles.addsuperparent}>
            <ScrollView contentContainerStyle={{flex:1}} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                  {loading ?
                  <View style={{ flex: 1, alignItems: 'center', justifyContent:"center"}}>
                    <ActivityIndicator size="large" color={colors.theme} />
                    {/* <BouncingPreloader
                        icons={[
                          require("../../AppDesigns/currentApp/images/bellpaper.png"),
                          require("../../AppDesigns/currentApp/images/carrot.png"),
                          require("../../AppDesigns/currentApp/images/mangooo.png"),
                          require("../../AppDesigns/currentApp/images/tomato.png"),
                        ]}
                        leftRotation="-680deg"
                        rightRotation="360deg"
                        speed={2000} /> */}
                  </View>
                  :
                  categories && categories.length > 0 ?
                  <SafeAreaView style={styles.menuWrapper}>
                      <FlatList
                        data={categories}
                        showsVerticalScrollIndicator={false}
                        renderItem={_renderlist} 
                        nestedScrollEnabled={true}
                        numColumns={2}
                        keyExtractor={item => item._id}
                        nestedScrollEnabled
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                        // refreshControl={
                        //     <RefreshControl
                        //       refreshing={this.state.refresh}
                        //       onRefresh={() => this.onRefresh()}
                        //     />
                        // } 
                      /> 
                    </SafeAreaView>
                  :
                  <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                  <Image
                    source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
                  />
                </View>
                  }
              </View>
            </ScrollView>
            <Footer/>
          </View>
        </React.Fragment>
      );  
  }


