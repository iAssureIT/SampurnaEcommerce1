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
                <div className="col-12 subNavBlock d-none d-sm-block">
                    <div className={"col-12 HelpAndSupportWrapper "+Style.HelpAndSupportWrapper}>
                       {this.state.blocks.repeatedBlocks.length>0?
                        <div className={"row HelpAndSupportSubWrapper "+Style.HelpAndSupportSubWrapper}>
                            {Array.isArray(this.state.blocks.repeatedBlocks) && this.state.blocks.repeatedBlocks.map((repeatedBlock, index) => {
                            return(
                                <div className={"col-12 col-xl-3 col-sm-3 " +Style.helpAndSupportBlock} key={index}>
                                <div className={"col-12 servicesBanner "+Style.servicesBanner}>                                        
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
            
        )
    }

}

export default HelpAndSupport;