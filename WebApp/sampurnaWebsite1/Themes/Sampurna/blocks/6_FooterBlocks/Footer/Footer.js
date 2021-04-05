import React, { Component } from 'react';
import Image  from 'next/image';
import Link   from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';

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

    // getCompanyDetails(){
    //     axios.get("/api/entitymaster/get/one/companyName/1")
    //       .then((response)=>{ 
    //         console.log("companyData:" ,response.data);
    //         this.setState({
    //             companyInfo   : response.data[0],
    //             locationdata  : response.data[0].companyLocationsInfo,             
    //         },
    //             ()=>{
    //           })
    //       })
    //       .catch((error)=>{
    //             console.log('error', error);
    //       })
    // }

    render(){
       return(
        <div className="col-12 NoPadding footerWrapper" >
        <br/>
        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footerAnimation" style={{'background' : "url("+footerAnimationImg +")" }}></div> */}
       <div className="container-fluid">
        <div className="col-12 footer1">
          <div className="row">
            <div className="col-xl-7 col-md-7 categoryFooterWrapper">
                <div className="col-12 NoPadding">
                    <div className="col-12 FooterTitle">Online Shopping</div>
                    <div className=" col-xl-3 col-md-3 hrLine"></div>
                </div>
                <div className="col-12 NoPadding">
                  <div className="row">
                    {Array.isArray(this.state.categoryData) && this.state.categoryData.map((data,index)=>{
                        return(
                            index <=2 ?
                            <div className="col-6 col-xl-4 col-md-4  footerSection" key={index}>
                                <div className=" col-12 NoPadding sectionName">
                                    <Link href={`/section/${encodeURIComponent(data.sectionUrl)}`}>
                                        <a className="sectionurl" ><span>{data.section}</span></a>
                                    </Link>
                                {
                                    data.categorylist.map((cateoryDetails,catindex)=>{            
                                        return(
                                        catindex<8?  
                                            <div key={catindex} className="">                                   
                                                <div className="categortTitle">
                                                    <Link href={`/category/${encodeURIComponent(cateoryDetails.categoryUrl)}`}>
                                                        <a><span>{cateoryDetails.category}</span></a>
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
               </div> 
            </div>
            </div>

            <div className="col-12 col-xl-2 col-md-3 aboutusFooterWrapper">
                <div>
                    <div className="col-12 FooterTitle">About Us</div>
                    <div className=" col-7 hrLine"></div>
                </div>
                <div className="col-12">
                    <div className="categortTitle"><Link href="/aboutus"><a ><span>&nbsp;About Us</span></a></Link></div>
                    <div className="categortTitle"><Link href="/contact-us"><a ><span>&nbsp;Contact Us</span></a></Link></div>    
                    <div className="categortTitle"><Link href="/return-policy"><a ><span>&nbsp;Return Policy</span></a></Link></div>
                    {/* <div className="categortTitle"><a href="/terms-conditions" target="_blank"><span>Terms Of Use</span></a></div> */}
                    {/* <div className="categortTitle"><a href="/privacypolicy" target="_blank"><span>Privacy Policy</span></a></div> */}      
                    <div className="categortTitle"><Link href="/legal-notice"><a ><span>&nbsp;Legal Notice</span></a></Link></div>
                    <div className="categortTitle"><Link href="/sitemap"><a ><span>&nbsp;Site Map</span></a></Link></div> 
                    <div className="categortTitle"><Link href="/photo-gallery"><a ><span>&nbsp;Photo Gallery</span></a></Link></div> 
                    <div className="categortTitle"><Link href="/blogs"><a ><span>&nbsp;Blogs</span></a></Link></div>
                    <div className="categortTitle"><Link href="/faqs"><a ><span>&nbsp;FAQs</span></a></Link></div>      
                                  
                </div>
            </div>
            <div className="col-xl-3 col-md-2  col-12 onlineShoppingWrapper">               
                <div className="row">
                    <div className="logo col-xl-12 col-6 col-md-12">
                        <Link href="/">
                        <a  title="BookStore logo "style={{float:"right"}}>
                            {/* <img src="/images/eCommerce/kokilaLogo.png" alt="images" className="footerLogoImg col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding"/> */}
                            <Image
                                src="/images/eCommerce/multistoreLogo.png"
                                className={"footerLogoImg"}
                                height ={60}
                                width={200}
                            />
                        </a>
                        </Link>
                    </div> 
                    <div className="col-xl-12 col-6">
                     <div className="col-xl-12 col-md-6 col-12 FooterTitle FooterTitle2">Connect Us</div>
                      <div className="col-10 col-xl-12 col-md-6 NoPadding">
                        <div className="socialMediaIcons pull-right"><Link href="https://www.facebook.com/bookstore"><a  target="_blank"><i className="fab fa-facebook-f"></i></a></Link></div>
                        <div className="socialMediaIcons pull-right"><Link href="https://www.instagram.com/bookstore"><a  target="_blank"><i className="fab fa-instagram" aria-hidden="true"></i></a></Link></div>
                        <div className="socialMediaIcons pull-right"><Link href="https://www.youtube.com/channel/UCOXIsYFFEHlzRnMI89Enoag"><a  target="_blank"><i className="fab fa-youtube" aria-hidden="true"></i></a></Link></div>  
                        <div className="socialMediaIcons pull-right"><Link href="https://twitter.com/bookstore"><a  target="_blank"><i className="fab fa-twitter" aria-hidden="true"></i></a></Link></div>                   
                    </div>
                   </div> 
                </div>
            </div>
           </div>             
        </div>
        </div>
        <div className="footer3 col-12 col-xl-12">
            <div className="col-12 col-xl-12 col-md-12 footer_bottom">
              <div className="row">
                <div className="col-xl-6 col-md-6 copyrighttxt">
                    <p>Copyright @2021 <i className="fa fa-copyright"></i> <span className="uniColor">Multi</span><span className="mandaiColor">Store</span> All Rights Reserved.</p>
                </div>
                <div className=" col-xl-6 col-md-6 footernabbar NoPadding">
                    <span className=" pull-right ">Design & Developed by <Link href="http://iassureit.com/"><a target="_blank"> iAssure International Technologies Pvt. Ltd. </a></Link> Version 1.0</span>
                </div>
            </div>  
        </div>
       </div> 
     </div>  
    );
  } 

}