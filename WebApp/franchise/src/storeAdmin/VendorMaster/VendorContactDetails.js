import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import ContactDetails from '../../coreadmin/Master/EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';

function VendorContactDetails(){
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <ContactDetails entity="Vendor" 
                            roles={['employee','manager','Vendoradmin']} 
                            userRole="employee" 
                            bookingRequired={true}
            />
        </div>
    );
}
export default VendorContactDetails;

