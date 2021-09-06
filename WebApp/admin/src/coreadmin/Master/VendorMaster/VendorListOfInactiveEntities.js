import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import ListOfInactiveEntities from '../EntityMaster/listOfEntities/components/ListOfInactiveEntities.jsx';

function VendorListOfInactiveEntities(){
    return (    	
        <div className="">
            <ListOfInactiveEntities entity="vendor" bulkRequired = {true} />
        </div>
    );
}
export default VendorListOfInactiveEntities;