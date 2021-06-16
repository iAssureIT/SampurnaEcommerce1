
import React, { useState,useEffect } from 'react';
import axios                from 'axios';
import Link                 from 'next/link'
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import { components }       from 'react-select';
import Style                from "./vendor-list.module.css";
import { useRouter }        from 'next/router';

const VendorList = ()=> {
    const [vendorList,setVendorList] = useState([]);
    const [categoryList,setCategoryList] = useState([]);
    const router = useRouter();
    const {sectionUrl} = router.query
    console.log("useRouter",router.query);
    useEffect(()=>{
        var url = window.location.href.split('/');
        console.log("url==",url);
        var productID = url[4];
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));  
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionUrl,
                    "latitude"   : sampurnaWebsiteDetails.deliveryLocation.latitude,
                    "longitude"  : sampurnaWebsiteDetails.deliveryLocation.longitude,
                    "productID"  : productID,
                }
            }else{
                var formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionUrl,
                    "latitude"   : "",
                    "longitude"  : "",
                    "productID"  : productID,
                }
            }
        }
        // console.log("vendor list FormValues=>",formValues);
        axios.post("/api/hometovendorlist/post/vendor/list",formValues)
			.then((vendorResponse) => {
                if(vendorResponse){
                    // console.log("vendorResponse=>",vendorResponse);
                    setVendorList(vendorResponse.data)
                }
			})
			.catch((error) => {
				console.log('vendorlist error', error);
			})
    },[sectionUrl])
        return(
            <section className={ Style.bgGray}>
                <Header />    
                <div className="container">
                    <div className="col-12">
                    <div className={" row " +Style.bgGray}>
                        <div className="col-12">
                            <div className={"col-12 text-center  mt2 mb2 " +Style.vendorlistTitle}> <h6>Select Shop</h6></div>
                        </div>
                           { Array.isArray(vendorList) && vendorList.length >0?
                                vendorList.map((vendordata, index)=>{
                                    // console.log("vendorList===",vendorList);
                                    return(
                                        <div className="col-6" key={index}>
                                            <div className={"col-12 card mt-4 " +Style.vendorCard}>
                                            <Link href={"/products/"+vendordata.vendor_ID+"/"+vendordata.vendorLocation_id +"/"+sectionUrl} className={+Style.vedorLink}>
                                                {/* <Link href={"/products/"+vendordata.vendor_ID +"/"+sectionUrl} className={+Style.vedorLink}> */}
                                                    <div className={"row card-body " +Style.cardBody}>
                                                        <div className={ "col-3 NoPadding "+Style.vendorLogo}>
                                                            {vendordata.vendorLogo?
                                                            <img src={vendordata.vendorLogo} className={"img-thumbnail " +Style.vendorLogoImg}/>
                                                            :
                                                            null}
                                                        </div>   
                                                        <div className={"col-9 "}>
                                                            <div className={"col-12 " +Style.vendorName}>{vendordata.vendorName}</div>
                                                            <div className={"col-12 text-right NoPadding " +Style.deliveryTime}>
                                                                <span className={Style.delTime}>{vendordata.expectedDiliveryTime>0?vendordata.expectedDiliveryTime:0} &nbsp;min</span>
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
                                        Vendors are not availabe for this product.
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                < Footer />
            </section>
        )
}

export default VendorList;