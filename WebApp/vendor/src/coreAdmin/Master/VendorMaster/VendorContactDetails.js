import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import ContactDetails from '../EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';

function VendorContactDetails(){
    return (
        <div className="">
            <ContactDetails entity="Vendor" 
                            roles={['vendorstaff','vendoradmin']} 
                            userRole="vendorstaff" 
                            bookingRequired={false}
            />
        </div>
    );
}
export default VendorContactDetails;