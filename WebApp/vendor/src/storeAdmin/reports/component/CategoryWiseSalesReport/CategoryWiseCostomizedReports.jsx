import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
import { browserHistory } from 'react-router';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Orders } from "/imports/StoreManagement/orders/api/orderMaster.js";
import { withTracker }      from 'meteor/react-meteor-data';

class CategoryWiseReportsCustomisedList extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            "reportData":[],
            
        }
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        
    }

    componentDidMount(){
        this.dataTableList();
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.reportData){
            this.setState({
                reportData : nextProps.reportData
            });
        }
    }
    handleFromChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
           [name] : event.target.value,
       });

       var dateVal = event.target.value;
       var dateUpdate = new Date(dateVal);
       Session.set('newFromDate',dateUpdate);
    }
    handleToChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
           [name] : event.target.value,
       });

       var dateVal = event.target.value;
       var dateUpdate = new Date(dateVal);
       Session.set('newToDate',dateUpdate);
    }

    currentFromDate(){
        if(Session.get('newFromDate')){
            var today = Session.get('newFromDate');
        } else {
            var today = new Date();
        }
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        }
        if(mm<10){
            mm='0'+mm;
        }
        var today = yyyy+'-'+mm+'-'+dd;
        var today = yyyy+'-'+mm+'-'+dd;

        return today;
    }

    currentToDate(){
        if(Session.get('newToDate')){
            var today = Session.get('newToDate');
        } else {
            var today = new Date();
        }
        // var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        }
        if(mm<10){
            mm='0'+mm;
        }
        var today = yyyy+'-'+mm+'-'+dd;
        var today = yyyy+'-'+mm+'-'+dd;

        return today;
    }

    dataTableList(){
		
        
        var selectedDateFrom = Session.get('newFromDate');
		if(selectedDateFrom){
			var newDateFrom  = new Date(selectedDateFrom);
		}else{
			var newDateFrom  = new Date();
		}

        var selectedDateTo = Session.get('newToDate');
		if(selectedDateTo){
			var newDateTo  = new Date(selectedDateTo);
		}else{
			var newDateTo  = new Date();
        }
        
		var reportData = [];
        if(this.props.selectedCategory){
            if(this.props.selectedSubCategory){
                reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }else{
                reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }
        }else{
            reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
        }
        this.setState({
            reportData : reportData
        });
    }
   
    render(){
        if(!this.props.loading){
            return( 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="sales-report-main-class">
                        <div className="reports-select-date-boxmain">
                            <div className="reports-select-date-boxsec">
                                <div className="reports-select-date-Title">Customized Sales Report</div>
                                <div className="reports-select-date-fromto">
                                    <div className="reports-select-date-from1">
                                        <div className="reports-select-date-from2">
                                            From
                                        </div>
                                        <div className="reports-select-date-from3">
                                            <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.currentFromDate()} type="date" className="reportsDateRef form-control" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className="reports-select-date-to1">
                                        <div className="reports-select-date-to2">
                                            To
                                        </div>
                                        <div className="reports-select-date-to3">
                                            <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.currentToDate()} type="date" className="reportsDateRef form-control" placeholder=""   />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="report-list-downloadMain">
                             <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button btn report-list-downloadXLXS"
                                table="subscriber-list-outerTable"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="Download as XLS"/>
                        </div>
                    </div>
                
                    <div>
                        <div className="reports-table-main">
                            <table  id="subscriber-list-outerTable" className="table iAssureITtable-bordered table-striped table-hover">
                                <thead className="tempTableHeader">
                                <tr>
                                    <th className=" umDynamicHeader srpadd">Date</th>
                                    <th className=" umDynamicHeader srpadd">Order No.</th>
                                    <th className=" umDynamicHeader srpadd">Category</th>
                                    <th className=" umDynamicHeader srpadd">SubCategory</th>
                                    <th className=" umDynamicHeader srpadd">Transaction Type</th>
                                    <th className=" umDynamicHeader srpadd">Product Count</th>
                                    <th className=" umDynamicHeader srpadd">Quantity</th>
                                    <th className=" umDynamicHeader srpadd">Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                
                                     {this.state.reportData && this.state.reportData.length > 0 ?
                                        this.state.reportData.map((reportData, index)=>{
                                            return(
                                                <tr key={reportData._id}>
                                                    <td>{moment(reportData.createdAt).format('LL')}</td>
                                                    <td className="textAlignRight">{reportData.OrderId}</td>
                                                    <td className="textAlignRight">{this.props.selectedCategory ? this.props.selectedCategory : '-'}</td>
                                                    <td className="textAlignRight">{this.props.selectedSubCategory ? this.props.selectedSubCategory : '-'}</td>
                                                    <td>{reportData.paymentMethod}</td>
                                                    <td className="textAlignRight">{reportData.productLength}</td>
                                                    <td className="textAlignRight">{reportData.totalQuantity}</td>
                                                    <td className="textAlignRight">{(parseInt(reportData.totalAmount)).toFixed(2)}</td>
                                                </tr>
                                            );
                                        })                                    
                                        :
                                        null
                                       }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
            );
        }else{
            return(
                <div className="col-sm-12 col-xs-12 col-lg-8 col-lg-offset-4 col-md-12 loadingImg loaderDiv"><img className="ldrImageforbulk" src="/images/loadersglms.gif" alt="loading"/></div>
            );
        }
    }
}
export default CustomisedList = withTracker(props =>{
    var selectedDateFrom = Session.get('newFromDate');
    if(selectedDateFrom){
        var newDateFrom  = new Date(selectedDateFrom);
    }else{
        var newDateFrom  = new Date();
    }

    var selectedDateTo = Session.get('newToDate');
    if(selectedDateTo){
        var newDateTo  = new Date(selectedDateTo);
    }else{
        var newDateTo  = new Date();
    }
        
    const reportHandle = Meteor.subscribe("OrdersData");
    var reportData = [];
    if(props.selectedCategory){
        if(props.selectedSubCategory){
            reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory, subCategory: props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
        }else{
            reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
        }
    }else{
        reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
    }
    const loading = !reportHandle.ready();
return{
    loading,
    reportData,
};
})(CategoryWiseReportsCustomisedList);