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
        <br/>
        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footerAnimation" style={{'background' : "url("+footerAnimationImg +")" }}></div> */}
       <div className="container-fluid">
        <div className="col-12 footer1">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 categoryFooterWrapper">
                <div className="col-12  NoPadding">
                    <div className="col-12  FooterTitle">Online Shopping</div>
                    <div className="col-xl-3 col-md-3 col-12 hrLine"></div>
                </div>
                <div className="col-12  NoPadding">
                  <div className="row">
                    {Array.isArray(this.state.categoryData) && this.state.categoryData.map((data,index)=>{
                        return(
                        
                            index<10? 
                            <div className="col-6 col-xl-2 col-lg-2 col-md-4 col-sm-6 footerSection" key={index}>
                                <div className=" col-12 NoPadding sectionName">
                                    <Link href={"vendor-list/"+data.sectionUrl}>
                                        <a className="sectionurl footerSubT" ><span>{data.section}</span></a>
                                    </Link>
                                {
                                    data.categorylist.map((cateoryDetails,catindex)=>{            
                                        return(
                                        catindex<8?  
                                            <div key={catindex} className="">                                   
                                                <div className="categortTitle">
                                                    <Link href={""+data.sectionUrl}>
                                                        <a><span className="f9">{cateoryDetails.category}</span></a>
                                                    </Link>
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
                    <div className={"col-6 col-xl-1 col-lg-1 col-md-4 col-sm-6 aboutusFooterWrapper pr0 pr-0 pl-0 "+S.pr0 }>
                <div>
                    <div className="col-12 footerSubT pr-0">About Us</div>
                    <div className="col-7 hrLine"></div>
                </div>
                <div className="col-12 pr-0">
                    <div className="categortTitle"><Link href="/about-us"><a ><span>&nbsp;About Us</span></a></Link></div>
                    <div className="categortTitle"><Link href="/contact-us"><a ><span>&nbsp;Contact Us</span></a></Link></div>    
                    <div className="categortTitle"><Link href="/return-policy"><a ><span>&nbsp;Return Policy</span></a></Link></div>
                    <div className="categortTitle"><a href="/terms-conditions" target="_blank"><span>Terms and Conditions</span></a></div>
                    {/* <div className="categortTitle"><a href="/privacypolicy" target="_blank"><span>Privacy Policy</span></a></div> */}      
                    <div className="categortTitle"><Link href="/legal-policy"><a ><span>&nbsp;Privacy Policy</span></a></Link></div>
                    <div className="categortTitle"><Link href="/faqs"><a ><span>&nbsp;FAQs</span></a></Link></div> 
                    <div className="categortTitle"><Link href="/sitemap"><a ><span>&nbsp;Site Map</span></a></Link></div> 
                    {/* <div className="categortTitle"><Link href="/photo-gallery"><a ><span>&nbsp;Photo Gallery</span></a></Link></div>  */}
                    {/* <div className="categortTitle"><Link href="/blogs"><a ><span>&nbsp;Blogs</span></a></Link></div> */}
                         
                                  
                </div>
            </div>
            <div className="col-6 col-xl-3 col-lg-3 col-md-4 col-sm-6 NoPadding onlineShoppingWrapper">               
                
                <div className="col-xl-12 col-md-12 col-sm-12  col-12">
                    <div className="col-12 FooterTitle text-right">Connect with Us</div>
                    <div className="col-12 col-sm-12 col-lg-12 col-md-12 pull-right ">
                        <div className="socialMediaIcons pull-right"><Link href="https://twitter.com/bookstore"><a  target="_blank"><i className="fa fa-twitter mt15" aria-hidden="true"></i></a></Link></div>
                        <div className="socialMediaIcons pull-right"><Link href="https://www.linkedin.com"><a  target="_blank"><i className="fa fa-linkedin-in mt15" aria-hidden="true"></i></a></Link></div>
                        <div className="socialMediaIcons pull-right"><Link href="https://www.youtube.com/channel/UCOXIsYFFEHlzRnMI89Enoag"><a  target="_blank"><i className="fa fa-youtube mt15" aria-hidden="true"></i></a></Link></div>                                               
                        <div className="socialMediaIcons pull-right"><Link href="https://www.facebook.com/bookstore"><a  target="_blank"><i className="fa fa-facebook-f mt15"></i></a></Link></div>                        
                        <div className="socialMediaIcons pull-right"><Link href="https://www.instagram.com/bookstore"><a  target="_blank"><i className="fa fa-instagram mt15 ml0" aria-hidden="true"></i></a></Link></div>                
                    </div>
                </div>

                <div className={"col-12 col-sm-12 col-lg-12 col-md-12 md-mt-5 text-right " +S.mt100}>
                    <div className="col-12 FooterTitle">Payment card</div>
                    <div className="col-12 col-sm-6 col-lg-12 col-md-12 pull-right mt15">
                        <div className="payCard2 pull-right"></div>                        
                        <div className="payCard1 pull-right"></div>                        
                    </div>
                </div>
 
                <div className="col-12 col-sm-12 col-lg-12 col-md-12 mt80 text-right">
                    <div className="col-12 FooterTitle">We are in</div>
                    <div className="col-12 col-sm-6 col-lg-12 col-md-12 mt15 float-right width pr-0">
                        <div className="appleCard"></div>
                        <div className="androidCard"></div>                        
                    </div>
                </div>
            </div>

               </div> 
            </div>
            </div>
            
           </div>             
        </div>
        </div>
        <div className="footer3 col-12">
            <div className="col-12 footer_bottom">
              <div className={"row " +S.footerBottom}>
              <div className="col-12 col-sm-12 col-xl-4 col-lg-4 col-md-4 col-sx-12">
                  < Websitelogo />
              </div>
              
              <div className="col-12 col-sx-12 col-xl-5 col-lg-6 col-md-8 text_Center">
                  <div className="footer3Class">
                      Conditions of Use & Sale &nbsp;&nbsp;&nbsp;&nbsp; Privacy Notice &nbsp;&nbsp;&nbsp;&nbsp; Interest-Based Ads
                  </div>
                  <div className="col-12 text-center">
                    <p><i className="fa fa-copyright"></i>2021,Trollymart.com</p>
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