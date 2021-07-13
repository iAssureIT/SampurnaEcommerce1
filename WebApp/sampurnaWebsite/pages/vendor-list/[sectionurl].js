import React, { Component } from 'react';
import axios                from 'axios';
import Link                 from 'next/link'
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
            axios.post("/api/vendorlist/post/vendor/list",formValues)
            .then((vendorResponse) => {
                if(vendorResponse){
                    // console.log("vendorResponse===",vendorResponse);
                    this.setState({
                        "vendorList" : vendorResponse.data,
                        "loading"    : false
                    });
                }
            })
            .catch((error) => {
                console.log('productwise vendorlist error', error);
            })
        }
      }
    render() {
        return(
            <div className={ Style.bgGray}>
                <Header /> 
                <div className={"col-12 " +Style.bgHeight}>
                    {!this.state.loading
                    ?
                    <div className="col-10 offset-1">
                        <div className="col-12">
                            <div className={" row " }>
                                <div className="col-12">
                                    <div className={"text-center  mt-5 mb2 " +Style.vendorlistTitle}> <h4 className="float-left font-weight-bold">Select Shop</h4></div>
                                </div>
                                { Array.isArray(this.state.vendorList) && this.state.vendorList.length >0?
                                        this.state.vendorList.map((vendordata, index)=>{
                                            return(
                                                <div className="col-6" key={index}>
                                                    <div className={"col-12 card mt-2 mb-4 " +Style.vendorCard}>
                                                    <Link href={"/products/"+vendordata.vendor_ID+"/"+vendordata.vendorLocation_id +"/"+this.state.sectionurl} className={+Style.vedorLink}>
                                                        <div className={"row card-body " +Style.cardBody}>
                                                            <div className={ "col-3 NoPadding "+Style.vendorLogo}>
                                                                {vendordata.vendorLogo?
                                                                <img src={vendordata.vendorLogo} className={"img-thumbnail " +Style.vendorLogoImg}/>
                                                                :
                                                                null}
                                                            </div>   
                                                            <div className={"col-9 "}>
                                                                <div className={"col-12 NoPadding " +Style.vendorName}>{vendordata.vendorName}</div>
                                                                <div className={"col-12 text-right NoPadding " +Style.deliveryTime}>
                                                                    <span className={Style.delTime}>60 &nbsp;min</span>
                                                                    <img src="/images/eCommerce/time.png" className={"img "+Style.timeImg}></img>
                                                                </div>
                                                            </div>
                                                        </div> 
                                                    </ Link >
                                                    </div>
                                                </div>
                                            )
                                        })
                                    :
                                        <div className={"col-8 offset-2 text-center mt-4 " +Style.noVendor}>
                                            <div className="alert alert-warning">
                                                <i className="fa fa-warning"></i> &nbsp;
                                                Vendors are not availabe for this section.
                                            </div>
                                        </div>
                                    }
                            </div>
                        </div>  
                        <div className="col-12">
                            { Array.isArray(this.state.vendorList) && this.state.vendorList.length >10?
                                <div className="col-12">
                                    <div className={"col-12 " +Style.moreBtn}>
                                        <button className={"btn col-1 " +Style.blueBTN}>More</button>
                                    </div>                      
                                </div>
                            :
                                null
                            }  
                        </div>
                    </div>   
                    :
                    <div className="col-2 offset-5 loading">
                        <img src="/images/eCommerce/loader.gif" className="col-12 "></img>
                    </div>
                    }           
                </div>
                <Footer />
            </div>
        )
    }
}
export default VendorList;