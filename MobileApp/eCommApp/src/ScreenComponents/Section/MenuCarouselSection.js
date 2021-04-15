// import React                from 'react';
// import {Text,View,TouchableOpacity,Image,} from 'react-native';
// import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
// import ValidationComponent  from "react-native-form-validator";
// import axios                from 'axios';
// export default class MenuCarousel extends ValidationComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sections : [],
//     };
//   }
//   componentDidMount(){
//     var HomePageBanner2_1 = require("../../AppDesigns/currentApp/images/Fruits_blocks.png");
//     var HomePageBanner2_2 = require("../../AppDesigns/currentApp/images/vegetable_blocks.png");
//     var HomePageBanner2_3 = require("../../AppDesigns/currentApp/images/Frozen_items.png")
//     var HomePageBanner2_4 = require("../../AppDesigns/currentApp/images/OrgnicItems.jpg")
    
//     axios.get("/api/sections/get/get_megamenu_list")
//               .then((response)=>{                      
//                 if(response.data){
//                     var sectionDetails = [];
//                     var sectionDetailsArray = response.data;
//                    for(let i=0;i<response.data.length;i++){
//                         if(sectionDetailsArray[i].section === "Vegetables"){
//                             sectionDetails[0] = {
//                                 "section"    : sectionDetailsArray[i].section,
//                                 "sectionId"  : sectionDetailsArray[i]._id,
//                                 "sectionImg" : HomePageBanner2_2,
//                             }                                
//                         }else if(sectionDetailsArray[i].section === "Fruits"){
//                             sectionDetails[1] = {
//                                 "section"    : sectionDetailsArray[i].section,
//                                 "sectionId"  : sectionDetailsArray[i]._id,
//                                 "sectionImg" : HomePageBanner2_1,
//                              }
//                         }else if(sectionDetailsArray[i].section === "Frozen Items"){
//                             sectionDetails[2] = {
//                                 "section"    : sectionDetailsArray[i].section,
//                                 "sectionId"  : sectionDetailsArray[i]._id,
//                                 "sectionImg" : HomePageBanner2_3,
//                             }                       
//                         }else if(sectionDetailsArray[i].section === "Organic Items"){
//                           sectionDetails[3] = {
//                               "section"    : sectionDetailsArray[i].section,
//                               "sectionId"  : sectionDetailsArray[i]._id,
//                               "sectionImg" : HomePageBanner2_4,
//                            }                                  
//                       }                         
//                     }         
//                     this.setState({
//                         sectionDetails  : sectionDetails,                                                                             
//                     });    
//                 }
//               })
//               .catch((error)=>{console.log('error', error);})
// }  
// componentWillReceiveProps(nextProps){
//     this.setState({
//       sections:nextProps.sections
//     },()=>{
      
//     });
// } 
// render() {
//     return (
//       <View>
//         <View>
//           <Text style={styles.title}>List of Sections</Text> 
//         </View>
//         <View  style={styles.proddets}>
//           {
//             this.state.sectionDetails && this.state.sectionDetails.map((data, index) => {                                                               
//                 return (
//                   <View key={index} style={styles.mainrightside}>
//                       <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent',{section_id:data.sectionId})}>
//                           <Image
//                             source={data.sectionImg}
//                             style={styles.sectionImages}
//                           />
//                       </TouchableOpacity>                        
//                   </View>
//                 )
//             })
//           }
//       </View>
//       <View style={styles.menuborderstyle}></View>
//     </View>
//     );
//   }
// }

// ========================= InLIne scroll ====================
import React from 'react';
import {Text,View,TouchableOpacity,Image,ScrollView,ImageBackground} from 'react-native';
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
import ValidationComponent from "react-native-form-validator";
import axios                  from 'axios';
export default class MenuCarousel extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      sections : [],
      noImage  : require('../../AppDesigns/currentApp/images/noimagesection.jpeg')
      // noImage  : require('../../AppDesigns/currentApp/images/2.jpg')

    };
  }
  componentDidMount(){
    axios.get("/api/sections/get/get_megamenu_list")
      .then((response)=>{      
        this.setState({
          sectionDetails  : response.data,                                                                             
        },() =>{
          console.log("sectionDetails",this.state.sectionDetails)
        }
        );                   
      })
      .catch((error)=>{console.log('error in get_megamenu_list', error);})
}  
  componentWillReceiveProps(nextProps){
    this.setState({
      sections:nextProps.sections
    },()=>{
    });
  }
  
  render() {
    // console.log("this.state.sectionDetails===>>",this.state.sectionDetails);
      return (
        <View>
          <View>
            <Text style={styles.title}>List of Sections</Text> 
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
             <View  style={styles.proddets}>
             {
                this.state.sectionDetails && this.state.sectionDetails.map((data, index) => {                                                               
                  console.log("data.sectionImg===>>",data.sectionImage);  
                  return (
                        <View key={index} style={styles.mainrightside}>
                          <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent',{section_id:data._id})}>
                            <ImageBackground onPress={()=>this.props.navigate('CategoriesComponent',{section_id:data._id})} source={data.sectionImage ? {uri : data.sectionImage} : this.state.noImage} style={styles.sectionImages}>
                              <Text style={styles.sectionTitle}>{data.section}</Text>
                            </ImageBackground>
                          </TouchableOpacity>
                          {/* <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent',{section_id:data._id})} style={styles.sectionImages}>
                              <Text style={styles.sectionTitle}>{data.section}</Text>
                              <Image
                                // source={{url:data.sectionImage === undefined ? this.state.noImage : this.state.noImage}}
                                source={this.state.noImage}                                
                                title="abc"
                                // style={styles.sectionImages}
                              /> 
                              <Text style={styles.sectiontitle}>{data.section}</Text>
                          </TouchableOpacity>                         */}
                        </View>
                    )
                })
              }
              </View>
              </ScrollView>
        <View style={styles.menuborderstyle}></View>
    </View>
    
    );
  }
}

// ========================= InLIne scroll ====================




// // import React from 'react';
// // import {
// //   ScrollView,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   ImageBackground,
// //   Image,
// // } from 'react-native';
// // import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
// // import { colors, sizes } from '../../AppDesigns/currentApp/styles/CommonStyles.js';
// // import ValidationComponent from "react-native-form-validator";

// // export default class MenuCarousel extends ValidationComponent {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       sections             : [],
// //     };
// //   }

// //   componentWillReceiveProps(nextProps){
// //     this.setState({
// //       sections:nextProps.sections
// //     },()=>{
      
// //     });
// //   } 
  
  
// //   render() {
// //       // console.log('sections -------------------->', this.state.sections);
// //       return (
// //         <View>
// //           <View>
// //             <Text style={styles.title}>List of Sections</Text> 
// //           </View>
// //           <ScrollView  
// //             // horizontal={true} 
// //             // showsHorizontalScrollIndicator={false} 
// //             >
// //             <View  style={styles.proddets}>
            
// //               {
// //                 // this.state.sections && this.state.sections.length>0?
// //                 this.state.sections.map((item, index)=>{
                  
// //                         return(
// //                           <View  style={styles.mainrightside}>
// //                           <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent',{section_id:item._id})}>
// //                              <View style={styles.imageMenuWraper} >
// //                                   <Image
// //                                     source= {require("../../AppDesigns/currentApp/images/saleimage.png")}
// //                                     style={{ height:80,borderRadius:5,width: 120,}}
// //                                   />
// //                              </View>
// //                              <Text style={{color:'#333',flexShrink:1,textAlign:'center',marginTop:10,fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'}}>{item.section}</Text>
// //                           </TouchableOpacity>
// //                           </View>

                          
// //                         );
                    
// //                 })
// //                 // :
// //                 // null
// //             }
// //             </View>
// //           </ScrollView>
// //           <View style={{borderWidth:1,borderColor:"#f2f2f2",width:"100%",marginVertical:20}}></View>
// //         </View>
    
// //     );
// //   }
// // }



// import React from 'react';
// import {
//   ScrollView,
//   Text,
//   View,
//   TouchableOpacity,
//   ImageBackground,
//   Image,
// } from 'react-native';
// import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
// import { colors, sizes } from '../../AppDesigns/currentApp/styles/CommonStyles.js';
// import ValidationComponent from "react-native-form-validator";
// import axios                  from 'axios';
// // import HomePageBanner2_1 from "../../AppDesigns/currentApp/images/Fruits_blocks.png";
// // import HomePageBanner2_2 from "../../AppDesigns/currentApp/images/vegetable_blocks.png";
// // import HomePageBanner2_3 from "../../AppDesigns/currentApp/images/Frozen_items.png";

// export default class MenuCarousel extends ValidationComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sections             : [],
//     };
//   }
//   componentDidMount(){
//     console.log("HomePageBanner2_3.section==",HomePageBanner2_3);
// var HomePageBanner2_1 = require("../../AppDesigns/currentApp/images/Fruits_blocks.png");
// var HomePageBanner2_2 = require("../../AppDesigns/currentApp/images/vegetable_blocks.png");
// var HomePageBanner2_3 = require("../../AppDesigns/currentApp/images/Frozen_items.png")
//     axios.get("/api/sections/get/get_megamenu_list")
//               .then((response)=>{                      
//                 if(response.data){
//                     var sectionDetails = [];
//                     console.log("Category data=======",response.data); 
//                     var sectionDetailsArray = response.data;
//                    for(let i=0;i<response.data.length;i++){
//                       //  console.log("sectionDetailsArray[i].section==",sectionDetailsArray[i].section);
//                         if(sectionDetailsArray[i].section === "Vegetables"){
//                             sectionDetails[0] = {
//                                 "section"    : sectionDetailsArray[i].section,
//                                 "sectionId"  : sectionDetailsArray[i]._id,
//                                 "sectionImg" : HomePageBanner2_2,
//                                 // "sectionImg" : ["../../AppDesigns/currentApp/images/vegetable_blocks.png"],
//                             }                                
                             
//                         }else if(sectionDetailsArray[i].section === "Fruits"){
//                             sectionDetails[1] = {
//                                 "section"    : sectionDetailsArray[i].section,
//                                 "sectionId"  : sectionDetailsArray[i]._id,
//                                 "sectionImg" : HomePageBanner2_1,
//                                 // "sectionImg" : ["../../AppDesigns/currentApp/images/Fruits_blocks.png"],
//                             }
//                             console.log("sectionDetails===",sectionDetails);
//                         }else if(sectionDetailsArray[i].section === "Frozen Items"){
//                             sectionDetails[2] = {
//                                 "section"    : sectionDetailsArray[i].section,
//                                 "sectionId"  : sectionDetailsArray[i]._id,
//                                 "sectionImg" : HomePageBanner2_3,
//                                 // "sectionImg" : ["../../AppDesigns/currentApp/images/Frozen_items.png"],
//                             }
//                             console.log("sectionDetails===",sectionDetails);
                                                        
//                         }else if(sectionDetailsArray[i].section === "Other Items"){
//                           sectionDetails[3] = {
//                               "section"    : sectionDetailsArray[i].section,
//                               "sectionId"  : sectionDetailsArray[i]._id,
//                               "sectionImg" : HomePageBanner2_1,
//                               // "sectionImg" : ["../../AppDesigns/currentApp/images/Frozen_items.png"],
//                           }
//                           console.log("sectionDetails===",sectionDetails);
                                                      
//                       }                        
//                     }         
//                     // console.log("Array sectionDetails =========",sectionDetails); 
                    
//                     this.setState({
//                         sectionDetails  : sectionDetails,                                                                             
//                     },()=>{
//                         // console.log(" after setstate sectionDetails =========",this.state.sectionDetails); 
//                     });    
                        
                    
//                 }
//               })
//               .catch((error)=>{
//                   console.log('error', error);
//               })
// }  
//   componentWillReceiveProps(nextProps){
//     this.setState({
//       sections:nextProps.sections
//     },()=>{
      
//     });
//   } 
  
  
//   render() {
      
//       return (
//         <View>
//           <View>
//             <Text style={styles.title}>List of Sections</Text> 
//           </View>
//           {/* <ScrollView 
//             // <View  style={styles.proddets}>horizontal={true} 
//             showsHorizontalScrollIndicator={false} > */}
//             <View  style={styles.proddets}>
//               {/* {this.state.sections && this.state.sections.length>0?
//                 this.state.sections.map((item, index)=>{
//                     if(this.state.sections.length == index + 1){
//                         return(
//                           <View  style={styles.mainrightside}>
//                           <TouchableOpacity onPress={()=>this.props.navigation.navigate('CategoriesComponent',{section_id:item._id})}>
//                              <View style={styles.imageMenuWraper} >
//                                   <Image
//                                     source={{uri:item.categoryImage}}
//                                     style={{ height:80,borderRadius:5,width: 120,}}
//                                   />
//                              </View>
//                              <Text style={{color:'#333',flexShrink:1,textAlign:'center',marginTop:10,fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'}}>{item.section}</Text>
//                           </TouchableOpacity>
//                           </View>

//                         );
//                     }else{
//                         return(
//                           <View  style={styles.mainrightside}>
//                           <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent',{section_id:item._id})}>
//                              <View style={styles.imageMenuWraper} >
//                                   <Image
//                                     source= {require("../../AppDesigns/currentApp/images/saleimage.png")}
//                                     style={{ height:80,borderRadius:5,width: 120,}}
//                                   />
//                              </View>
//                              <Text style={{color:'#333',flexShrink:1,textAlign:'center',marginTop:10,fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'}}>{item.section}</Text>
//                           </TouchableOpacity>
//                           </View>

//                         );
//                     }
//                 })
//                 :
//                 null
//             } */}
//             {/* {console.log('sections sectionImg -------------------->', this.state.sectionDetails)} */}
//              {
//                 this.state.sectionDetails && this.state.sectionDetails.map((data, index) => {                                                               
//                     // console.log('data.sectionImg-------------------->', data.sectionImg);
//                     return (
//                       <View key={index} style={styles.mainrightside}>
//                             <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent',{section_id:data.sectionId})}>
//                                 {/* {data.sectionImg[0] ? */}
//                                       <Image
//                                         source={data.sectionImg}
//                                         style={{ height:100,borderRadius:5,width: "100%",borderWidth:1,borderColor:'#999',alignItems:'flex-end'}}
//                                       />  
//                                     {/* :
//                                       <Image
//                                         source= {require("../../AppDesigns/currentApp/images/vegetable_blocks.png")}
//                                         style={{ height:100,borderRadius:5,width: "100%",borderWidth:1,borderColor:'#999',alignItems:'flex-end'}}
//                                       />  
//                                 } */}
//                                 <Text style={{color:'#333',flexShrink:1,textAlign:'center',marginTop:10,fontSize:13,fontFamily:"Montserrat-SemiBold",flexWrap: 'wrap'}}>{data.section}</Text>
//                             </TouchableOpacity>                        
//                         </View>
//                     )
//                 })
//               }
//           </View>
//         {/* </ScrollView> */}
//         <View style={{borderWidth:1,borderColor:"#f2f2f2",width:"100%",marginVertical:20}}></View>
//     </View>
    
//     );
//   }
// }
