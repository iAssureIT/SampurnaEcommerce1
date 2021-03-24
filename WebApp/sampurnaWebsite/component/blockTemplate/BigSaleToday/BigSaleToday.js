import React, { Component } from 'react';
import  Style from "./BigSaleToday.module.css";
import axios from 'axios';


export default class BigSaleToday extends Component {
    constructor(props){
        super(props);
        this.state={
            blocks: {
                "blockTitle": "Big Sale Today",
                "blockSubTitle": "",
                "blockDescription": "",
                "blockComponentName": "TemplateOverview",
                "blockType": "",
                "bgImage": "/images/cms/BigSaleTodayImg.png",
                "fgImage": "/images/cms/icon-shipping-6.png",
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
   
    
  render() { 
        return ( 
        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 "  +Style.NOpadding  +" " +Style.bigSaleWrapper} style={{"background":"url("+this.state.blocks.bgImage+")"}}>
            <div className={" col-lg-8 col-md-8 col-sm-10 col-xs-12 pull-right " +Style.block +" " +Style.newBlock}>           
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pull-right">
                <div className={Style.flatSaleBlock +" col-lg-12 col-md-12 col-sm-12 col-xs-12"}><span><img src={this.state.blocks.fgImage} className={Style.imageposition}/></span>&nbsp;&nbsp;{this.state.blocks.blockTitle} <span className={Style.OffBlock}></span> </div>
                <a href="/deals-of-the-day" className="col-lg-6 col-md-6 col-sm-12 col-xs-12 "><div className={"col-lg-4 col-md-4 col-sm-5 col-xs-5 btn "  +Style.shopNow} title="">SHOP NOW</div></a>
            </div>
          </div>  
        </div>  
        );
    }
}
