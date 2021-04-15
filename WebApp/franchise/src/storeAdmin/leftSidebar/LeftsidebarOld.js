import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";

// import Header from '../header/Header.js'
import './Leftsidebar.css';

export default class Leftsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
   
  componentDidMount(){
     /*$(document).ready(function () {
     $('#sidebarCollapse').on('click', function () {
         $('#sidebar').toggleClass('active');
     });
  });*/
  }   


   eventclk(event){
    event.preventDefault();
    $(event.currentTarget).addClass('active');
    $(event.currentTarget).siblings('li').removeClass('active');
    // $(event.currentTarget).siblings('li').children('.treeview-menu').toggle();

  }

  eventclk1(event){
    event.preventDefault();
    $(event.currentTarget).children('.treeview-menu').toggle();
    $(event.currentTarget).addClass('active');
    $(event.currentTarget).siblings('li').removeClass('active');
    // $(event.currentTarget).siblings('li').children('.treeview-menu').toggle();

  }  

  clickLiTree(event){
    event.preventDefault();
    $(event.target).parent().addClass('activeLi');
    var checkli = $(event.target).parent().siblings('li').removeClass('activeLi');
  }

  clickTree(event){
      event.preventDefault();
      console.log('$(event.currentTarget)',$(event.currentTarget));
      $(event.currentTarget).addClass('activetree');
      $(event.currentTarget).siblings('li').removeClass('activetree');
      $(event.currentTarget).siblings('li').removeClass('menu-open');
      $(event.currentTarget).siblings('li').children('.treeview-menu').css('display','none');
      $(event.currentTarget).siblings('li').children('.treeview-menu').children().removeClass('activeLi');
  }   

  render(){
    // console.log('screen height',  window.screen.height );  
    var sidebarHeight = window.screen.height - 225;
    return(
      <div>
        <aside className="leftsidebar">
          <div className="wrapper">
            <nav id="sidebar">
              <div className="sidebar-header">
                <h4 className="text-center"><b><label  className="headerImage">UniMandai Franchise</label></b></h4>
                {/* <strong><img className="slidlogo" src="/images/logoUnimandai.png"/></strong> */}
                <strong className="umSmall">UM</strong>
              </div>
              <ul className="list-unstyled components abc" style={{height:  sidebarHeight+"px"}} >
                <li className="active sidebarMenuText add">
                  <a href="/dashboard">
                    <i className="fa fa-dashboard"></i>
                    Dashboard
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="#Shipment" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-map-marker" />
                    Order Management
                     <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="Shipment">
                    <li>
                      <a href="/allorders">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">All Orders</span>
                      </a>
                    </li>
                    <li>
                      <a href="/new-orders-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">New Order List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/verified-orders-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Verified Order List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/packed-orders-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Packed Order List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/inspected-orders-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Inspected Order List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/approved-orders-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Approved Order List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/dispatched-orders-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Dispatched Order List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/delivery-initiated-orders">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Delivery Initiated Orders</span>
                      </a>
                    </li>
                    <li>
                      <a href="/delivered-orders-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Delivered Order List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/returned-products">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Returned Products</span>
                      </a>
                    </li>
                  </ul>
                </li> 

                 <li className="sidebarMenuText">
                  <a href="#baData1" data-toggle="collapse" aria-expanded="false">
                    <i className="glyphicon glyphicon-briefcase" />
                        Inventory Management
                     <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="baData1">
                    <li>
                      <a href="/franchise-allowable-pincode">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Allowable Pincode</span>
                      </a>
                    </li>  
                    <li className="noPadLR">
                      <a href="/franchise-product-stock" data-id="/franchise-product-stock" title="Franchise Order Summary">
                        <i className="fa fa-circle-o dashr" aria-hidden="true"></i>
                        <span className="sidebarMenuTitle">Products Current Stock</span>
                      </a>
                    </li>                  
                  </ul>
                </li>

                 <li className="sidebarMenuText">
                  <a href="#myorders" data-toggle="collapse" aria-expanded="false">
                    <i className="glyphicon glyphicon-briefcase" />
                      My Orders
                     <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="myorders">
                    <li>
                      <a href="/franchise-shopping-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Add Order</span>
                      </a>
                    </li>
                    <li>
                      <a href="/franchise-order-summary">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Order Summary</span>
                      </a>
                    </li>                
                  </ul>
                </li>
                <li className="sidebarMenuText">
                  <a href="#Report" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-money" />
                    Billing Management
                    <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="Report">
                  <li>
                    <a href="/franchise-billing">
                      <i className="fa fa-circle-o" /> 
                      New Bill
                    </a>
                  </li>
                  <li>
                    <a href="/return-bill">
                      <i className="fa fa-circle-o" /> 
                      Return Products
                    </a>
                  </li>
                  </ul>
                </li>
              
                {/* <li>
                  <a href="/list-bills">
                    <i className="fa fa-money" /> 
                    All Bills
                  </a>
                </li> */}
                
                <li className="sidebarMenuText">
                  <a href="#Report" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-line-chart" />
                    Reports
                    <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="Report">
                    <li>
                      <a href="/report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Sales Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/category-wise-reports">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Category Wise Sales Report</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
