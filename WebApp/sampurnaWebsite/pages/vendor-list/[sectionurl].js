import React, { Component } from 'react';
import axios                from 'axios';
import Link                 from 'next/link'
import $                    from 'jquery';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Style                from "./vendor-list.module.css";

class VendorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "loading"      : true,
            "vendorList"   :[],
        };
      }
      
    componentDidMount() {
        $(window).scroll(function() {
            var topPos = $(this).scrollTop();
            if (topPos>148){
                // console.log("$(this).scrollTop()==",$(this).scrollTop());
                $(".deliveryTimeStrip").css({"position": "relative",
                "top": topPos});
            }else{
                // console.log("$(this).scrollTop()==",$(this).scrollTop());
                $(".deliveryTimeStrip").css({"position": "relative",
                "top": 0});
            }
        });
        
        var url = window.location.href.split('/');
        const sectionurl = url[4];
        if(sectionurl){
            this.setState({
                "sectionurl" :sectionurl,
            })
        }
        var formValues={};
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));  
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionurl,
                    "latitude"   : sampurnaWebsiteDetails.deliveryLocation.latitude,
                    "longitude"  : sampurnaWebsiteDetails.deliveryLocation.longitude
                }
            }else{
                formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionurl,
                    "latitude"   : "",
                    "longitude"  : ""
                }
            }
        }
        
        if(formValues){
            // console.log(formValues);
            axios.post("/api/vendorlist/post/vendor/list",formValues)
            .then((vendorResponse) => {
                if(vendorResponse){
                    var windowWidth    = window.screen.width;
                    var bgImgHeight = vendorResponse.data.length/3 * 180 + 500;

                    if(windowWidth > 1600){
                        if(bgImgHeight<600){ bgImgHeight = 600; }
                    }else{ 
                        if(bgImgHeight<500){ bgImgHeight = 500; }
                    }

                    

                    this.setState({
                        "vendorList" : vendorResponse.data,
                        "bgImgHeight" : bgImgHeight,
                        "loading"    : false
                    });
                }
            })
            .catch((error) => {
                console.log('productwise vendorlist error', error);
            })
        }
    }

    showMoreVendor(event){
          event.preventDefault();
    }

    render() {
        return(
            <div className={"container-fluid " +Style.bgGray}>
                <div className="row">
                <Header /> 

                <div className={"col-12 NoPadding " +Style.bgHeight} style={{ height: this.state.bgImgHeight }}>                      
                    <div className={Style.blur} style={{ height: this.state.bgImgHeight }}>                      
                        <div className={"col-12 NoPadding "+Style.vendorList} >
                            <div  className={"col-12 myDiv h-100 bg-success deliveryTimeStrip "+Style.deliveryTimeWrapper}>
                                <div className="col-12 text-center">
                                    <p className={"col-12 "+Style.deliveryTimeWrapperDesc}>
                                        Delivery time&nbsp;
                                        <span className={" "+Style.deliveryTimeWrapperDesc1}>9</span>am to <span className={" "+Style.deliveryTimeWrapperDesc2}>11</span>pm or next day delivery
                                    </p>
                                </div>
                            </div>

                            {!this.state.loading
                             ?
                                <div className={"col-12"}>
                                    <div className="row">
                                        <div className={"col-12 " +Style.vendorlistTitle}> 
                                            List of shop
                                        </div>

                                        <div className={"mx-auto "+Style.vendorlistWrapper} >
                                                { Array.isArray(this.state.vendorList) && this.state.vendorList.length >0
                                                ?
                                                    this.state.vendorList.map((vendordata, index)=>{
                                                        if((index+1)%3 === 1){
                                                            var spCls = Style.firstElem;
                                                        }else if((index+1)%3 === 2){
                                                            var spCls = Style.middleElem;
                                                        }else{
                                                            var spCls = Style.lastElem;
                                                        }
                                                        var VendorImage = { backgroundImage: "url(" + vendordata.vendorShopImage + ")" };
                                                        return(
                                                            <div className={"card "+Style.vendorCard+" "+spCls } style={VendorImage} key={index}>
                                                                <Link href={"/products/"+vendordata.vendor_ID+"/"+vendordata.vendorLocation_id +"/"+this.state.sectionurl} className={+Style.vedorLink}>
                                                                    <div className={Style.cardBody}>
                                                                        <div className={Style.vendorLogoWrapper}>
                                                                            {
                                                                                vendordata.vendorLogo
                                                                            ?
                                                                                <img src={vendordata.vendorLogo} className={Style.vendorLogoImg}/>
                                                                            :
                                                                                null
                                                                            }
                                                                        </div>
                                                                        <div className={Style.vendorName}>
                                                                            {vendordata.vendorName}
                                                                        </div>
                                                                    </div> 
                                                                </ Link >
                                                            </div>                                                        
                                                        )
                                                    })
                                                :
                                                    <div className={"col-8 mx-auto " +Style.noVendor}>
                                                        <div className="alert alert-warning">
                                                            <i className="fa fa-warning"></i> &nbsp;
                                                            We are currently not working in your area. However, we will come there soon. So please visit this website again shortly.
                                                        </div>
                                                    </div>
                                                } 
                                        </div>  
                                    </div>
                                </div>   
                            :
                                <div className="col-2 offset-5 loading">
                                    <img src="/images/eCommerce/loader.gif" className="col-12 "></img>
                                </div>
                            }     
                        </div>
                    </div>
                </div>      

                <Footer />
                </div>
            </div>
        )
    }
}




export default VendorList;




