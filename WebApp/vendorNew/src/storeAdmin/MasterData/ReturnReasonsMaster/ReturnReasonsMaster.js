import React, { Component }     from 'react';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import OneFieldForm             from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import _                        from 'underscore';
import 'bootstrap/js/tab.js';

class ReturnReasonsMaster extends Component {
	constructor(props) {
		super(props);
		this.state = {			
			fields 				: {
				placeholder     : "Enter reason of return product.",
				title           : "Reason of Return Product",
				attributeName   : "reasonOfReturn"
			},
			tableHeading		: {
				reasonOfReturn 	: "Reason's of Return",
				actions 		: 'Action',
			},
			tableObjects 		: {
				deleteMethod 	: 'delete',
				apiLink 			: '/api/returnreasons/',
				paginationApply : true,
				searchApply 	: false,
				editUrl 		: '/project-master-data'
			},
			startRange 			: 0,
			limitRange 			: 10,
			tableName  			: 'ReturnReasonsMaster',			
		};
	}

	/**=========== componentDidMount() ===========*/
	componentDidMount() {
		var userDetails   	= JSON.parse(localStorage.getItem("userDetails"));
		var token       	= userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		var editId = this.props.match 
					? 
						this.props.match.params.editId
					: 
						this.props.editId 
						? 
							this.props.editId 
						: 
							"" ;

		if(editId && editId !== 'undefined'){
			this.setState({
				editId : editId
			}, ()=>{
				// console.log("this.state.editId = ",this.state.editId);
			});
		}
		window.scrollTo(0, 0);
		axios.get('/api/companysettings/')
		.then( (res)=>{   
			this.setState({profileCreated:true, companyInfo: res.data}) 
		})
		.catch((error)=>{
			console.log("Error => ",error)
			if(error.message === "Request failed with status code 401"){
				var userDetails =  localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is expired.",                
					text  : "You need to login again. Click OK to go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		});
	}

	componentDidUpdate(prevProps) {
		if(this.props.editId !== this.state.editId){
		  this.setState({editId : this.props.editId},
						()=>{
						  //console.log("global componentDidUpdate editId = ",this.state.editId);
						});
		}
	  }
	/**=========== render() ===========*/
	render() {
		return (
			<div className="container-fluid">
				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
						<OneFieldForm 
							fields 			= {this.state.fields}
							tableHeading 	= {this.state.tableHeading}
							tableObjects 	= {this.state.tableObjects}
							editId  		= {this.state.editId}
							history 		= {this.props.history}
							tableDnd 		= {true}
							masterFieldForm = {true}
							tableName  		= {this.state.tableName}
						/>
					</div>
				</div>
			</div>
			
		);
	}
}

export default ReturnReasonsMaster;