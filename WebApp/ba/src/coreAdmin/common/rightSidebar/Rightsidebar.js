import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import { render } from 'react-dom';
import {BrowserRouter as Router, Route,Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";


import './Rightsidebar.css';

export default class Rightsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
   
componentDidMount(){
                 
          }    
  

  render(){
     return(
      <Router>
        <div>
          <aside className="leftsidebar">
            <div className="wrapper">
              <nav id="sidebar1">       
                <ul className="list-unstyled components">
                  <li className="active">
                    <div className="rightsideHeading ">
                       <span className="sidebarMenuSubText">Admin Activities</span>
                    </div>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/org-profile" title="Organization Settings" >
                      <i className="fa fa-building addCircle" />
                      <span className="sidebarMenuSubText">Organization Settings</span>
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/ViewTemplates" title="Notification Management">
                      <i className="fa fa-envelope yellowColor" />
                       <span className="sidebarMenuSubText">Notification Management</span>
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/umlistofusers"  title="User Management">
                       <i className="glyphicon fa fa-users greenColor"></i> 
                         <span className="sidebarMenuSubText"> User Management</span>
                    </a>
                  </li>
                  
                  <li className="sidebarMenuText">
                      <a href="/technical-master" title="Technical Masters">
                        <i className="fa fa-th-large yellowColor"></i>  
                        <span className="sidebarMenuSubText">Technical Masters </span>
                      </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </Router>
    );
  }
}
