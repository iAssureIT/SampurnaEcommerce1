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
              <ul className="list-unstyled components abc" style={{height:  sidebarHeight+"px"}} >
                <li className="active sidebarMenuText add">
                  <a href="/dashboard">
                    <i className="fa fa-dashboard"></i>
                    Dashboard
                  </a>
                </li>
                
                <li className="sidebarMenuText">
                  <a href="#Plan" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-pie-chart" />
                    Product Management
                    <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="Plan">
                      <li>
                        <a href="/add-product">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Add Product</span>
                        </a>
                      </li>
                      <li>
                        <a href="/product-upload">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Product Bulk Upload</span>
                        </a>
                      </li>  
                      <li>
                        <a href="/product-list">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Product List</span>
                        </a>
                      </li>  
                      <li>
                        <a href="/file-wise-product-list">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">File Wise Product List</span>
                        </a>
                      </li>   
                      <li>
                        <a href="/product-image-bulk-upload">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Image Bulk Upload</span>
                        </a>
                      </li>   
                      
                  </ul>
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
                      <a href="/purchase-management">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Raw Material Inward</span>
                      </a>
                    </li>
                    <li>
                      <a href="/raw-material-stock-report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Raw Material Stock Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/finished-goods">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Finished Goods Inward</span>
                      </a>
                    </li>
                    <li>
                      <a href="/franchise-shopping-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Finished Goods Ourward</span>
                      </a>
                    </li>

                    <li>
                      <a href="/admin-shopping-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Consolidate Purchase Orders</span>
                      </a>
                    </li>


                    <li>
                      <a href="/franchise-shopping-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Franchise Shopping List</span>
                      </a>
                    </li>
                    <li>
                      <a href="/franchise-order-summary">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Franchise Order Summary</span>
                      </a>
                    </li>
                    <li>
                      <a href="/franchise-allowable-pincode">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Allowable Pincode</span>
                      </a>
                    </li>                    
                  </ul>
                </li>
                <li className="sidebarMenuText add">
                  <a href="/distribution">
                    <i className="fa fa-industry"></i>
                    Distribution Management
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="#baData" data-toggle="collapse" aria-expanded="false">
                    <i className="glyphicon glyphicon-briefcase" />
                    Business Associates
                     <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="baData">
                    <li>
                      <a href="/addNewBA">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Add Business Associate</span>
                      </a>
                    </li>
                    <li>
                      <a href="/ba-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Business Associates List</span>
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="active sidebarMenuText add">
                  <a href="/vendor/list">
                    <i className="fa fa-industry"></i>
                    Vendor Master
                  </a>
                </li>

                <li className="active sidebarMenuText add">
                  <a href="/franchise/list">
                    <i className="fa fa-industry"></i>
                    Franchise Master
                  </a>
                </li>

                {/*<li className="sidebarMenuText">
                  <a href="#vendors" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-industry" />
                    Vendor Management
                     <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="vendors">
                    <li>
                      <a href="/vendor/basic-details">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Add Vendor</span>
                      </a>
                    </li>
                    <li>
                      <a href="/vendor/list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Vendor List</span>
                      </a>
                    </li>
                  </ul>
                </li>*/}

                {/*<li className="sidebarMenuText">
                  <a href="#franchise" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-industry" />
                    Franchise Management
                     <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="franchise">
                    <li>
                      <a href="/franchise/list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Franchise Master</span>
                      </a>
                    </li>
                    <li>
                      <a href="/franchise-allowable-pincode">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Allowable Pincode</span>
                      </a>
                    </li>                    
                  </ul>
                </li>*/}





{/*                <li className="sidebarMenuText">
                  <a href="/">
                    <i className="fa fa-percent"></i>
                    Discount Management
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/">
                    <i className="fa fa-star"></i>
                    Product Rating System
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/">
                    <i className="fa fa-copyright"></i>
                    Content Management
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/">
                    <i className="fa fa-file"></i>
                    Agreement Management
                  </a>
                </li>*/}
                
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




                <li className="sidebarMenuText">
                  <a href="#productreview" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    Product Review
                    <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="productreview">
                    <li>
                      <a href="/productreview">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Product Review</span>
                      </a>
                    </li>
                  </ul>
                </li>



                
                <li className="sidebarMenuText">
                  <a href="#MasterData" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-university" />
                    Master Data
                    <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="MasterData">                    
                    <li>
                      <a href="/taxname">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Tax Master</span>
                      </a>
                    </li>
                    <li>
                      <a href="/taxrate">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Tax Rate Master</span>
                      </a>
                    </li>
                    <li>
                      <a href="/vendor-category">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Vendor Category</span>
                      </a>
                    </li>
                    <li>
                      <a href="/vendor-location-type">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Vendor Location Type</span>
                      </a>
                    </li>
                    <li>
                        <a href="/category-management">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Category Master</span>
                        </a>
                      </li>
                      <li>
                        <a href="/section-management">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Section Master</span>
                        </a>
                      </li>
                      <li>
                      <a href="/warehouse">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Warehouse Master</span>
                      </a>
                    </li>   
                  </ul>
                </li>  
                <li className="sidebarMenuText">
                  <a href="#CmsData" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-university" />
                    CMS
                    <i className="fa fa-sort-down pull-right"></i>
                  </a>
                  <ul className="collapse list-unstyled" id="CmsData">
                    <li>
                      <a href="/viewpage1">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Create Page</span>
                      </a>
                    </li>
                    <li>
                      <a href="/viewblock1">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Create Block</span>
                      </a>
                    </li>
                    <li>
                      <a href="/static-block-list">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Static Blocks</span>
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
