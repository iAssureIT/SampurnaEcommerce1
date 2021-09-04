import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import BasicInfo from '../../coreadmin/Master/EntityMaster/Onboarding/basicInfo/BasicInfo.jsx';

function BABasicInfo() {
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <BasicInfo entity="Ba" />
        </div>
    );
}
export default BABasicInfo;

