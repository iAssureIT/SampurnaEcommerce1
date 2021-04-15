import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import BasicInfo from '../../coreadmin/Master/EntityMaster/Onboarding/basicInfo/BasicInfo.jsx';

function VendorBasicInfo() {
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <BasicInfo entity="Vendor" />
        </div>
    );
}
export default VendorBasicInfo;

