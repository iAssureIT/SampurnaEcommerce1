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
class CategoryWiseReportsMonthlyList extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            "reportData":[],
            
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
       const target = event.target;
       const name = target.name;

       this.setState({
           [name] : event.target.value,
       });
   }

    currentMonth(){
		var monthSession = Session.get('selectedMonth');
		if(monthSession){
			var currentMonth = monthSession;
		}	else{
			var today = moment().startOf('month');
			var yyyy = moment(today).format("YYYY");
		    var monthNum = moment(today).format("MM");
		    var currentMonth = yyyy+"-"+monthNum;
			Session.set("selectedMonth",currentMonth);
			}
		return currentMonth;
	}

	previousMonth(event){
		event.preventDefault();
		var selectedMonth = $(".inputmonthlyValue").val();
		var newMonthDt = moment(selectedMonth).subtract(1, 'months').format("YYYY-MM-DD");
		var newMonthNumber = moment(newMonthDt).format("MM");
		//Construct the WeekNumber string as 'YYYY-MM'
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;

		Session.set('selectedMonth', newMonth);
	}

	nextMonth(event){
		event.preventDefault();
		var selectedMonth = $(".inputmonthlyValue").val();
		var newMonthDt = moment(selectedMonth).add(1, 'months').format("YYYY-MM-DD");
		var newMonthNumber = moment(newMonthDt).format("MM");
		//Construct the WeekNumber string as 'YYYY-MM'
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;

		Session.set('selectedMonth', newMonth);
	}
   


    dataTableList(){
		var monthDateFromSess = Session.get("selectedMonth");

        var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));//Find out first day of month with selectedMonth
        var monthDateToEnd = new Date(moment(monthDateFromSess).add(1,"M"));

		var reportData = [];
        if(this.props.selectedCategory){
            if(this.props.selectedSubCategory){
                reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }else{
                reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }
        }else{
            reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
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
                                <div className="reports-select-date-Title">Monthly Reports</div>
                                <div className="input-group">
                                    <span onClick={this.previousMonth.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                    <input onChange={this.handleChange}  value={this.currentMonth()} name="inputmonthlyValue" type="text" className="inputmonthlyValue reportsDateRef form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="inputmonthlyValue"  />
                                    <span onClick={this.nextMonth.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
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
                            <table id="subscriber-list-outerTable"  className="table iAssureITtable-bordered table-striped table-hover">
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
                <div className="col-sm-12 col-xs-12 col-lg-8 col-lg-offset-4 col-md-12 loadingImg LoaderDiv"><img className="ldrImageforbulk" src="/images/Loadersglms.gif" alt="loading"/></div>
            );
        } 
    }
}
export default MonthlyListContainer = withTracker(props =>{
    var monthDateFromSess = Session.get("selectedMonth");
    var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));
    var monthDateToEnd = new Date(moment(monthDateFromSess).add(1,"M"));

    const reportHandle = Meteor.subscribe("OrdersData");
    var reportData = [];
    if(props.selectedCategory){
        if(props.selectedSubCategory){
            reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory, subCategory: props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
        }else{
            reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
        }
    }else{
        reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
    }
    const loading = !reportHandle.ready();
return{
    loading,
    reportData,
};
})(CategoryWiseReportsMonthlyList);