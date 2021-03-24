import React, { Component } from 'react';
import axios from 'axios';   
import Style from './HelpAndSupport.module.css';
import Image from 'next/image';

class HelpAndSupport extends Component{
    constructor(props){
        super(props);
        this.state={
            blocks: {
                "blockType": "",
                "repeatedBlocks": [                                
                    { 
                        Title: "Free Shipping", 
                        SubTitle: "Free Shipping World Wide",
                        Image : "/images/eCommerce/redIcon1.png"                 
                    },
                    { 
                        Title: "Money Back Guarantee", 
                        SubTitle: "100% Money Back Guarantee",
                        Image : "/images/eCommerce/redIcon2.png"
                    },
                    { 
                        Title: "Help & Support", 
                        SubTitle: "Call Us : + 0123 456 789",
                        Image : "/images/eCommerce/redIcon3.png"  
                    },
                    { 
                        Title: "Online Payment", 
                        SubTitle: "Contrary To Popular Belief",
                        Image : "/images/eCommerce/redIcon4.png"
                    },
                ],
        },
        blockID:"",
        block_id:""
      };         
    }

    componentDidMount(){
        // console.log("this.props.block_id===",this.props.block_id);
        if(this.props.block_id !== undefined){
            axios.get('/api/blocks/get/'+this.props.block_id)
            .then((response)=>{
                    if(response.data){
                        this.setState({
                            blocks:response.data
                        });
                    }                  
            })
            .catch(function(error){ console.log(error);})
            
            this.setState({
                block_id:this.props.block_id
            });
        }
        }
    
    render(){
        // console.log("Blocks data=====",this.state.blocks);
        return(
            <div className="row hidden-xs" >
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subNavBlock">
                    <div className={"col-md-12 col-lg-12 col-sm-12 col-xs-12 HelpAndSupportWrapper "+Style.HelpAndSupportWrapper}>
                       {this.state.blocks.repeatedBlocks.length>0?
                        <div className={"col-md-12 col-lg-12 col-sm-12 col-xs-12 HelpAndSupportSubWrapper "+Style.HelpAndSupportSubWrapper}>
                            {Array.isArray(this.state.blocks.repeatedBlocks) && this.state.blocks.repeatedBlocks.map((repeatedBlock, index) => {
                            return(
                                <div className={"col-md-3 col-lg-3 col-sm-6 col-xs-12 " +Style.helpAndSupportBlock} key={index}>
                                <div className={"col-md-12 col-lg-12 col-sm-12 col-xs-12 servicesBanner "+Style.servicesBanner}>
                                        {/* <img className={"img-fluid lazyloaded servicesBannerImg "+Style.servicesBannerImg} src={repeatedBlock.Image} alt="free shipping"
                                            // onMouseOver={e => (e.currentTarget.src  ='http://cdn.shopify.com/s/files/1/0319/5758/1961/files/1_2831cd27-043f-4970-9453-a4cf98321c18.png?v=1580728745')}
                                            // onMouseOut={e => (e.currentTarget.src = 'http://cdn.shopify.com/s/files/1/0319/5758/1961/files/1_92aa72fc-c987-4611-af05-b03bbbb708b4.png?v=1580725311')}                     
                                        /> */}
                                        <Image
                                            src={repeatedBlock.Image}
                                            className={"img-fluid lazyloaded servicesBannerImg "+Style.servicesBannerImg}
                                            height ={40}
                                            width={40}
                                        />
                                        <h4 className="fontBold globalblockreptedtitlefontsize"><b>{repeatedBlock.Title}</b></h4>
                                        <p className="lang_trans" data-trans="#service1_1580559973813-0_services_desc">{repeatedBlock.SubTitle}</p>
                                </div>
                                </div>
                            )
                            })
                        }   
                        </div>
                        : null }
                    </div>
                </div>
            </div>
        )
    }

}

export default HelpAndSupport;