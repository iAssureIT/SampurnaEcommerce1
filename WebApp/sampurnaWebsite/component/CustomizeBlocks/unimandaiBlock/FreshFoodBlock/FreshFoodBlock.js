import React, { Component } from 'react';

import "../../../../sites/currentSite/blocks/FreshFoodBlock.css";
import freshFoodImg1   from "../../../../sites/currentSite/images/fresh_food_block1.png";
// import freshFoodImg1   from "../../../../sites/currentSite/images/we_are_fresh_food_block.png"; 
import bgBorderCenter  from "../../../../sites/currentSite/images/bg-border-center.png";
import icon_shipping_1 from "../../../../sites/currentSite/images/icon-shipping-1.png";
import icon_shipping_2 from "../../../../sites/currentSite/images/icon-shipping-2.png";
import icon_shipping_3 from "../../../../sites/currentSite/images/icon-shipping-3.png";
import icon_shipping_4 from "../../../../sites/currentSite/images/icon-shipping-4.png";
import bgBorderChoose  from "../../../../sites/currentSite/images/bg-border-choose.png";

class FreshFoodBlock extends Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 freshFood">
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 freshfoodImgWrapper">
                        <img className="img img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden-table freshfoodImg" src={freshFoodImg1} alt="banner"/>            
                    </div>
                    
                    <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12 freshFoodBlock">
                        <div className="title-choose align-center">
                            <h3><span>We are </span>UNICORN FRESH</h3>
                            <p>Our products are washed with ozonised water which removes fungus,
                                Bacteria, chemicals and colours over it. Then they are packed with proper
                                Hygienic ways. There is no human interference after packing till you unpack
                                At your kitchen. So stop consuming poison, eat sanitized.</p>
                        </div>   

                        <div className="align-center border-choose" style={{background: "url("+bgBorderChoose +")"}}>

                            <div className="images ">
                                <img src={bgBorderCenter} className= "img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12" alt="icon" />
                            </div>
                        </div>

                        <div className="shippingBlock">
                            
                            <div className="col-lg-3 col-md-3 col-sm-5 hidden-sm col-xs-6 hidden-xs">
                                {/* <div className="border">
                                    <img src={icon_shipping_2} alt="images"/>
                                    <h3>Support</h3>
                                    <p>LIFE TIME SUPPORT 24/7</p>
                                </div> */}
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                <div className="border">
                                    <img src={icon_shipping_1} alt="images"/>
                                    <h3>Free Shipping</h3>
                                    <p>ON ORDER OVER <span>&#x20B9;</span> 200</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                <div className="border">
                                    <img src={icon_shipping_4} alt="images"/>
                                    <h3>Contact With Us</h3>
                                    <p>8686 34 2020 / 8686 64 2020</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 hidden-sm col-xs-6 hidden-xs">
                                {/* <div className="border">
                                    <img src={icon_shipping_3} alt="images"/>
                                    <h3>Help Partner</h3>
                                    <p>HELP ALL ASPECTS</p>
                                </div> */}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default FreshFoodBlock;