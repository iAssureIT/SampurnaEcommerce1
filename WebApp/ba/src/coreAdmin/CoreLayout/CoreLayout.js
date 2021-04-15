import React, { Component } from 'react';
import { connect }        from 'react-redux';
import { withRouter }       from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';



import EditUserProfile  from '../userManagement/UM/EditUserProfile.js';
import UserProfile      from '../userManagement/UM/UserProfile.js';
import UMRolesList      from '../userManagement/Roles/Roles.js';
import GlobalMasters    from '../companysetting/Components/GlobalMasters.js';
import TechnicalMaster  from '../companysetting/Components/TechnicalMasters.js';

import EventToken from '../NotificationManagement/EventToken.js';
import CreateTemplateNew from '../NotificationManagement/CreateTemplateNew.js';
import NotificationTemplate from '../NotificationManagement/NotificationTemplate.js';

//============ Entity Master ======================
import BasicInfo from '../Master/EntityMaster/Onboarding/basicInfo/BasicInfo.jsx';
import LocationDetails from '../Master/EntityMaster/Onboarding/locationDetails/LocationDetails.jsx';
import ContactDetails from '../Master/EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';
import ListOfEntities from '../Master/EntityMaster/listOfEntities/components/ListOfEntities.jsx';
import LocationType from '../Master/LocationType/LocationType.jsx';
import SelectVendor from '../Master/EntityMaster/SelectVendor/SelectVendor.js';
import CityClassification from '../Master/CityClassification/CityClassification.js';
import CityType from '../Master/CityType/CityType.js';


import CompanyPaymentGateway from '../companysetting/Components/CompanyPaymentGateway.js';
//============= Corporate Master ====================
import CorporateBasicInfo from '../Master/CorporateMaster/CorporateBasicInfo.js';
import CorporateLocationDetails from '../Master/CorporateMaster/CorporateLocationDetails.js';
import CorporateContactDetails from '../Master/CorporateMaster/CorporateContactDetails.js';
import CorporateListOfEntities from '../Master/CorporateMaster/CorporateListOfEntities.js';

//============= Vendor Master ====================
import VendorBasicInfo from '../Master/VendorMaster/VendorBasicInfo.js';
import VendorLocationDetails from '../Master/VendorMaster/VendorLocationDetails.js';
import VendorContactDetails from '../Master/VendorMaster/VendorContactDetails.js';
import VendorListOfEntities from '../Master/VendorMaster/VendorListOfEntities.js';

import CompanyProfile       from '../CompanyProfile/CompanyProfile.js';
//============= Supplier Master ====================
/*import SupplierBasicInfo from '../Master/SupplierMaster/SupplierBasicInfo.js';
import SupplierLocationDetails from '../Master/SupplierMaster/SupplierLocationDetails.js';
import SupplierContactDetails from '../Master/SupplierMaster/SupplierContactDetails.js';
*/
// ============ Payment Process =======================
import OrderPage from "../PaymentProcess/OrderPage.js";
import PlanPage from "../PaymentProcess/PlanPage.js";
import InvoicePage from "../PaymentProcess/InvoicePage.js";
import InvoicePageView from "../PaymentProcess/InvoicePageView.js";
import PaymentResponse from "../PaymentProcess/PaymentResponse.js";

// ============ Rate Master ===========================
import PackageMaster from "../PackageMaster/PackageMaster.js";

// ============ Orgnizational Setting ===========================
import OrgnizationalBasicInfo from "../OrganizationalSettings/OrganizationalBasicInfo.js";
import OrganizationalContactDetails from "../OrganizationalSettings/OrganizationalContactDetails.js";
import OrganizationalLocationDetails from "../OrganizationalSettings/OrganizationalLocationDetails.js";

// ============= One Field Component ==================


// import FuleType from "../Master/FuleType/FuleType.js"
// import DriverMaster from "../Master/DriverMaster/DriverMaster.js"
import EmployeeMaster from "../Master/EmployeeMaster/EmployeeMaster.js"
import GuestMaster   from "../Master/GuestMaster/GuestMaster.js"
import PersonMaster from "../Master/PersonMaster/PersonMaster.js"



import PackageMasterBulk from "../Master/BulkUploadPackageMaster/PackageMasterBulk.js"


import PersonList from "../Master/PersonMaster/PersonList.js"
import DepartmentBulkUpload from "../Master/Department/DepartmentBulkUpload.js"
import DesignationBulkUpload from "../Master/Designation/DesignationBulkUpload.js"
import DepartmentList    from "../Master/Department/DepartmentList.js"

import filewisePersonList from "../Master/PersonMaster/FilewisePersonList.js"

// import DesignationMapping from "../Master/DesignationMapping/DesignationMapping.js"

//import Model from "../Master/Model/Model.js"
// import Brand from "../Master/Brand/Brand.js"
// import VehicleBrandBulkUpload from "../Master/Brand/VehicleBrandBulkUpload.js"
// import VehicleModelBulkUpload from "../Master/Model/VehicleModelBulkUpload.js"
import Designation from "../Master/Designation/DesignationMaster-GlobalMaster.js"
import Department from "../Master/Department/DepartmentMaster-GlobalMaster.js"
// import PackageType from "../Master/PackageType/PackageType.js"
import Module from "../Master/Module/Module.js"
import Facility from "../Master/Facility/Facility.js"
// import ExpenseTypeMaster from "../Master/ExpenseTypeMaster/ExpenseTypeMaster.js"



// ============= Vehicle Master =======================
// import VehicleMaster from "../Master/VehicleMaster/VehicleMaster.js"

// ============= Booking Master =======================


// ============= Billing Management =======================
import BillingManagement from "../Master/BillingManagement/BillingManagement.js"
import GenerateBill from "../Master/BillingManagement/GenerateBill.js"
import BillingInvoice from "../Master/BillingManagement/BillingInvoice.js"
import BillView from "../Master/BillingManagement/BillView.js"

// ========================== access-management ====================
import AccessManagement from "../AccessManagement/AccessManagement.js"

//=============== Not found ================
import Notfound from "../Notfound/Notfound.js"

//=============== Broadcast System ================
import BroadcastSystem from "../BroadcastSystem/BroadcastSystem.js";



class CoreLayout extends Component {
    render() {

        return (
            <Switch >
               
              
                {/* <Route path="*" component={Notfound} /> */}

                {/* Broadcast-System */}
                <Route path="/broadcast-system" exact strict component={BroadcastSystem} />
                
            </Switch>
        );
    }
}




const mapStateToProps = (state)=>{
    // console.log(" state on Dashboard corporate==> ",state)
    return {
      userDetails   : state.userDetails,
    }
  };
  
  
  const mapDispatchToProps = (dispatch)=>{
    return {
    }
  };
  
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CoreLayout));

