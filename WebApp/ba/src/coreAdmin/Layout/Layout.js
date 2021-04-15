import React,{Component}                          from 'react';
import { render }                                 from 'react-dom';
import { BrowserRouter as Router, Route,Switch }  from 'react-router-dom';
import $                                          from "jquery";

import Header                                     from '../common/header/Header.js';
import Footer                                     from '../common/footer/Footer.js'
import Dashboard                                  from '../dashboard/Dashboard.js'
import Leftsidebar                                from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar                               from '../common/rightSidebar/Rightsidebar.js'

import UMListOfUsers                              from '../userManagement/UM/UMListOfUsers.js';
import EditUserProfile                            from '../userManagement/UM/EditUserProfile.js';
import UMRolesList                                from '../userManagement/Roles/UMRolesList.js';
import CompanySetting                             from '../companysetting/Components/CompanySetting.js';
// import ViewTemplates                              from '../NotificationManagement/ViewTemplates.js';

import AddModuleFacility                          from '../accessManagement/AddModuleFacility.js';
import AssignPermissionToModules                  from '../accessManagement/AssignPermissionToModules.js';

import SectorAndActivity                          from '../../coreAdmin/masterData/sectorAndActivity/SectorAndActivity.js';
import BulkUpload                                 from '../../coreAdmin/masterData/sectorAndActivity/component/BulkUpload/BulkUpload.js';
import centerDetail                               from '../../coreAdmin/masterData/centerDetail/centerDetail.js';

import SectorMapping                              from '../../coreAdmin/masterData/sectorMapping/SectorMapping.js';
//============== Shipment Management ==============//

import BaOrdersList                               from '../../StoreManagement/orders/component/BaOrdersList.js';
import viewOrder                                  from '../../StoreManagement/orders/component/viewOrder.js';


//================== Reports ===============//
import Reports                                    from '../../reports/Reports/Reports.js';
// Section: 1 - SystemSecurity ******************************************************
import Login            from '../systemSecurity/Login.js';
import ConfirmOtp       from '../systemSecurity/ConfirmOtp.js';
import ForgotPassword   from '../systemSecurity/ForgotPassword.js';
import ResetPassword    from '../systemSecurity/ResetPassword.js';
import SignUp           from '../systemSecurity/SignUp.js';
import VerifyAccount    from '../systemSecurity/VerifyAccount.js';

import CompanyProfile       from '../CompanyProfile/CompanyProfile.js';
import CorporateBasicInfo from '../companysetting/Components/CompanyInformation.js';

// ============ Orgnizational Setting ===========================
import OrgnizationalBasicInfo from "../OrganizationalSettings/OrganizationalBasicInfo.js";
import OrganizationalContactDetails from "../OrganizationalSettings/OrganizationalContactDetails.js";
import OrganizationalLocationDetails from "../OrganizationalSettings/OrganizationalLocationDetails.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

class Layout extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      loggedIn : false,
    }
  }
   
  componentDidMount(){
   /* $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });

    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#headerid').toggleClass('headereffect');
       });
    });
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#dashbordid').toggleClass('dashboardeffect');
      });
    });
  */

      const token = localStorage.getItem("token");
     // console.log("Dashboard Token = ",token);
    if(token!==null){
    // console.log("*********===***********imin ",token);
      this.setState({
        loggedIn : true
      })
    }else{
      // console.log("token is not available");
    }

  }

      logout(){
    var token = localStorage.removeItem("token");
      if(token!==null){
      // console.log("Header Token = ",token);
      this.setState({
        loggedIn : false
      })
      // browserHistory.push("/login");
      // this.props.history.push("/login");
    }
  }


  render(){
// console.log(this.state.loggedIn+'==='+true)

    // console.log("props = ",this.props);
    // {console.log("loggedIn status layput = ", this.state.loggedIn)}
    if(this.state.loggedIn===true){
      console.log('ifffff');
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
        if( document.getElementById("mySidenav"))
        {
            if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
              document.getElementById("mySidenav").style.top = "0";
            } else {
              document.getElementById("mySidenav").style.top = "50px";
            }

        }
        
      }

    return(
      <Router>
      <div className="hold-transition skin-blue fixed sidebar-mini">
        <div className="content-wrapper">
          <div className="wrapper">
            <Header />
            <Leftsidebar/>
           {/* <div className="App container-fluid">*/}
              <div className=" baRowWidth">
             {/* <div id="headerid" className="headerbackgroundcolor ">
              
              </div>*/}
               <div className="container-flex main-container">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bapadd0">
                 <div className="dashboardWrapper">
                    <div className="backColor col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                      {/*<div id="dashbordid" className="">*/}
                  
                    <Switch>
                      
                      <Route path="/dashboard" component={Dashboard} exact />
                    {/*Admin Routes*/}
                      <Route path="/umlistofusers"        component={UMListOfUsers}   exact />
                      <Route path="/umroleslist"          component={UMRolesList}     exact />
                      <Route path="/edituserprofile"      component={EditUserProfile} exact />
                      {/*<Route path="/ViewTemplates"        component={ViewTemplates}   exact />*/}
                      <Route path="/companysetting"       component={CompanySetting}  exact />
                    {/*Access Management*/}
                      <Route path="/admin/AddModuleFacility"                                      exact strict component={ AddModuleFacility } />
                      <Route path="/admin/AssignPermissionToModule"                               exact strict component={ AssignPermissionToModules } />

                     
                      { /*Ba Shipment List*/ }
                      <Route path="/ba-order-list"        exact strict component={ BaOrdersList } />
                      <Route path="/viewOrder/:orderID"   exact strict component={ viewOrder } />
                      
                      <Route path="/report"              exact strict component={ Reports } />
                      <Route path="/org-profile"          exact strict component={CompanyProfile} />
                     /* <Route path="basic-details" exact strict component={CorporateBasicInfo} />
                      <Route path="/corporate/basic-details/:entityID" exact strict component={CorporateBasicInfo} />
                      */
                   { /* Orgnizational Setting */}
                  <Route path="/appCompany/basic-details" exact strict component={OrgnizationalBasicInfo} />
                  <Route path="/appCompany/basic-details/:entityID" exact strict component={OrgnizationalBasicInfo} />
                  <Route path="/appCompany/location-details" exact strict component={OrganizationalLocationDetails} />
                  <Route path="/appCompany/location-details/:entityID" exact strict component={OrganizationalLocationDetails} />
                 <Route path="/appCompany/location-details/:entityID/:locationID" exact strict component={OrganizationalLocationDetails} />
                
                  <Route path="/appCompany/contact-details" exact strict component={OrganizationalContactDetails} />
                  <Route path="/appCompany/contact-details/:entityID" exact strict component={OrganizationalContactDetails} />
                  <Route path="/appCompany/contact-details/:entityID/:contactID" exact strict component={OrganizationalContactDetails} />

                      </Switch> 

                      {/*</div>*/}
                    </div>
                  </div>
                </div>
              </div>
              {/*<div className="leftsidebarbackgroundcolor">
                <div className="row">
                   <Leftsidebar />
                </div>
              </div>*/}
              
              </div>
         {/* </div>*/}
        </div>
        </div>
         <Footer />    
      </div>

                  </Router>
    );
    }else{
      console.log('elseeeee');
       return(
        <div>
          <Router>
            <Switch>
              <Route path="/"               exact strict component={ Login } />
              <Route path="/login"          exact strict component={ Login } />
              <Route path="/signup"         exact strict component={ SignUp } />
              <Route path="/forgot-pwd"     exact strict component={ ForgotPassword } />
              <Route path="/reset-pwd"      exact strict component={ ResetPassword } />
              <Route path="/verify-account" exact strict component={ VerifyAccount } />
              <Route path="/confirm-otp/:user_ID"    exact strict component={ ConfirmOtp } />
            </Switch>        
          </Router>
        </div>
      );
    }
  
  }

}
export default Layout;






