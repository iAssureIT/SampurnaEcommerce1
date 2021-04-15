import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import  'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import $ from 'jquery';
// import swal from 'sweetalert';

import  './AccessManagement.css';

class ModuleRegistration extends Component {
 
 	constructor(props){
		super(props);
		this.state={
			moduleName : '',
		}
		this.handleChange = this.handleChange.bind(this);
	}

	
	// componentWillReceiveProps(nextProps){
	// 	this.setState({
	// 		moduleName : nextProps.accessManagementData.moduleName,
	// 	});

	// 	this.handleChange = this.handleChange.bind(this);
	// }

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
  	}

	
  	componentDidMount(){
		// if ( !$('body').hasClass('adminLte')) {
		//   var adminLte = document.createElement("script");
		//   adminLte.type="text/javascript";
		//   adminLte.src = "/js/adminLte.js";
		//   $("body").append(adminLte);
		// }
  	}
  	
  	componentWillUnmount(){
    	// $("script[src='/js/adminLte.js']").remove();
    	// $("link[href='/css/dashboard.css']").remove();
  	}

  	addModule(e){
  		e.preventDefault();
  		// var moduleName = this.refs.moduleName.value.trim();
  		// Meteor.call("addModuleName",moduleName,this.props.id,(err,res)=>{
  		// 	if(err){
  		// 		console.log("somthing went wrong");
  		// 	}else{
  		// 		$('.close').click();
  		// 		this.refs.moduleName.value='';
  		// 		swal("Module added successfully","","success");
  		// 		// FlowRouter.go('/admin/addFacilities/'+res);
  		// 	}
  		// })
  	}
 
  render(){
    
    return(
      
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <form /*onSubmit={this.addModule.bind(this)}*/>
            <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-9">
              <span className="blocking-span"> 
                <input type="text" name="moduleName" ref="moduleName" /*value={this.state.moduleName} onChange={this.handleChange} */ placeholder="Module Name" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputBox-main" pattern="^([a-zA-Z][a-zA-Z0-9-\s]*)$" title="Enter Module" required/>
                {/*<span className="floating-label">Module Name</span>  */}               
              </span>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12  col-xs-9 ">
              <button type="submit" className="col-lg-2 pull-right btn submit AMF-Btn"> Submit </button>
            </div>
          </form>
        </div>
             
    );
  }
}
export default ModuleRegistration; 