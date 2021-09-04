import React, { Component } from 'react';
import "./BigSaleToday.css";
import axios from 'axios';

// import saleimage        from "../../../sites/currentSite/images/BigSaleToday.png";
// import icon_shipping_5  from "../../../sites/currentSite/images/icon-shipping-6.png";

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
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 abc NOpadding bigSaleWrapper" style={{"background":"url("+this.state.blocks.bgImage+")"}}>
            <div className=" col-lg-8 col-md-8 col-sm-10 col-xs-12 pull-right block newBlock">           
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pull-right">
                <div className="flatSaleBlock col-lg-12 col-md-12 col-sm-12 col-xs-12"><span><img src={this.state.blocks.fgImage} className="imageposition"/></span>&nbsp;&nbsp;{this.state.blocks.blockTitle} <span className="OffBlock"></span> </div>
                <a href="/deals-of-the-day"><div className="col-lg-3 col-lg-offset-5 col-md-3 col-md-offset-5 col-sm-4 col-offset-7 col-xs-4 col-xs-offset-7  btn shopNow" title="">SHOP NOW</div></a>
            </div>
          </div>  
        </div>
            
        );
    }
}
