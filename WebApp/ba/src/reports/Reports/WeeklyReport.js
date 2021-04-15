import React, { Component }     from 'react';
import IAssureTable             from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

export default class WeeklyReport extends Component{
	constructor(props){
        super(props);
        this.state = {
            "reportData" : [],
            "twoLevelHeader"    : this.props.twoLevelHeader,
            "tableHeading"      : this.props.tableHeading,
            "tableObjects"      : this.props.tableObjects,
            "tableDatas"        : this.props.tableDatas,
            "startRange"        : 0,
            "limitRange"        : 10
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        this.dataTableList();
        this.setState({
            tableData : this.state.tableDatas.slice(this.state.startRange, this.state.limitRange),
        });
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.reportData){
            this.setState({
                reportData : nextProps.reportData
            });
        }
    }
    currentWeek(){
		// var sessionWeek = Session.get('selectedWeek');//Expecting "2017-W01" type of format

		// if(sessionWeek){

		// 	var weekVal = sessionWeek;

		// }else{
		// 	var today = moment(new Date()).format("MM-DD-YYYY");
		//     var weeknumber = moment(today).week();
		// 	if(weeknumber<=9){
		// 		weeknumber="0"+weeknumber;
		// 	}
		// 	var yyyy = moment(today).format("YYYY");
		// 	var weekVal = yyyy+"-W"+weeknumber;
		// 	Session.set("selectedWeek",weekVal);
		// }
        var d = new Date();
        // var n = d.getMonth();
        var weeknumber = d.getFullYear()+' -W';
		return weeknumber;
	}

	previousWeek(event){
		// event.preventDefault();
		// var selectedWeek = $(".inputweekpicker").val();
		// var newWeekDt = moment(selectedWeek).subtract(1, 'weeks').format("YYYY-MM-DD");
		// var newWeekNumber = moment(newWeekDt).week();
		// //Construct the WeekNumber string as '2017-W01'
		// if(newWeekNumber <= 9){
		// 	newWeekNumber = '0'+newWeekNumber;
		// }else if(newWeekNumber == 53){
		// 	newWeekNumber = 52;
		// }
		// var yearNum=moment(newWeekDt).format("YYYY");
		// var newWeek = yearNum+"-W"+newWeekNumber;

		// Session.set('selectedWeek', newWeek);
	}

	nextWeek(event){
		// event.preventDefault();
		// var selectedWeek = $(".inputweekpicker").val();
		// var newWeekDt = moment(selectedWeek).add(1, 'weeks').format("YYYY-MM-DD");
		// var newWeekNumber = moment(newWeekDt).week();
		// //Construct the WeekNumber string as '2017-W01'
		// if(newWeekNumber <= 9){
		// 	newWeekNumber = '0'+newWeekNumber;
		// }
		// var yearNum=moment(newWeekDt).format("YYYY");
		// var newWeek = yearNum+"-W"+newWeekNumber;

		// Session.set('selectedWeek', newWeek);
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
        // var weekNumFromSess = Session.get("selectedWeek");
        
        // var mondayInWeek = moment(weekNumFromSess).day("Monday").week(weekNumFromSess).format();

        // var mondayInWeekDt = new Date(mondayInWeek);
        // var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
        // var sundayOfWeekDt = new Date(sundayOfWeek);
        
        // var reportData = [];
        // if(this.props.selectedCategory){
        //     if(this.props.selectedSubCategory){
        //         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
        //     }else{
        //         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
        //     }
        // }else{
        //     reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
        // }
        // this.setState({
        //     reportData : reportData
        // });

    }
    getData(startRange, limitRange){
        this.setState({
            tableData : this.state.tableDatas.slice(parseInt(startRange), parseInt(limitRange)),
        },()=>{
            console.log('tableData',this.state.tableData);
        });
    }
    getSearchText(searchText, startRange, limitRange){
        console.log(searchText, startRange, limitRange);
        this.setState({
            tableData : []
        });
    }
    render(){
        if(!this.props.loading){
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
                            <IAssureTable 
                                completeDataCount={this.state.tableDatas.length}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                editId={this.state.editSubId} 
                                getData={this.getData.bind(this)} 
                                tableHeading={this.state.tableHeading} 
                                tableData={this.state.tableData} 
                                tableObjects={this.state.tableObjects}
                                getSearchText={this.getSearchText.bind(this)}/>

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
// export default WeeklyListContainer = withTracker(props =>{
// var weekNumFromSess = Session.get("selectedWeek");
        
// var mondayInWeek = moment(weekNumFromSess).format();

// var mondayInWeekDt = new Date(mondayInWeek);
// var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
// var sundayOfWeekDt = new Date(sundayOfWeek);

// const reportHandle = Meteor.subscribe("OrdersData");
// var reportData = [];
// if(props.selectedCategory){
//     if(props.selectedSubCategory){
//         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory, subCategory: props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
//     }else{
//         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
//     }
// }else{
//     reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
// }
// const loading = !reportHandle.ready();
// return{
//     loading,
//     reportData,
// };
// })(CategoryWiseReportsWeeklyList);