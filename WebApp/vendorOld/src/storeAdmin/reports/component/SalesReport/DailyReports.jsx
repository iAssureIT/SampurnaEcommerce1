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


// import { UserSubscriptions } from '/imports/website/contactUs/api/SubscriptionMaster.js';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class ReportsDailyList extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            "tableListData":[],
            "subscribe": Meteor.subscribe("OrdersData"),
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        // this.contactTracker = Tracker.autorun(()=>{
           
            
        // });
        this.handleChange = this.handleChange.bind(this);
        
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

		var reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate },'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
        //console.log('reportData',reportData);
        var reportDataArr = [];
		if(reportData){
			for(var i=0;i<reportData.length;i++){
				reportDataArr.push(
					<tr key={reportData[i]._id}>
						<td>{moment(reportData[i].createdAt).format('LL')}</td>
						<td className="textAlignRight">{reportData[i].OrderId}</td>
						<td>{reportData[i].paymentMethod}</td>
						<td className="textAlignRight">{reportData[i].productLength}</td>
						<td className="textAlignRight">{reportData[i].totalQuantity}</td>
						<td className="textAlignRight">{(parseInt(reportData[i].totalAmount)).toFixed(2)}</td>
					</tr>
				);
			}
        }
		return reportDataArr;
    }
   
    render(){
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
                        {/* <div className="report-list-downloadPdf">
                            <i className="fa fa-file-pdf-o" aria-hidden="true"></i>PDF
                        </div>
                        <div className="report-list-downloadPrint">
                            <i className="fa fa-print" aria-hidden="true"></i>Print
                        </div> */}
                        {/* <div className="report-list-downloadPrint">
                            <i className="fa fa-print" aria-hidden="true"></i>Download Report
                        </div> */}
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
                                <th className=" umDynamicHeader srpadd">Transaction Type</th>
                                <th className=" umDynamicHeader srpadd">Product Count</th>
                                <th className=" umDynamicHeader srpadd">Quantity</th>
                                <th className=" umDynamicHeader srpadd">Amount</th>
                            </tr>
                            </thead>
                            <tbody>

                               {this.dataTableList()}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
        );
    }
}