import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';



import './Footer.css';

// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class Footer extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
   
  componentDidMount(){
 
}

    
  render(){
    return(
          <footer className="main-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="pull-right hidden-xs hidden-sm">
              <strong className="WebsiteName"> Designed & Developed By <a href="http://iassureit.com/" className="comnm" target="_blank">iAssure International Technologies Pvt.Ltd.</a></strong>
                
            </div>
            <div className="pull-left hidden-xs hidden-sm Copyright paddingLeft145">
              <strong className="footerTwoMargin ">Copyright &copy; 2021 <a href="http://iassureit.com">iAssureIT</a>.</strong>  All rights
              reserved.
            </div>
        </footer>
      );
  }
}
