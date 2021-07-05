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
        {this.state.deliveryLocation?
       <div className="container-fluid">
        <div className="col-12 footer1">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 categoryFooterWrapper">
                <div className="col-12  NoPadding">
                    <div className="col-12 NoPadding  FooterTitle">Online Shopping</div>
                    <div className="col-xl-3 col-md-3 col-12 hrLine"></div>
                </div>
                <div className="col-12  NoPadding">
                  <div className="row">
                    {Array.isArray(this.state.categoryData) && this.state.categoryData.map((data,index)=>{
                        return(
                            index<10? 
                            <div className="col-6 col-xl-2 col-lg-2 col-md-4 col-sm-6 footerSection" key={index}>
                                <div className=" col-12 NoPadding sectionName">
                                    <Link href={"vendor-list/"+data.sectionUrl} passHref={true}>
                                        <a className="sectionurl footerSubT " ><span>{data.section}</span></a>
                                    </Link>
                                    {/* <a href={"vendor-list/"+data.sectionUrl} className="sectionurl footerSubT" ><span>{data.section}</span></a> */}
                                {
                                    data.categorylist.map((cateoryDetails,catindex)=>{            
                                        return(
                                        catindex<8?  
                                            <div key={catindex} className="">                                   
                                                <div className="categortTitle">
                                                    <Link href={""+data.sectionUrl} passHref={true}>
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
                  < Websitelogo />
              </div>

              <div className={"col-12 col-sx-12 col-xl-6 col-lg-6 col-md-12 text_Center " }>
                <div className={"col-12 col-sm-12 col-lg-12 col-md-12 text_Center mt-3 mb-3 " +S.icon}>
                    <div className="socialMediaIcons"><Link href="https://www.instagram.com/bookstore" passHref={true}><a  target="_blank"><i className="fab fa-instagram mt15 ml0" aria-hidden="true"></i></a></Link></div>                
                    <div className="socialMediaIcons"><Link href="https://www.facebook.com/bookstore" passHref={true}><a  target="_blank"><i className="fab fa-facebook-f mt15"></i></a></Link></div>                        
                    <div className="socialMediaIcons"><Link href="https://www.youtube.com/channel/UCOXIsYFFEHlzRnMI89Enoag" passHref={true}><a  target="_blank"><i className="fab fa-youtube mt15" aria-hidden="true"></i></a></Link></div>                                               
                    <div className="socialMediaIcons"><Link href="https://www.linkedin.com" passHref={true}><a  target="_blank"><i className="fab fa-linkedin-in mt15" aria-hidden="true"></i></a></Link></div>
                    <div className="socialMediaIcons"><Link href="https://www.twitter.com/bookstore" passHref={true}><a  target="_blank"><i className="fab fa-twitter mt15" aria-hidden="true"></i></a></Link></div>                    
                </div> 
                <div className="col-12 col-sx-12 col-xl-12 col-lg-12 col-md-12 text_Center">
                    <div className={"col-12 text-center footer3Class " +S.aboutHeight}>
                        <div className={" " +S.aboutClass}><Link href="/about-us" passHref={true}><a ><span>&nbsp;About Us</span></a></Link></div>
                        <div className={" " +S.aboutClass}><Link href="/contact-us" passHref={true}><a ><span>&nbsp;Contact Us</span></a></Link></div>   
                        <div className={" " +S.aboutClass}><Link href="/privacy-policy" passHref={true}><a ><span>&nbsp;Privacy Policy</span></a></Link></div>
                        <div className={" " +S.aboutClass}><Link href="/faq" passHref={true}><a ><span>&nbsp;FAQs</span></a></Link></div> 
                        <div className={" " +S.aboutClass}><Link href="/terms-and-conditions" passHref={true}><a><span>Terms and Conditions</span></a></Link></div>
                        <div className={" " +S.aboutClass}><Link href="/sitemap"><a ><span>&nbsp;Site Map</span></a></Link></div>  
                    </div>
                      <div className="col-12 text-center footer3Class">
                          Conditions of Use & Sale &nbsp;&nbsp;&nbsp;&nbsp; Privacy Notice &nbsp;&nbsp;&nbsp;&nbsp; Interest-Based Ads
                      </div>
                      <div className="col-12 text-center">
                        <p><i className="fa fa-copyright"></i>2021,Trollymart.com</p>
                      </div>                      
                  </div>
              </div>
              <div className={"col-12 col-sx-12 col-xl-3 col-lg-3 col-md-12 text_Center " +S.payDiv}>
                  <div className={"col-12 col-sm-12 col-lg-12 col-md-12 md-mt-5  " +S.aboutHeight}>
                        <div className="col-12 FooterTitle ">Payment card</div>
                        <div className={"col-12 col-sm-6 col-lg-12 col-md-12 mt15 " }>
                            <div className="payCard1 "></div>  
                            <div className="payCard2 "></div>  
                        </div>
                    </div> 
     
                    <div className="col-12 col-sm-12 col-lg-12 col-md-12 mt-3 ">
                        <div className="col-12 FooterTitle ">We are in</div>
                        <div className="col-12 col-sm-6 col-lg-12 col-md-12 mt15 width pr-0">
                            <div className="appleCard"></div>
                            <div className="androidCard"></div>                        
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