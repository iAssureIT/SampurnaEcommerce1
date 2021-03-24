import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import $ from "jquery";

import Header from '../common/header/Header.js';
import VendorSelector from '../common/VendorSelector/VendorSelector.js';
import Footer from '../common/footer/Footer.js'
import Dashboard from '../dashboard/Dashboard.js'
import Leftsidebar from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar from '../common/rightSidebar/Rightsidebar.js'

import UMListOfUsers from '../userManagement/UM/UMListOfUsers.js';
import EditUserProfile from '../userManagement/UM/EditUserProfile.js';
import UMRolesList from '../userManagement/Roles/UMRolesList.js';
import CompanySetting from '../companysetting/Components/CompanySetting.js';
// import ViewTemplates from '../NotificationManagement/ViewTemplates.jsx';



//============== Product Management ==============//
import AddNewShopProduct from '../../storeAdmin/product/addNewProduct/AddNewShopProduct/AddNewShopProduct.js';
import AddNewProductImages from '../../storeAdmin/product/addNewProduct/AddNewProductImages/AddNewProductImages.js';
import CategoryManagement from '../../storeAdmin/product/categoryManagement/component/CategoryManagement.js';
import SectionManagement from '../../storeAdmin/product/sectionManagement/component/SectionManagement.js';
import UpdateBulkProduct    from '../../StoreManagement/product/productBulkUpload/component/productUpdateBulkUpload.js';


import AddNewBulkProduct from '../../StoreManagement/product/productBulkUpload/component/ProductBulkUpload.js';
import TemplateManagement from '../../StoreManagement/product/productBulkUpload/component/TemplateManagement.js';

import ProductList from '../../StoreManagement/product/productList/component/ProductList.js';
import BulkProductImageUpload from '../../storeAdmin/bulkimageUpload/BulkProductImageUpload.js'
import FileWiseProductList from '../../StoreManagement/product/fileproductList/component/FileWiseProductList.js';

import AllOrdersList from '../../StoreManagement/orders/component/AllOrders.js';
import NewOrdersList from '../../StoreManagement/orders/component/NewOrdersList.js';
import VerifiedOrdersList from '../../StoreManagement/orders/component/VerifiedOrdersList.js';
import PackedOrdersList from '../../StoreManagement/orders/component/PackedOrdersList.js';
import InspectedOrdersList from '../../StoreManagement/orders/component/InspectedOrdersList.js';
import ApprovedOrdersList from '../../StoreManagement/orders/component/ApprovedOrdersList.js';
import DispatchedOrdersList from '../../StoreManagement/orders/component/DispatchedOrdersList.js';
import DeliveryInitiatedOrders from '../../StoreManagement/orders/component/DeliveryInitiatedOrders.js';
import DeliveredOrders from '../../StoreManagement/orders/component/DeliveredOrders.js';
import ReturnProducts from '../../StoreManagement/orders/component/ReturnProducts.js';

import BaList from '../../storeAdmin/baManagement/listOfBAs/components/BusinessAssociateList.js';

import AddNewBA from '../../storeAdmin/baManagement/BAOnboarding/basicInfo/basicInfo.js';

import ProductDetails from '../../StoreManagement/product/ProductDetails/ProductDetails.js';

import viewOrder from '../../StoreManagement/orders/component/viewOrder.js';


//================== Reports ===============//
import Reports from '../../admin/Reports/Reports.js';
import CategoryWiseReports from '../../admin/categoryWiseReports/Reports.js';
import Productreview from '../../storeAdmin/Productreview/Productreview.js';

// import ImageUpload from '../../ImageUpload/ImageUpload.js';


// Section: 1 - SystemSecurity ******************************************************
import Login from '../systemSecurity/Login.js';
import ConfirmOtp from '../systemSecurity/ConfirmOtp.js';
import ForgotPassword from '../systemSecurity/ForgotPassword.js';
import ResetPassword from '../systemSecurity/ResetPassword.js';
import SignUp from '../systemSecurity/SignUp.js';
import VerifyAccount from '../systemSecurity/VerifyAccount.js';

//============ Vendor Management =============
import VendorOnboardingForm from '../../storeAdmin/vendorManagement/VendorOnboarding/VendorOnboardingForm/VendorOnboardingForm.jsx';
import BasicInfo from '../../storeAdmin/vendorManagement/VendorOnboarding/basicInfo/BasicInfo.jsx';
import LocationDetails from '../../storeAdmin/vendorManagement/VendorOnboarding/locationDetails/LocationDetails.jsx';
import ContactDetails from '../../storeAdmin/vendorManagement/VendorOnboarding/contactDetails/ContactDetails.jsx';
import ListOfVendor from '../../storeAdmin/vendorManagement/listOfVendors/components/ListOfVendor.jsx';
import VendorCategory from '../../storeAdmin/vendorManagement/MasterData/VendorCategory/VendorCategory.jsx';
import VendorLocationType from '../../storeAdmin/vendorManagement/MasterData/VendorLocationType/VendorLocationType.jsx';

//============ Tax Master =============
import TaxName from '../TaxName/TaxName.js';
import TaxRate from '../TaxRate/TaxRate.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

class Layout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    }
  }

  componentDidMount() {
   /* $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });

    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#headerid').toggleClass('headereffect');
        $('#sidebarCollapse').toggleClass('sidebarCollapse80');
      });
    });
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#dashbordid').toggleClass('dashboardeffect');
      });
    });*/


    const token = localStorage.getItem("user_ID");
    // console.log("Dashboard Token = ", token);
    if (token !== null) {
      // console.log("*********===***********imin ",token);
      this.setState({
        loggedIn: true
      })
    } else {
      // console.log("token is not available");
    }

  }

  logout() {
    var token = localStorage.removeItem("user_ID");
    if (token !== null) {
      // console.log("Header Token = ", token);
      this.setState({
        loggedIn: false
      })
      // browserHistory.push("/login");
      // this.props.history.push("/login");
    }
  }



  render() {
    if (this.state.loggedIn === true) {
      // console.log('if');
      window.onscroll = function () { scrollFunction() };

      function scrollFunction() {
        if (document.getElementById("mySidenav")) {
          if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
            document.getElementById("mySidenav").style.top = "0";
          } else {
            document.getElementById("mySidenav").style.top = "50px";
          }

        }

      }

      return (

       <Router> 
        <div className="hold-transition skin-blue fixed sidebar-mini">
          <div className="content-wrapper">
            <div className="wrapper">
              <Header />
             
              
              <div className="row">
               <Leftsidebar />
                <div className="container-fluid main-container">
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mrBt15">
                   <div className="dashboardWrapper">
                    <div className="backColor col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                {/*<div className="">
                  <VendorSelector />
                </div>*/}
                
                  <Switch>

                    /*{<Route path="/" component={Dashboard} exact />}*/
                    <Route path="/dashboard" component={Dashboard} exact />

                    {/*Admin Routes*/}
                    <Route path="/umlistofusers" component={UMListOfUsers} exact />
                    <Route path="/umroleslist" component={UMRolesList} exact />
                    <Route path="/edituserprofile/:userID" component={EditUserProfile} exact />
                    {/* <Route path="/ViewTemplates" component={ViewTemplates} exact /> */}
                    <Route path="/companysetting" component={CompanySetting} exact />

                    {/* Product Management */}
                    <Route path="/product-details/:productID" exact strict component={ProductDetails} />
                    <Route path="/add-product" exact strict component={AddNewShopProduct} />
                    <Route path="/add-product/:productID" exact strict component={AddNewShopProduct} />
                    <Route path="/add-product/image/:productID" exact strict component={AddNewProductImages} />
                    <Route path="/category-management" exact strict component={CategoryManagement} />
                    <Route path="/category-management/:categoryID" exact strict component={CategoryManagement} />
                    <Route path="/section-management" exact strict component={SectionManagement} />
                    <Route path="/section-management/:sectionID" exact strict component={SectionManagement} />
                    <Route path="/product-upload" exact strict component={AddNewBulkProduct} />
                    <Route path="/template-management" exact strict component={TemplateManagement} />
                    <Route path="/template-management/:template_ID" exact strict component={TemplateManagement} />
                    <Route path="/product-list" exact strict component={ProductList} />
                    <Route path="/product-image-bulk-upload" exact strict component={BulkProductImageUpload} />
                    <Route path="/file-wise-product-list" exact strict component={FileWiseProductList} />
                    <Route path="/update_product-upload"                            exact strict component={UpdateBulkProduct} />
                    {/* <Route path="/image" exact strict component={ImageUpload} /> */}

                    {/* Vendor Management */}
                    <Route path="/vendor-onboarding" exact strict component={BasicInfo} />
                    <Route path="/vendor-onboarding/:user_ID" exact strict component={BasicInfo} />
                    <Route path="/location-details/:user_ID" exact strict component={LocationDetails} />
                    <Route path="/location-details/:user_ID/:location_ID" exact strict component={LocationDetails} />
                    <Route path="/contact-details/:user_ID" exact strict component={ContactDetails} />
                    <Route path="/contact-details/:user_ID/:contactDetails_ID" exact strict component={ContactDetails} />
                    <Route path="/vendor-list" exact strict component={ListOfVendor} />
                    <Route path="/vendor-category" exact strict component={VendorCategory} />
                    <Route path="/vendor-category/:vendorID" exact strict component={VendorCategory} />
                    <Route path="/vendor-location-type" exact strict component={VendorLocationType} />
                    <Route path="/vendor-location-type/:locationTypeID" exact strict component={VendorLocationType} />

                    { /*Order List*/}
                    <Route path="/allorders" exact strict component={AllOrdersList} />
                    <Route path="/new-orders-list" exact strict component={NewOrdersList} />
                    <Route path="/verified-orders-list" exact strict component={VerifiedOrdersList} />
                    <Route path="/packed-orders-list" exact strict component={PackedOrdersList} />
                    <Route path="/inspected-orders-list" exact strict component={InspectedOrdersList} />
                    <Route path="/approved-orders-list" exact strict component={ApprovedOrdersList} />
                    <Route path="/dispatched-orders-list" exact strict component={DispatchedOrdersList} />
                    <Route path="/delivery-initiated-orders" exact strict component={DeliveryInitiatedOrders} />
                    <Route path="/delivered-orders-list" exact strict component={DeliveredOrders} />
                    <Route path="/returned-products" exact strict component={ReturnProducts} />

                    <Route path="/viewOrder/:orderID" exact strict component={viewOrder} />

                    { /*Ba List*/}
                    <Route path="/ba-list" exact strict component={BaList} />

                    <Route path="/editBA/:BaId" exact strict component={AddNewBA} />
                    <Route path="/BA/locationDetails/:locationEdit/:BaId" exact strict component={AddNewBA} />
                    <Route path="/BA/contactDetails/:contactEdit/:BaId" exact strict component={AddNewBA} />

                    <Route path="/addNewBA" exact strict component={AddNewBA} />


                    {/*Report*/}
                    <Route path="/report" exact strict component={Reports} />

                    <Route path="/category-wise-reports" exact strict component={CategoryWiseReports} />

                    <Route path="/productreview" exact strict component={Productreview} />
                    <Route path="/taxname" exact strict component={TaxName} />
                    <Route path="/taxname/:preferenceID" exact strict component={TaxName} />
                    <Route path="/taxrate" exact strict component={TaxRate} />
                    <Route path="/taxrate/:preferenceID/:taxRateID" exact strict component={TaxRate} />
                    
                  </Switch>
               
              
              </div>
            
           </div> 
           </div> 
          </div>
        </div>
       </div>
      </div> 
        <Footer />
      </div>  
    </Router>  
      );
    } else {
      // console.log('else');
      return (
        <div>
          <Router>
            <Switch>
              <Route path="/" exact strict component={Login} />
              <Route path="/login" exact strict component={Login} />
              <Route path="/signup" exact strict component={SignUp} />
              <Route path="/forgot-pwd" exact strict component={ForgotPassword} />
              <Route path="/reset-pwd" exact strict component={ResetPassword} />
              <Route path="/verify-account" exact strict component={VerifyAccount} />
              <Route path="/confirm-otp" exact strict component={ConfirmOtp} />
            </Switch>
          </Router>
        </div>
      );
    }

  }
}
export default Layout;