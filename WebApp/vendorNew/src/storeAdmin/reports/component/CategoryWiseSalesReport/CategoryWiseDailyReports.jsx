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
import { Orders } from "/imports/StoreManagement/orders/api/orderMaster.js";
import { withTracker }          from 'meteor/react-meteor-data';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

class CategoryWiseReportsDailyList extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            "tableListData":[],
            "reportData" : [],
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        this.dataTableList();
        this.handleChange = this.handleChange.bind(this);      
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.reportData){
            this.setState({
                reportData : nextProps.reportData
            });
        }
    }
    handleChange(event){
        event.preventDefault();
        var target = event.target;
        var name = target.name;

        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        Session.set('newDate',dateUpdate);
        

        this.setState({
            [name] : event.target.value,
        });
   }

    currentDate(){
        var setDate = Session.get('newDate');

		if(setDate){
			var today = new Date(setDate);
		}else{
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

		return today;

	}
	previousDate(event){
		event.preventDefault();
		var selectedDate1 = $(".reportsDayRef").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() - (24*60*60*1000) );
		Session.set('newDate', newDate2);

	}
	nextDate(event){
		event.preventDefault();
		var selectedDate1 = $(".reportsDayRef").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
		Session.set('newDate', newDate2);

    }
    dataTableList(){
        var selectedDate = Session.get('newDate');
        if(selectedDate){
            var newDate  = selectedDate;
        }else{
            var newDate  = new Date();
        }
        var startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
        var endDate = new Date(startDate.getTime() + (24*60*60*1000) ); // next day at 0:0:0

        var reportData = [];
        if(this.props.selectedCategory){
            if(this.props.selectedSubCategory){
                reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }else{
                reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }
        }else{
            reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
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
                                <div className="reports-select-date-Title">Daily Reports</div>
                                <div className="input-group">
                                    <span onClick={this.previousDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                    <input onChange={this.handleChange} value={this.currentDate()} name="reportsDayRef" type="date" className="reportsDateRef reportsDayRef form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="reportsDayRef"  />
                                    <span onClick={this.nextDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
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
                            <table id="subscriber-list-outerTable" className="table iAssureITtable-bordered table-striped table-hover">
                                <thead className="tempTableHeader">
                                <tr >
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
                <div className="col-sm-12 col-xs-12 col-lg-8 col-lg-offset-4 col-md-12 loadingImg LoaderDiv"><img className="ldrImageforbulk" src="/images/Loadersglms.gif" alt="loading"/></div>
            );
        } 
        
    }
}

export default  DailyListContainer = withTracker(props=>{
    var selectedDate = Session.get('newDate');
    
    if(selectedDate){
        var newDate  = selectedDate;
    }else{
        var newDate  = new Date();
    }
    var startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
    var endDate = new Date(startDate.getTime() + (24*60*60*1000) ); // next day at 0:0:0

    const reportHandle = Meteor.subscribe("OrdersData");
    var reportData = [];
    if(props.selectedCategory){
        if(props.selectedSubCategory){
            reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory, subCategory: props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
        }else{
            reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
        }
    }else{
        reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
    }
    const loading = !reportHandle.ready();
    return{
        loading,
        reportData,
    };
})(CategoryWiseReportsDailyList);