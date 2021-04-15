import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import ListOfEntities from '../../coreadmin/Master/EntityMaster/listOfEntities/components/ListOfEntities.jsx';

function VendorListOfEntities(){
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <ListOfEntities entity="Vendor" />
        </div>
    );
}
export default VendorListOfEntities;

