import React from 'react';
import {
  ScrollView,
  Text,
  View,Alert,
  TouchableOpacity,
  Image,ActivityIndicator,
} from 'react-native';
import HeaderBar3 from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import Notification from '../../ScreenComponents/Notification/Notification.js'
import BouncingPreloader from 'react-native-bouncing-preloader';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import {colors} from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import axios                      from 'axios';

export default class CategoriesComponent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      	inputFocusColor      : colors.textLight,
      	isOpen               : false,  
        categoriesImg        : [], 
      	categories           : [],
        subCategory          : [],
        categoryImage        : [],
        section_id           : '',
        showView             : false,
        subCategoryTitle     : '',
        subCategory_ID       : '',
        categoryUrl          : ''

    };
  }
  componentDidMount(){
     const section_id = this.props.navigation.getParam('section_id','No section_id');
      this.setState({
        section_id: section_id,
        },()=>{
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
          this.getCategories();
        })
      })
  }
  
  componentWillUnmount () {
    this.focusListener.remove()
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    this.getCategories();
  }

  getCategories(){
    axios.get("/api/category/get/list/"+this.state.section_id)
    .then((response)=>{
      // console.log('response.data categoriesId ================>', response.data );
      this.setState({
        categories  : response.data,
        
      })
    })
    .catch((error)=>{})
  }

  handlePressCategoryMenu(id){
    axios.get("/api/category/get/one/"+id)
      .then((res)=>{
        console.log('subcategorys Before for=======>', res.data);
      this.setState({
        showView       : true,
        category_ID    : id,
        categoryName   : res.data.category,
        subCategory    : res.data.subCategory,
      },()=>{
        // console.log('subcategorys Before for=======>', this.state.subCategory);
        if(this.state.subCategory.length>0){
          this.props.navigation.navigate('SubCategoriesComp',{category_ID:this.state.category_ID,categoryName:this.state.categoryName})
          let subcatid = [];
          let subcategorys = this.state.subCategory ? this.state.subCategory : [];
          // console.log('subcategorys Before for=======>', subcategorys);
            for(var i=0;i<subcategorys.length;i++){
            subcatid.push({
              '_id':  subcategorys[i]._id,
            })
          }
       }else{
        this.props.navigation.navigate('SubCategoriesComp',{category_ID:this.state.category_ID, categoryName:this.state.categoryName})

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
    })
    .catch((error)=>{})
  }
  componentWillReceiveProps(nextProps){
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  toggle() {
    let isOpen = !this.state.isOpen;
      this.setState({
        isOpen
      });
  }

  closeControlPanel = () => {
    this._drawer.close()
  }

  openControlPanel = () => {
    this._drawer.open()
  }

  searchUpdated(text){
    this.setState({ searchText: text });
  }

  render(){
    const {navigate,goBack} = this.props.navigation;
    if(this.props.loading){
      return(
        <Loading />
      );
    }else{
      return (
        <React.Fragment>
            <HeaderBar3 
                goBack ={goBack}
            	  navigate={navigate}
                // headerTitle={"Category & SubCategory"}
                headerTitle={"Categories"}
              	toggle={()=>this.toggle.bind(this)} 
              	openControlPanel={()=>this.openControlPanel.bind(this)}
            />
            <View style={styles.addsuperparent}>
            	<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              		<View  style={styles.formWrapper}>
               			<ScrollView >
               				<View style={styles.menuWrapper}>
                      {this.state.categories ?
                        this.state.categories.length > 0 ?
                        this.state.categories.map((item,index)=>{
                          if (index < 8 ) {
                          return(
                          <View key={index} style={styles.colmwisecat}>
                            <TouchableOpacity onPress={()=>this.handlePressCategoryMenu(item._id)}>
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
                          <ActivityIndicator size="large" color="#ed3c55" />
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
}



