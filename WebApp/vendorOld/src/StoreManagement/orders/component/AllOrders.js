import React,{Component} 										from 'react';
import { render } 												from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import axios                  								from 'axios';
import swal                             					from 'sweetalert';
import $ 															from "jquery";
import moment 														from 'moment';

import VendorOrdersList 											from './VendorOrdersList.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


export default class AllOrders extends Component{
  
  	constructor(props) {
   	super(props);
    	this.state = {
      	"data" 					: [],
      	"allProductsArray" 	: []
    	}
    	this.getOrders = this.getOrders.bind(this);
  	}
   
  	componentDidMount(){
    	var userDetails  	= JSON.parse(localStorage.getItem("userDetails"));
    	var token       	= userDetails.token;
    	axios.defaults.headers.common['Authorization'] 	= 'Bearer '+ token;

    	this.getOrders();
    	var websiteModel 	= (localStorage.getItem('websiteModel'));
    	this.setState({
      	websiteModel 	 : websiteModel,
         vendorID      : userDetails.companyID
    	},()=>{})
  	}   

  	getOrders(){
      var orderFilterData= {};
      orderFilterData.vendorID = this.state.vendorID;
      axios.post("/api/vendororders/get/get_orders",orderFilterData)
      .then((response)=>{
        	console.log("response.data of order==>",response.data)
        	var UsersArray 		= [];
        	var allProductsArray = [];
       	for (let i = 0; i < response.data.length; i++) {
         	var _id 							= response.data[i]._id;
         	var orderID 					= response.data[i].orderID;
         	var vendorOrderID 			= response.data[i].vendorOrderID;
         	var allocatedToFranchise 	= response.data[i].allocatedToFranchise ?response.data[i].allocatedToFranchise.companyName : null;
         	var userFullName 				= response.data[i].userFullName;
         	var totalQuantity 			= response.data[i].cartQuantity;
         	var shippingtime 				= response.data[i].shippingtime;
         	var currency 					= response.data[i].currency;
         	var totalAmount 				= response.data[i].total;
         	var productarr 				= [];
         	var productCount 				= response.data[i].products.length();
         	// var billNumber = response.data[i].billNumber ? response.data[i].billNumber : '';
         	
         	console.log("productCount----",productCount);
         	for(let j in response.data[i].products){
             	allProductsArray.push(response.data[i].products[j]);
             	productarr.push(response.data[i].products[j].productName +' '+response.data[i].products[j].quantity )
         	}

         	var createdAt 			= moment(response.data[i].createdAt).format("DD/MM/YYYY hh:mm a");
         	var status 				= response.data[i].status;
         	var deliveryStatus 	= response.data[i].deliveryStatus[response.data[i].deliveryStatus.length-1].status === "Dispatch" ? 'Out for Delivery' : response.data[i].deliveryStatus[response.data[i].deliveryStatus.length-1].status;
         	var viewOrder 			=  "/viewOrder/"+response.data[i]._id;
         	var deliveryStatus 	=  response.data[i].deliveryStatus[response.data[i].deliveryStatus.length-1].status;

         	var UserArray 			= [];
         	UserArray.push(orderID);
         	// UserArray.push(vendorOrderID);
         	// UserArray.push(billNumber);

         	console.log("allocatedToFranchise",allocatedToFranchise);
         	if(this.state.websiteModel === 'FranchiseModel'){
           		if(allocatedToFranchise){
             		UserArray.push(allocatedToFranchise);
           		}else{
             		UserArray.push('');
           		}
         	}else{
           		UserArray.push("");
         	}
         	UserArray.push(productarr.toString());
         	UserArray.push(<i className={"fa fa-"+currency}>&nbsp;{(parseInt(totalAmount)).toFixed(2)}</i>);
         	UserArray.push(createdAt);
         	UserArray.push({_id :_id, status : status, deliveryStatus : deliveryStatus});
         	UserArray.push({_id:_id, viewOrder:viewOrder, deliveryStatus:deliveryStatus});         
         	UsersArray.push(UserArray);
         	UserArray.push(userFullName);
         	// UserArray.push(totalQuantity);
         	// UserArray.push(shippingtime);
       	}

     		//  console.log("UsersArray",UsersArray);
       	this.setState({
         	data 					: UsersArray,
         	allProductsArray 	: allProductsArray
       	});

       	this.setState({
         	orderData : response.data
       	});

   	})
   	.catch((error)=>{
       	console.log('error', error);
       	if(error.message === "Request failed with status code 401"){
         	var userDetails =  localStorage.removeItem("userDetails");
         	localStorage.clear();
         	swal({  
             	title : "Your Session is expired.",                
             	text 	: "You need to login again. Click OK to go to Login Page"
         	})
         	.then(okay => {
         		if (okay) {
             		window.location.href = "/login";
         		}
         	});
       	}
   	})
	}

  	render(){
    	return(
      	<div>
      		<VendorOrdersList tableTitle={'All Orders'} data={this.state.data} allProductsArray={this.state.allProductsArray} getOrdersFun={this.getOrders}/>
      	</div>
      );    
  	}
}
