import React, { Component } from 'react';
import "../../../../sites/currentSite/blocks/HomePageBanner2.css";
import axios from 'axios';

// import HomePageBanner2_1 from "../../../../sites/currentSite/images/vegetables1.jpeg"
// import HomePageBanner2_2 from "../../../../sites/currentSite/images/Fruits1.jpg"


import HomePageBanner2_1 from "../../../../sites/currentSite/images/vegetable blocks.png";
import HomePageBanner2_2 from "../../../../sites/currentSite/images/Fruits_blocks.png";
import HomePageBanner2_3 from "../../../../sites/currentSite/images/Frozen_items.png";
// import HomePageBanner2_4 from "../../../../sites/currentSite/images/unimandaiOtherItemBlocks.png";
import HomePageBanner2_4 from "../../../../sites/currentSite/images/Grocery_Block.png";

class HomePageBanner2 extends Component{
    constructor(props){
        super(props);
        this.state={
            sectionDetails : [],
        }
    }
    componentWillMount(){

    }
    componentDidMount(){
        // axios.get('/api/sections/get/list-with-limits/' + this.state.startRange + '/' + this.state.limitRange)
        //         .then((response)=>{                              
        //                 this.setState({
        //                         sectionDetails  : response.data,                                                                             
        //                     },()=>{
        //                         // console.log(" after setstate sectionDetails =========",this.state.sectionDetails); 
        //                     });    
        //                 })
        //         .catch((error)=>{
        //             console.log('error', error);
        //         })
        axios.get("/api/sections/get/get_megamenu_list")
                  .then((response)=>{                      
                    if(response.data){
                        var sectionDetails = [];
                        // console.log("Category data=======",response.data); 
                        var sectionDetailsArray = response.data;
                       for(let i=0;i<response.data.length;i++){
                        //    console.log("sectionDetailsArray[i].section==",sectionDetailsArray[i].section);
                            if(sectionDetailsArray[i].section === "Vegetables"){
                                sectionDetails[0] = {
                                    "section"    : sectionDetailsArray[i].section,
                                    "sectionId"  : sectionDetailsArray[i]._id,
                                    "sectionImg" : HomePageBanner2_1,
                                }                                
                                 
                            }else if(sectionDetailsArray[i].section === "Fruits"){
                                sectionDetails[1] = {
                                    "section"    : sectionDetailsArray[i].section,
                                    "sectionId"  : sectionDetailsArray[i]._id,
                                    "sectionImg" : HomePageBanner2_2,
                                }
                                // console.log("sectionDetails===",sectionDetails);
                            }else if(sectionDetailsArray[i].section === "Frozen Items"){
                                sectionDetails[2] = {
                                    "section"    : sectionDetailsArray[i].section,
                                    "sectionId"  : sectionDetailsArray[i]._id,
                                    "sectionImg" : HomePageBanner2_3,
                                }
                                // console.log("sectionDetails===",sectionDetails);
                                                            
                            }else if(sectionDetailsArray[i].section === "Other Items" || sectionDetailsArray[i].section === "Grocery"){
                                sectionDetails[3] = {
                                    "section"    : sectionDetailsArray[i].section,
                                    "sectionId"  : sectionDetailsArray[i]._id,
                                    "sectionImg" : HomePageBanner2_4,
                                }
                                // console.log("sectionDetails===",sectionDetails);
                                                            
                            }                            
                        }         
                        // console.log("Array sectionDetails =========",sectionDetails); 
                        
                        this.setState({
                            sectionDetails  : sectionDetails,                                                                             
                        },()=>{
                            // console.log(" after setstate sectionDetails =========",this.state.sectionDetails); 
                        });    
                            
                        
                    }
                  })
                  .catch((error)=>{
                      console.log('error', error);
                  })
      }  
    render(){
        return(
            
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 HomePageBanner2">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="row">
                        {
                            Array.isArray(this.state.sectionDetails) && this.state.sectionDetails.map((data, index) => {                                                               
                                return (
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 imageBlock" key={index}>
                                        <a className="hover-images col-lg-12 col-md-12 col-sm-12 col-xs-12" href={"/section/"+data.section+"/"+data.sectionId} >                                                              
                                            <img className="img-responsive zoomImg" src={data.sectionImg} alt="banner" />                                            
                                        </a>                        
                                    </div>
                                )
                            })
                        
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default HomePageBanner2;