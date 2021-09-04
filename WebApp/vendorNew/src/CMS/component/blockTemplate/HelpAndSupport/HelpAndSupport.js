import React, { Component } from 'react';
import axios from 'axios';   
import './HelpAndSupport.css';
// import { image } from 'html2canvas/dist/types/css/types/image';

class HelpAndSupport extends Component{
    constructor(props){
        super(props);
        this.state={
            blocks: {
                "blockType": "",
                "repeatedBlocks": [                                
                    { 
                        Title: "Free Shipping 1", 
                        SubTitle: "Free Shipping World Wide",
                        Image : "/images/deliveryTruck.png"                 
                    },
                    { 
                        Title: "Money Back Guarantee", 
                        SubTitle: "100% Money Back Guarante",
                        Image : "/images/calender.png"
                    },
                    { 
                        Title: "Help & Support", 
                        SubTitle: "Call Us : + 0123 456 789",
                        Image : "/images/telephone.png"  
                    },
                    { 
                        Title: "Online Payment", 
                        SubTitle: "Contry To Popular Belief",
                        Image : "/images/pocket.png"
                    },
                ],
        },
        blockID:"",
        block_id:""
      };         
    }

    componentDidMount(){
            axios.get('/api/blocks/get/'+this.props.block_id)
            .then((response)=>{
                    if(response.data){
                        this.setState({
                            blocks:response.data
                        });
                    }                  
            }).catch(function(error){ console.log(error);})
            this.setState({
                block_id:this.props.block_id
            });
        }
    
    render(){
        console.log("Blocks data=====",this.state.blocks);
        return(
            <div className="row" >
                <div className="col-lg-12 subNavBlock">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 HelpAndSupportWrapper">
                       {this.state.blocks.repeatedBlocks.length>0?
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 HelpAndSupportSubWrapper">
                            {Array.isArray(this.state.blocks.repeatedBlocks) && this.state.blocks.repeatedBlocks.map((repeatedBlock, index) => {
                            return(
                                <div className="col-md-3 col-lg-3 col-sm-6 col-xs-6 servicesBanner" >
                                        <img className="img-fluid lazyloaded servicesBannerImg" src={repeatedBlock.Image} alt="free shipping"
                                            // onMouseOver={e => (e.currentTarget.src  ='http://cdn.shopify.com/s/files/1/0319/5758/1961/files/1_2831cd27-043f-4970-9453-a4cf98321c18.png?v=1580728745')}
                                            // onMouseOut={e => (e.currentTarget.src = 'http://cdn.shopify.com/s/files/1/0319/5758/1961/files/1_92aa72fc-c987-4611-af05-b03bbbb708b4.png?v=1580725311')}                     
                                        />
                                        <h4 className="fontBold globalblockreptedtitlefontsize"><b>{repeatedBlock.Title}</b></h4>
                                        <p className="lang_trans" data-trans="#service1_1580559973813-0_services_desc">{repeatedBlock.SubTitle}</p>
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