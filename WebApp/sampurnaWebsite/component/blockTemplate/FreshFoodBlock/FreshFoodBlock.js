import React, { Component } from 'react';
import axios from 'axios';

import Style from "./FreshFoodBlock.module.css";
// import freshFoodImg1   from "/images/fresh_food_block1.png";
// import bgBorderCenter  from "/images/bg-border-center.png";
// import icon_shipping_1 from "/images/icon-shipping-1.png";
// import icon_shipping_2 from "/images/icon-shipping-2.png";
// import icon_shipping_3 from "/images/icon-shipping-3.png";
// import icon_shipping_4 from "/images/icon-shipping-4.png";
// import bgBorderChoose  from "./images/bg-border_choose.png";

class FreshFoodBlock extends Component{
    constructor(props){
        super(props);
        this.state={
            blocks: {
                "blockTitle": "We are UNICORN FRESH",
                "blockSubTitle": "We are passionate about our work",
                "blockDescription": "Our products are washed with ozonised water which removes fungus,Bacteria, chemicals and colours over it. Then they are packed with proper Hygienic ways.There is no human interference after packing till you unpack At your kitchen. So stop consuming poison, eat sanitized.",
                "blockComponentName": "TemplateOverview",
                "blockType": "",
                "bgImage": "",
                "fgImage": "/images/cms/fresh_food_block1.png",
                "repeatedBlocks": [                                
                    { 
                        Title: "Free Shipping", 
                        SubTitle: "ON ORDER OVER Rs 200", 
                        Image: "/images/icon-shipping-1.png",
                        Link: "", 
                        Description: ""
                    },
                    { 
                        Title: "Contact With Us", 
                        SubTitle: "8686 34 2020 / 8686 64 2020", 
                        Image: "/images/icon-shipping-4.png",
                        Link: "", 
                        Description: ""
                    }
],
                "bgVideo"				: "",
                "fgVideo"				: "",
                "blockGroup"			: "",
                "blockAppearOnPage"		: ""
        },
        blockID:"",
        block_id:""
      };         
    }

    componentDidMount(){
        /*console.log("==>",this.props.block_id);*/
                  {
                     axios
                        .get('/api/blocks/get/'+this.props.block_id)
                        .then((response)=>{
                            if(response.data){
                                // console.log("ListofServices =",response.data);
                              this.setState({
                                  blocks:response.data
                              });
                            }                  
                          })           
                        .catch(function(error){
                          console.log(error);
                      })
                    }
              this.setState({
                        block_id:this.props.block_id
                      });
        }
    
    render(){
        // console.log("Blocks data=====",this.state.blocks);
        return(
            <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.freshFood}>
                <div className="row">
                    {this.state.blocks?
                    <div>
                    <div className={"col-lg-4 col-md-4 col-sm-4 col-xs-12 " +Style.freshfoodImgWrapper}>
                        <img className={"img img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden-table " +Style.freshfoodImg} src={this.state.blocks.fgImage} alt="banner"/>            
                    </div>
                    
                    <div className={"col-lg-8 col-md-8 col-sm-8 col-xs-12 " +Style.freshFoodBlock}>
                        <div className={Style.title_choose +" " +Style.align_center}>
                        
                            <h3 dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle } }></h3>
                            <p dangerouslySetInnerHTML={{ __html: this.state.blocks.blockDescription } }></p>
                        </div>   

                        <div className={Style.align_center +" " +Style.border_choose} style={{background: "url("+"/images/bg-border_choose.png"+")"}}>

                            <div className={Style.images }>
                                <img src="/images/bg-border-center.png" className= "img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12" alt="icon" />
                            </div>
                        </div>

                        <div className={Style.shippingBlock}>
                            {this.state.blocks.repeatedBlocks.length>0?
                                <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12">
                                    {Array.isArray(this.state.blocks.repeatedBlocks) && this.state.blocks.repeatedBlocks.map((repeatedBlock, index) => {
                                        return(
                                            repeatedBlock.Title?
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                                            <div className={Style.border}>
                                                <img src={repeatedBlock.Image} alt="images"/>
                                                <h3>{repeatedBlock.Title}</h3>
                                                <p>{repeatedBlock.SubTitle}</p>
                                            </div>
                                            </div>
                                            :null
                                        )
                                    })
                                    }
                                </div>
                            :null}                            
                        </div>
                    </div>
                    </div>
                    :null
                }
                </div>
            </div>
        )
    }

}

export default FreshFoodBlock;