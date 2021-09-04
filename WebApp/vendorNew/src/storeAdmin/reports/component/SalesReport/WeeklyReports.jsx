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



// import { UserSubscriptions } from '/imports/website/contactUs/api/SubscriptionMaster.js';

export default class ReportsWeeklyList extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            "subscribe": Meteor.subscribe("OrdersData"),
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        this.contactTracker = Tracker.autorun(()=>{
       
        });
        this.handleChange = this.handleChange.bind(this);
    }

    currentWeek(){
		var sessionWeek = Session.get('selectedWeek');//Expecting "2017-W01" type of format

		if(sessionWeek){

			var weekVal = sessionWeek;

		}else{
			var today = moment(new Date()).format("MM-DD-YYYY");
		    var weeknumber = moment(today).week();
			if(weeknumber<=9){
				weeknumber="0"+weeknumber;
			}
			var yyyy = moment(today).format("YYYY");
			var weekVal = yyyy+"-W"+weeknumber;
			Session.set("selectedWeek",weekVal);
		}

		return weekVal;
	}

	previousWeek(event){
		event.preventDefault();
		var selectedWeek = $(".inputweekpicker").val();
		var newWeekDt = moment(selectedWeek).subtract(1, 'weeks').format("YYYY-MM-DD");
		var newWeekNumber = moment(newWeekDt).week();
		//Construct the WeekNumber string as '2017-W01'
		if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
		}else if(newWeekNumber === 53){
			newWeekNumber = 52;
		}
		var yearNum=moment(newWeekDt).format("YYYY");
		var newWeek = yearNum+"-W"+newWeekNumber;

		Session.set('selectedWeek', newWeek);
	}

	nextWeek(event){
		event.preventDefault();
		var selectedWeek = $(".inputweekpicker").val();
		var newWeekDt = moment(selectedWeek).add(1, 'weeks').format("YYYY-MM-DD");
		var newWeekNumber = moment(newWeekDt).week();
		//Construct the WeekNumber string as '2017-W01'
		if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
		}
		var yearNum=moment(newWeekDt).format("YYYY");
		var newWeek = yearNum+"-W"+newWeekNumber;

		Session.set('selectedWeek', newWeek);
    }
    
    handleChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
           [name] : event.target.value,
       });
   }

    dataTableList(){
        var weekNumFromSess = Session.get("selectedWeek");
        
        var mondayInWeek = moment(weekNumFromSess).day("Monday").week(weekNumFromSess).format();

        var mondayInWeekDt = new Date(mondayInWeek);
        var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
        var sundayOfWeekDt = new Date(sundayOfWeek);
        
        var reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt },'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
        // console.log("reportData: ",reportData);
        
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
                            <div className="reports-select-date-Title">Weekly Reports</div>
                            <div className="input-group">
                                <span  onClick={this.previousWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                <input  onChange={this.handleChange} name="inputweekpicker" value={this.currentWeek()}  type="text" className="reportsDateRef inputweekpicker form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="inputweekpicker"  />
                                <span onClick={this.nextWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
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