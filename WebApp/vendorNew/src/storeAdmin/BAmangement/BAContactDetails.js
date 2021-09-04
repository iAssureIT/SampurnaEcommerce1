import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import ContactDetails from '../../coreadmin/Master/EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';

function BAContactDetails(){
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <ContactDetails entity="Ba" 
                            roles={['Ba']} 
                            userRole="Ba" 
                            bookingRequired={true}
            />
        </div>
    );
}
export default BAContactDetails;

