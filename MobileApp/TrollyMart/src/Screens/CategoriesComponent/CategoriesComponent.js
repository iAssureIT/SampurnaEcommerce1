import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,Alert,
  TouchableOpacity,
  Image,ActivityIndicator,
} from 'react-native';
import HeaderBar3         from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}           from '../../ScreenComponents/Footer/Footer1.js';
import Notification       from '../../ScreenComponents/Notification/Notification.js'
import BouncingPreloader  from 'react-native-bouncing-preloader';
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import {colors}           from '../../AppDesigns/currentApp/styles/styles.js';
import Loading            from '../../ScreenComponents/Loading/Loading.js';
import axios              from 'axios';

export const CategoriesComponent=(props)=>{
  console.log("props",props);
  const {navigation,route}=props;
  const [isOpen,setOpen] =useState(false);
  const [categories,setCategories] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [category_ID,setCategoryId] = useState('');
  const [categoryName,setCategoryName] = useState('');
  const {section_id}=route.params;
  useEffect(() => {
    console.log("useEffect");
     getCategories(section_id);
  },[section_id]);


  const getCategories=(section_id)=>{
    axios.get("/api/category/get/list/"+section_id)
    .then((response)=>{
      setCategories(response.data);
    })
    .catch((error)=>{})
  }

  const handlePressCategoryMenu=(id)=>{
    axios.get("/api/category/get/one/"+id)
      .then((res)=>{
        setCategoryId(id);
        setCategoryName(res.data.category);
        setSubCategory(res.data.subCategory);
        if(res.data.subCategory.length>0){
          this.props.navigation.navigate('SubCategoriesComp',{category_ID:id,categoryName:res.data.category})
          let subcatid = [];
          let subcategorys = res.data.subCategory ? res.data.subCategory : [];
          // console.log('subcategorys Before for=======>', subcategorys);
            for(var i=0;i<subcategorys.length;i++){
            subcatid.push({
              '_id':  subcategorys[i]._id,
            })
          }
       }else{
        props.navigation.navigate('SubCategoriesComp',{category_ID:this.state.category_ID, categoryName:this.state.categoryName})

        //   Alert.alert(
        //     "Category Not Found",
        //     "",
        //     [
        //       { text: "OK", onPress: () => console.log("OK Pressed") }
        //     ],
        //     { cancelable: false }
        //   );
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


    if(props.loading){
      return(
        <Loading />
      );
    }else{
      return (
        <React.Fragment>
            <HeaderBar3 
                goBack ={props.navigation.goBack}
            	  navigate={props.navigation.navigate}
                // headerTitle={"Category & SubCategory"}
                headerTitle={"Categories"}
              	toggle={()=>toggle} 
              	// openControlPanel={()=>this.openControlPanel.bind(this)}
            />
            <View style={styles.addsuperparent}>
            	<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              		<View  style={styles.formWrapper}>
               			<ScrollView >
               				<View style={styles.menuWrapper}>
                      {categories ?
                        categories.length > 0 ?
                        categories.map((item,index)=>{
                          if (index < 8 ) {
                          return(
                          <View key={index} style={styles.colmwisecat}>
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
                          
                        )}
                      })
                      :
                   
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
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
                      <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                      <Image
                        source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
                      />
                    </View>
                    }
                     
                    </View>
                  
          				</ScrollView>
                  </View>
              </ScrollView>
              <Footer/>
            </View>
          </React.Fragment>
      );  
    }
  }


