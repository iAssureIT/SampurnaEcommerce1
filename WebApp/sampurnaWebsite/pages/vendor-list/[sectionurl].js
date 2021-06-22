
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
    const {sectionurl} = router.query
    // console.log("useRouter",router.query);
    useEffect(()=>{
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));  
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionurl,
                    "latitude"   : sampurnaWebsiteDetails.deliveryLocation.latitude,
                    "longitude"  : sampurnaWebsiteDetails.deliveryLocation.longitude
                }
            }else{
                var formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionurl,
                    "latitude"   : "",
                    "longitude"  : ""
                }
            }
        }
        // console.log("vendor list FormValues=>",formValues);
        axios.post("/api/vendorlist/post/vendor/list",formValues)
			.then((vendorResponse) => {
                if(vendorResponse){
                    // console.log("vendorResponse=>",vendorResponse);
                    setVendorList(vendorResponse.data)
                }
			})
			.catch((error) => {
				console.log('productwise vendorlist error', error);
			})
    },[sectionurl])
        return(
            <section className={ Style.bgGray}>
                <Header />    
                <div className={"container " +Style.bgHeight}>
                    <div className="col-12">
                    <div className={" row " }>
                        <div className="col-12">
                            <div className={"col-12 text-center  mt2 mb2 " +Style.vendorlistTitle}> <h6>Select Shop</h6></div>
                        </div>
                           { Array.isArray(vendorList) && vendorList.length >0?
                                vendorList.map((vendordata, index)=>{
                                    // console.log("vendorList===",vendorList);
                                    return(
                                        <div className="col-6" key={index}>
                                            <div className={"col-12 card mt-4 " +Style.vendorCard}>
                                            <Link href={"/products/"+vendordata.vendor_ID+"/"+vendordata.vendorLocation_id +"/"+sectionurl} className={+Style.vedorLink}>
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
                                                            {/* <span className={Style.delTime}>{vendordata.expectedDiliveryTime>0?vendordata.expectedDiliveryTime:0} &nbsp;min</span> */}
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
                </div>
                { Array.isArray(vendorList) && vendorList.length >10?
                    <div className="col-12">
                    <div className={"col-12 " +Style.moreBtn}>
                        <button className={"btn col-1 " +Style.blueBTN}>More</button>
                    </div>                      
                    </div>
                :
                    null
                }
                < Footer />
            </section>
        )
}

export default VendorList;