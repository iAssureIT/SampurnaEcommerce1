
import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import MasterPage                      from '../MasterPage/MasterPage.js';
import DeliveryLocationPopup           from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/DeliveryLocationPopup';
import Websitelogo                     from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import SearchBar                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Searchbar.js';
import Footer                          from '../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import GoogleMap                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Googlemap.js';

export const config = {
    unstable_runtimeJS : false
}

export default function App({pageData}) {
  const [sampurnaWebsiteDetails,setSampurnaWebsiteDetails]   = useState({});
  const [userDetails,setUserDetails]           = useState({});

  useEffect(()=>{
    var sampurnaWebsiteDetailsObj =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var user_details              =  JSON.parse(localStorage.getItem('userDetails'));
    // console.log("sampurnaWebsiteDetails.deliveryLocation=>",sampurnaWebsiteDetailsObj);
    if(sampurnaWebsiteDetailsObj){
        if(sampurnaWebsiteDetailsObj.deliveryLocation){
          // console.log("sampurnaWebsiteDetails.deliveryLocation=>",sampurnaWebsiteDetails.deliveryLocation);
          setSampurnaWebsiteDetails(sampurnaWebsiteDetailsObj);
          setUserDetails(user_details);
        }
    }
  },[])

  return (
    <div className="col-12">
      <div className="row">
        {sampurnaWebsiteDetails && sampurnaWebsiteDetails.deliveryLocation  && sampurnaWebsiteDetails.deliveryLocation.address ?	
          <MasterPage pageData = {pageData}/>
        :
          <div className="col-12">
              <div className="row headerWrapper ">
                <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
                    <header>
                        <nav className="navbar navbar-expand-md navbar-dark megamenu">
                            <div className="col-12 NoPadding ">
                                <div className="col-12 top-header">
                                    <div className="row headeLogoWrap mt-4">  
                                          <div className="col-2">
                                              <Websitelogo />
                                          </div>  
                                          <div className="ml-4 mr-4 col-6 text-center searchTitle"> <h5>Search Your Location</h5></div>
                                          <div className=" col-3 NoPadding signInBlock" >
                                              <a href="" className="faIcon faLoginIcon  col-12 NoPadding pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true"> 
                                                  <span className="col-12 loginView">Sign in &nbsp;
                                                      <img src="/images/eCommerce/userIcon.png" className="userIconImg"></img>
                                                  </span>
                                              </a>          
                                          </div> 
                                    </div>
                                </div>                                                    
                            </div>
                        </nav>
                    </header>
                </div>
              </div> 

              < DeliveryLocationPopup />

              {/* <div id="loginFormModal" className={"modal in " +Style.loginBGImg}  data-keyboard="false" >
                    <div className="modal-dialog ">                                        
                        <div className={"modal-content loginModalContent  loginBackImageHeight " +Style.signinBG} style={{'background': '#fff'}}>                            
                            <div className="modal-body">  
                                <button type="button" className="close"  data-dismiss="modal" onClick={this.CloseModal.bind(this)}>&times;</button>                                                           
                                {this.props.formToShow === "login" ?
                                    <div className="col-12 NoPadding loginForm mobileViewNoPadding">
                                        <Login />
                                    </div>  
                                : null
                                }  
                                {this.props.formToShow === "signUp" ?
                                    <div className="col-12 signupForm mobileViewNoPadding">
                                        <SignUp />
                                    </div>  
                                : null
                                } 
                                {this.props.formToShow === "forgotPassword" ?
                                    <div className="col-12 loginForm NoPadding mobileViewNoPadding">
                                        <ForgotPassword />
                                    </div>  
                                : null
                                }  
                                {this.props.formToShow === "confirmOtp" ?
                                    <div className="col-12 loginForm NoPadding mobileViewNoPadding">
                                        <ConfirmOtp />
                                    </div>  
                                : null
                                } 
                                {this.props.formToShow === "resetPassword" ?
                                    <div className="col-12 NoPadding loginForm mobileViewNoPadding">
                                        <ResetPassword />
                                    </div>  
                                : null
                                }                                                                
                            </div>
                        </div>
                    </div>
                </div>  
 */}
              <div className="row"> 
                  <Footer />
              </div>
          </div>
        }
      </div>
    </div>
  )
}

export async function getStaticProps(store,context){
	const urlParam = 'homepage';
    try {
        const res = await axios.get("api/pages/get/page_block/"+urlParam);
        const pageData = await res.data;
        return { props:{ pageData } }
      } catch (err) {
        return { props:{ "pageData" : null } }
      }
  }
