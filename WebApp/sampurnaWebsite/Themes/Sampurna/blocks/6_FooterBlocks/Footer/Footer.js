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
           hover         : "",
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
    hover(event){
        var id = event.currentTarget.id;
    
            this.setState({
                hover: id
            })
             
    }
    notHover(event){
        var id = event.currentTarget.id;

            this.setState({
                hover: ""
            })
        
    }

    render(){
       return(
        <div className="col-12 NoPadding footerWrapper" >
        <div className="col-12 footerNew ">
            <div className="col-12 col-xl-8 col-lg-8 float-md-right float-left">
                <div className="col-12 textEnd ">
                <span className="footerNumberWrapper">
                    <span className="footerTopIcon">
                        <img src= "/images/eCommerce/telephone.png" />
                    </span>
                    <span className="phoneT">
                        Phone &nbsp;&nbsp;:&nbsp;&nbsp;
                    </span> 
                    <span className="footerNumber">
                        +971 04 591 1186 
                    </span> &nbsp;&nbsp;&nbsp;&nbsp;
                    </span> 
                    <span className="footerNumberWrapper">
                        <span className="footerTopIcon">
                            <img src= "/images/eCommerce/mail.png" />
                        </span>
                        <span className="phoneT">
                            Mail Us &nbsp;&nbsp;:&nbsp;&nbsp; 
                        </span>
                        <span className="footerNumber">
                            support@knock-knockeshop.com 
                        </span> 
                    </span> 
                </div>
            </div>
        </div>
        {this.state.deliveryLocation?
       <div className="container-fluid">
        <div className="col-12 footer1">
          {/* <div className="row"> */}
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
                            <div className="col-6 col-xl-2 col-lg-2 col-md-4 col-sm-4" key={index}>
                                <div className=" col-12 NoPadding sectionName">
                                    <Link href={"/vendor-list/"+data.sectionUrl} passhref={true}>
                                        <a className="sectionurl footerSubT " ><span>{data.section}</span></a>
                                    </Link>
                                    {/* <a href={"vendor-list/"+data.sectionUrl} className="sectionurl footerSubT" ><span>{data.section}</span></a> */}
                                {
                                    data.categorylist.map((cateoryDetails,catindex)=>{            
                                        return(
                                        catindex<8?  
                                            <div key={catindex} className="">                                   
                                                <div className="categortTitle">
                                                    <Link href={"/vendor-list/"+data.sectionUrl} passhref={true}>
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
        :null}

        <div className="footer3 col-12">
            <div className="col-12 footer_bottom">
              <div className="row">
                  <div className={"col-6 col-sm-3 mx-auto col-xl-3 col-lg-3 col-md-6  " +S.logoTop}>
                     <img src="/images/eCommerce/TrollyLogo.png" className="col-12 img-fluid" alt="FooterLogo"/>
                  </div>


                <div className={"col-12 col-sx-12 col-md-12 col-xl-6 col-lg-6 container " +S.wrapper1}>
                    <div className={"col-12 d-flex justify-content-center "+S.wrapper2}>
                        <div id="socialMediaIcons1"  className="socialMediaIcons" onMouseEnter={this.hover.bind(this)} onMouseLeave={this.notHover.bind(this)}>
                            <Link href="https://www.instagram.com/knockknock_eshop/" passhref={true}>
                                <a  target="_blank">
                                { this.state.hover === "socialMediaIcons1"
                                    ?
                                    <img src= "/images/eCommerce/hover1.png" />
                                    :
                                    <img src= "/images/eCommerce/footerIcon1.png" />
                                }
                                </a>
                            </Link>
                        </div>                
                        <div id="socialMediaIcons2" className="socialMediaIcons" onMouseEnter={this.hover.bind(this)} onMouseLeave={this.notHover.bind(this)}>
                            <Link href="https://www.facebook.com/Knock-Knock-103575731986682" passhref={true}>
                                <a  target="_blank">
                                    { this.state.hover === "socialMediaIcons2"
                                        ?
                                        <img src= "/images/eCommerce/hover2.png" />
                                        :
                                        <img src= "/images/eCommerce/footerIcon2.png" />
                                    }
                                </a>
                            </Link>
                        </div>                        
                        <div id="socialMediaIcons3" className="socialMediaIcons" onMouseEnter={this.hover.bind(this)} onMouseLeave={this.notHover.bind(this)}>
                            <Link href="https://www.youtube.com/knockknockeshop" passhref={true}>
                                <a  target="_blank">
                                    { this.state.hover === "socialMediaIcons3"
                                        ?
                                        <img src= "/images/eCommerce/hover3.png" />
                                        :
                                        <img src= "/images/eCommerce/footerIcon3.png" />
                                    }
                                </a>
                            </Link>
                        </div>                                               
                        <div id="socialMediaIcons4" className="socialMediaIcons" onMouseEnter={this.hover.bind(this)} onMouseLeave={this.notHover.bind(this)}>
                            <Link href="https://www.linkedin.com/knockknockeshop" passhref={true}>
                                <a  target="_blank">
                                   { this.state.hover === "socialMediaIcons4"
                                        ?
                                        <img src= "/images/eCommerce/hover4.png" />
                                        :
                                        <img src= "/images/eCommerce/footerIcon4.png" />
                                    }
                                </a>
                            </Link>
                        </div>
                        <div id="socialMediaIcons5" className="socialMediaIcons" onMouseEnter={this.hover.bind(this)} onMouseLeave={this.notHover.bind(this)}>
                            <Link href="https://twitter.com/knockknockeshop" passhref={true}>
                                <a  target="_blank">
                                    { this.state.hover === "socialMediaIcons5"
                                        ?
                                        <img src= "/images/eCommerce/hover5.png" />
                                        :
                                        <img src= "/images/eCommerce/footerIcon5.png" />
                                    }
                                </a>
                            </Link>
                        </div>                    
                    </div>
                    <div className={"col-12 d-flex justify-content-center "+S.wrapper3}>
                            <div className={"text-center " +S.aboutClass}><Link href="/about-us" passhref={true}><a ><span>&nbsp;About Us</span></a></Link></div>
                            <div className={S.aboutClass}><Link href="/contact-us" passhref={true}><a ><span>&nbsp;Contact Us</span></a></Link></div>   
                            <div className={S.aboutClass}><Link href="/privacy-policy" passhref={true}><a ><span>&nbsp;Privacy Policy</span></a></Link></div>
                            <div className={S.aboutClass}><Link href="/faq" passhref={true}><a ><span>&nbsp;FAQs</span></a></Link></div> 
                            <div className={S.aboutClass}><Link href="/terms-and-conditions" passhref={true}><a><span>Terms and Conditions</span></a></Link></div>
                            <div className={S.aboutClass}><Link href="/sitemap"><a ><span>&nbsp;Site Map</span></a></Link></div>  
                    </div>
                    <div className={"col-12 d-flex justify-content-center "+S.wrapper4}>
                        <p className="footer3Class">
                            <i className="far fa-copyright">&nbsp;</i>2021 Knock Knock. All Rights Reserved
                        </p>
                    </div>
                </div>

                <div className={"col-12 col-sm-12 col-xl-3 col-lg-3 col-md-12 text_Center " +S.payDiv}>
                    <div className={"col-12 col-sm-6 float-left  col-lg-12 col-md-12 md-mt-5  " +S.aboutHeight1}>
                        <div className={"col-12  "+S.footerTitleWrapper}>Payment card</div>
                        <div className={"col-12 col-sm-12 col-lg-12 col-md-12 mt-lg-2 mt-sm-2 mt-4 " }>
                            <div className="payCard1 "></div>  
                            <div className="payCard2 "></div>  
                        </div>
                    </div> 
                    <div className={"col-12 col-sm-6 float-left  col-lg-12 col-md-12 " +S.aboutHeight2}>
                        <div className={"col-12 "+S.footerTitleWrapper}>We are in</div>
                        <div className={"col-12 col-sm-12 col-lg-12 col-md-12 mt-lg-2 mt-sm-2 mt-4" }>
                            <a className="appleCard col-6" href={"https://www.apple.com/ae/app-store/"} target="_blank" passhref={"true"}>
                                <div className="row">
                                    <img src= "/images/eCommerce/1.gif" className="appStoreLogo"/>
                                </div>
                            </a>  
                            <a className="androidCard col-6" href={"https://play.google.com/store/apps/details?id=com.trollymart"} target="_blank" passhref={"true"}>
                                <div className="row">
                                    <img src= "/images/eCommerce/1_grpEUqlOJE6Fysw7ErWIBQ.gif" className="appStoreLogo"/>
                                </div>
                            </a>  
                        </div>
                    </div> 
                </div>
              
            </div>  
        </div>
       </div> 
       
     </div>  
    );
  } 

}