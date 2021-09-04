import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import LocationDetails from '../../coreadmin/Master/EntityMaster/Onboarding/locationDetails/LocationDetails.jsx';

function VendorLocationDetails(){
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <LocationDetails entity="Vendor" />
        </div>
    );
}
export default VendorLocationDetails;

