import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';



import './Infocomponent.css';

// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class Infocomponent extends Component{
  
  constructor(props) {
   super(props);
    this.state = {

    }
    // console.log('props = ',this.props);
  }
   
  componentDidMount(){
 
}

    
  render(){
    return(
          <div className="col-lg-4 box3">     
            <div className="col-lg-12 box3a">
              <div className="row">
                  <div className="col-lg-4 box3aicon">
                    <i className={"fa fa-user"}></i>
                  </div>
                  <div className="col-lg-8 innerbox">
                    <div className="col-lg-12">
                      <label>Total Users</label>  <span>1500</span>                    
                    </div>
                    <div className="col-lg-12">
                      <label>Online Users</label>  <span>1000</span>                    
                    </div>
                  </div>
              </div>
            </div>
          </div>

      );
  }
}
