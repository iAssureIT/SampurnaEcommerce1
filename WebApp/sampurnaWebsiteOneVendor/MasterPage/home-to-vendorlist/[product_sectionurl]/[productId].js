
import React, { useState,useEffect } from 'react';
import axios                from 'axios';
import Link                 from 'next/link'
import Header               from '../../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import { components }       from 'react-select';
import Style                from "./vendor-list.module.css";
import { useRouter }        from 'next/router';

const HomeToVendorList = ()=> {
    const [vendorList,setVendorList] = useState([]);;
    const [categoryList,setCategoryList] = useState([]);

    const router = useRouter();
    const {product_sectionurl} = router.query;
    const {productId} = router.query;
    useEffect(()=>{
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));  
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : product_sectionurl,
                    "latitude"   : sampurnaWebsiteDetails.deliveryLocation.latitude,
                    "longitude"  : sampurnaWebsiteDetails.deliveryLocation.longitude,
                    "product_ID"  : productId,
                }
            }else{
                var formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : product_sectionurl,
                    "latitude"   : "",
                    "longitude"  : "",
                    "product_ID"  : productId,
                }
            }
        }
        // console.log("vendor list FormValues=>",formValues);
        // console.log("productID=",productId);
        axios.post("api/vendorlist/post/productwise/vendor/list",formValues)
			.then((vendorResponse) => {
                if(vendorResponse){
                    // console.log("vendorResponse=>",vendorResponse);
                    setVendorList(vendorResponse.data)
                }
			})
			.catch((error) => {
				console.log('vendorlist error', error);
			})
    },[productId])
        return(
            <section className={ Style.bgGray}>
                <Header />    
                <div className={"container " +Style.bgHeight}>
                    <div className="col-12">
                    <div className={" row " +Style.bgGray}>
                        <div className="col-12">
                            <div className={"col-12 text-center  mt-5 mb2 " +Style.vendorlistTitle}> <h6>Select Shop</h6></div>
                        </div>
                           { Array.isArray(vendorList) && vendorList.length >0?
                                vendorList.map((vendordata, index)=>{
                                    // console.log("vendorList===",vendorList);
                                    return(
                                        <div className="col-6" key={index}>
                                            <div className={"col-12 card mt-4 " +Style.vendorCard}>
                                            <Link href={"/product-detail/"+vendordata.vendor_ID+"/"+vendordata.vendorLocation_id +"/"+productId} className={+Style.vedorLink}>
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
                                                            <div className={"col-12 mb-2  ellipsis " +Style.vendor_productName +" " +Style.ellipsis}>{vendordata.productName}</div>
                                                            <div className={"col-12 mb-2 " +Style.vendor_price}>AED&nbsp;{vendordata.productPrice.toFixed(2)}</div>
                                                            <div className={"col-12 text-right NoPadding " +Style.deliveryTime}>
                                                                {/* <span className={Style.HTVdelTime}>{vendordata.expectedDiliveryTime>0?vendordata.expectedDiliveryTime:0} &nbsp;min</span> */}
                                                                <span className={Style.HTVdelTime}>60 &nbsp;min</span>
                                                                <img src="/images/eCommerce/time.png" className={"img "+Style.HTVtimeImg}></img>
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

export default HomeToVendorList;


// export async function getStaticPaths() {
//     console.log("getStatic path");
//     const paths = ["/home-to-vendorlist/[product_sectionurl]/[productid]"];
//     return { paths, fallback: true };
// }
  
// export async function getStaticProps({ query, params }) {
//     console.log("query==",query);
//     const { product_sectionurl } = query || params;
//     const { productid } = query || params;
//     const formValues ={
//                     "startRange" : 0,
//                     "limitRange" : 10,
//                     "sectionUrl" : product_sectionurl,
//                     "latitude"   : "",
//                     "longitude"  : "",
//                     "product_ID"  : productId,
//     }
//     const res = await fetch("api/vendorlist/post/productwise/vendor/list" + formValues);
//     const postData = await res.json();
  
//     return {
//       props: {
//         postData,
//       },
//     };
//   }