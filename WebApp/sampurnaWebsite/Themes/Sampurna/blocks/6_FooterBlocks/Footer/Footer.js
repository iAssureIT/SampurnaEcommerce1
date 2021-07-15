import React, { Component } from 'react';
import Image                from 'next/image';
import Link                 from 'next/link';
import Websitelogo          from '../../5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import axios from 'axios';
import S from './Footer.module.css';


export default class Footer extends Component {

    constructor(props){
    super(props);
        this.state = {
          categoryDetails:[],
           companyInfo   :"",
           Locationdata  :[],
           categoryData  :[],
        }
    }
    
    componentDidMount(){
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if( userDetails && userDetails.user_id){
            this.setState({user_ID : userDetails.user_id})
        }
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                this.setState({deliveryLocation : sampurnaWebsiteDetails.deliveryLocation },()=>{
                    // console.log("deliveryLocation==",this.state.deliveryLocation);
                })
            }
        }

        axios.get("/api/sections/get/get_megamenu_list")
            .then((response)=>{ 
                if(response){
                    // console.log("response",response);
                    this.setState({ 
                        categoryData : response.data
                    },()=>{
                        // console.log("categoryData===",this.state.categoryData);
                    })
                }
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }

    render(){
       return(
        <div className="col-12 NoPadding footerWrapper" >
        <div className="col-12 footerNew ">
            <div className="col-12 col-xl-8 col-lg-8 float-right">
                <div className="col-12 textEnd "><i className="fas fa-phone-alt fIcon "></i><span className="phoneT">Phone &nbsp;&nbsp;:&nbsp;&nbsp;</span>  +971 04 591 1186 &nbsp;&nbsp;&nbsp;&nbsp; <i className="fas fa-envelope fIcon"></i><span className="phoneT">Mail Us &nbsp;&nbsp;:&nbsp;&nbsp; </span> support@knock-knockeshop.com</div>
            </div>
        </div>
        {this.state.deliveryLocation?
       <div className="container-fluid">
        <div className="col-12 footer1">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-10 offset-lg-1 categoryFooterWrapper">
                <div className="col-12  NoPadding">
                    {/* <div className="col-12 NoPadding  FooterTitle">Online Shopping</div> */}
                    <div className="col-xl-3 col-md-3 col-12 hrLine"></div>
                </div>
                <div className="col-12  NoPadding">
                  <div className="row">
                    {Array.isArray(this.state.categoryData) && this.state.categoryData.map((data,index)=>{
                        return(
                            index<10? 
                            <div className="col-6 col-xl-2 col-lg-2 col-md-4 col-sm-6 footerSection" key={index}>
                                <div className=" col-12 NoPadding sectionName">
                                    <Link href={"vendor-list/"+data.sectionUrl} passhref={true}>
                                        <a className="sectionurl footerSubT " ><span>{data.section}</span></a>
                                    </Link>
                                    {/* <a href={"vendor-list/"+data.sectionUrl} className="sectionurl footerSubT" ><span>{data.section}</span></a> */}
                                {
                                    data.categorylist.map((cateoryDetails,catindex)=>{            
                                        return(
                                        catindex<8?  
                                            <div key={catindex} className="">                                   
                                                <div className="categortTitle">
                                                    <Link href={"vendor-list/"+data.sectionUrl} passhref={true}>
                                                        <a><span className="f9">{cateoryDetails.category}</span></a>
                                                    </Link>
                                                     {/* <a href={""+data.sectionUrl}><span className="f9">{cateoryDetails.category}</span></a> */}
                                                </div>
                                            </div>
                                        :null
                                        );                            
                                    })
                                }
                                </div>
                            </div>
                            :null
                        );
                        })
                    }

               </div> 
            </div>
            </div>
           </div>             
        </div>
        </div>
        :null}
        <div className="footer3 col-12">
            <div className="col-12 footer_bottom">
              <div className={"row " +S.footerBottom}>
              <div className={"col-12 col-sm-12 col-xl-3 col-lg-3 col-md-12 col-sx-12 " +S.logoTop}>
                 <img src="/images/eCommerce/TrollyLogo.png" className="" alt="FooterLogo" width="" height="75px"/>
              </div>
              <div className={"col-12 col-sx-12 col-xl-6 col-lg-6 col-md-12 text_Center mx-0 " }>
                <div className={"col-12 col-sm-12 col-lg-12 col-md-12 text_Center mt-3 mb-3 " +S.icon}>
                    <div className="socialMediaIcons"><Link href="https://www.instagram.com/knockknock_eshop/" passhref={true}><a  target="_blank"><i className="fab fa-instagram mt15 ml0" aria-hidden="true"></i></a></Link></div>                
                    <div className="socialMediaIcons"><Link href="https://www.facebook.com/Knock-Knock-103575731986682" passhref={true}><a  target="_blank"><i className="fab fa-facebook-f mt15"></i></a></Link></div>                        
                    <div className="socialMediaIcons"><Link href="https://www.youtube.com/knockknockeshop" passhref={true}><a  target="_blank"><i className="fab fa-youtube mt15" aria-hidden="true"></i></a></Link></div>                                               
                    <div className="socialMediaIcons"><Link href="https://www.linkedin.com/knockknockeshop" passhref={true}><a  target="_blank"><i className="fab fa-linkedin-in mt15" aria-hidden="true"></i></a></Link></div>
                    <div className="socialMediaIcons"><Link href="https://twitter.com/knockknockeshop" passhref={true}><a  target="_blank"><i className="fab fa-twitter mt15" aria-hidden="true"></i></a></Link></div>                    
                </div> 
                <div className="col-12 col-sx-12 col-xl-12 col-lg-12 col-md-12 text_Center">
                    <div className={"col-12 text-center footer3Class " +S.aboutHeight}>
                        <div className={" " +S.aboutClass}><Link href="/about-us" passhref={true}><a ><span>&nbsp;About Us</span></a></Link></div>
                        <div className={" " +S.aboutClass}><Link href="/contact-us" passhref={true}><a ><span>&nbsp;Contact Us</span></a></Link></div>   
                        <div className={" " +S.aboutClass}><Link href="/privacy-policy" passhref={true}><a ><span>&nbsp;Privacy Policy</span></a></Link></div>
                        <div className={" " +S.aboutClass}><Link href="/faq" passhref={true}><a ><span>&nbsp;FAQs</span></a></Link></div> 
                        <div className={" " +S.aboutClass}><Link href="/terms-and-conditions" passhref={true}><a><span>Terms and Conditions</span></a></Link></div>
                        <div className={" " +S.aboutClass}><Link href="/sitemap"><a ><span>&nbsp;Site Map</span></a></Link></div>  
                    </div>
                      <div className="col-12 text-center footer3Class">
                          Conditions of Use & Sale &nbsp;&nbsp;&nbsp;&nbsp; Privacy Notice &nbsp;&nbsp;&nbsp;&nbsp; Interest-Based Ads
                      </div>
                      <div className="col-12 text-center">
                        <p className="footer3Class"><i className="fa fa-copyright footer3Class"></i>2021,knockknockeshop.com</p>
                      </div>                      
                  </div>
              </div>
              <div className={"col-12 col-sx-12 col-xl-3 col-lg-3 col-md-12 text_Center " +S.payDiv}>
                  <div className={"col-12 col-sm-12 col-lg-12 col-md-12 md-mt-5  " +S.aboutHeight1}>
                        <div className={"col-12  "+S.footerTitleWrapper}>Payment card</div>
                        <div className={"col-12 col-sm-6 col-lg-12 col-md-12 mt-4 " }>
                            <div className="payCard1 "></div>  
                            <div className="payCard2 "></div>  
                        </div>
                    </div> 
     
                    <div className="col-12 col-sm-12 col-lg-12 col-md-12  ">
                        <div className={"col-12 FooterTitle "+S.footerTitleWrapper}>We are in</div>
                        <div className="col-12">
                        <div className="col-12 col-sm-6 col-lg-12 col-md-12  width pr-0 mt-4">
                            <div className="row">
                                <a className="col-6 NoPadding" href={"https://www.apple.com/ae/app-store/"} target="_blank" passhref={"true"}>
                                    <div className="appleCard col-12 NoPadding"></div>
                                </a>
                                <a className="col-6 NoPadding" href={"https://play.google.com/store/apps/details?id=com.trollymart"} target="_blank" passhref={"true"}>
                                    <div className="androidCard col-12 NoPadding"></div>
                                </a> 
                            </div>                    
                        </div>
                        </div>
                    </div>
                </div>
              
               {/* <div className="col-12 col-sm-6 copyrighttxt">
                    <p>Copyright @2021 <i className="fa fa-copyright"></i> <span className="uniColor">Trolly</span><span className="mandaiColor">Mart</span> All Rights Reserved.</p>
                </div>
                <div className="col-12 col-sm-6 footernabbar NoPadding">
                    <span className=" pull-right ">Design & Developed by <Link href="http://iassureit.com/"><a target="_blank"> iAssure International Technologies Pvt. Ltd. </a></Link> Version 1.0</span>
                </div>*/}
            </div>  
        </div>
       </div> 
     </div>  
    );
  } 

}