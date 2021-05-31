
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
    // console.log("router",router);
    useEffect(()=>{
        var formValues =  {
            "startRange" : 0,
            "limitRange" : 10,
            "sectionUrl" : sectionUrl,
            "latitude"   : "",
            "longitude"  : ""
        }
        axios.post("/api/vendorlist/post/vendor/list",formValues)
			.then((vendorResponse) => {
                if(vendorResponse){
                    setVendorList(vendorResponse.data)
                }
			})
			.catch((error) => {
				console.log('error', error);
			})
    },[sectionUrl])
        return(
            <section>
                <Header />    
                <div className="col-12">
                    <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <div className={"col-12 text-center  mt2 mb2 " +Style.vendorlistTitle}> <h6>Select Shop</h6></div>
                        </div>
                        
                           { Array.isArray(vendorList) && vendorList.length >0?
                                vendorList.map((vendordata, index)=>{
                                    console.log("vendorList===",vendorList);
                                    return(
                                        <div className="col-4" key={index}>
                                            <div className={"card mt-4 " +Style.vendorCard}>
                                                <Link href={"/products/"+vendordata.vendor_ID+"/"+sectionUrl} className={+Style.vedorLink}>
                                                    <div className={"card-body " +Style.cardBody}>
                                                        <div className={ "col-3 NoPadding "+Style.vendorLogo}>
                                                            <img src={vendordata.vendorLogo} className={"vendor img-thumbnail "+Style.vendorLogo }/>
                                                        </div>   
                                                        <div>{vendordata.vendorName}</div>
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
                < Footer />
            </section>
        )
}

export default VendorList;