import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';
import {withRouter}  from 'react-router-dom';


import ListOfEntities from '../../coreadmin/Master/EntityMaster/listOfEntities/components/ListOfEntities.jsx';

function ListOfEntitiesPage(){
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <ListOfEntities entity="franchise" />
        </div>
    );
}
export default withRouter (ListOfEntitiesPage);

