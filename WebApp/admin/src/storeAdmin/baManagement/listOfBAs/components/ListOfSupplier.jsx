import React, { Component } from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';;
import {Suppliers} from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/api/apiSupplierOnboardingForm.js';
import { FlowRouter}  from 'meteor/ostrio:flow-router-extra';
import { Location } from '/imports/admin/masterData/manageLocation/components/location/component/Location.js';
import { MasterData } from '/imports/admin/masterData/masterDataEntry/apimasterDataEntry.js';
import ListOfAllSupplier from './ListOfAllSupplier.jsx'; 
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class ListOfSupplier extends TrackerReact(Component) {
	constructor(props) {
	    super(props);
	  
	    this.state = {
	    	firstname       : '',
	    	supplierListOne : '',
	    	supplierarrayS 	: '',
	    	id              : '',
	    	country         : '-',
	    	states          : '-',
	    	city            : '-',
	    	category        : '-',
	    	initial			: '',
	    	lenghtCount     : '',
	    };

	      this.handleChange = this.handleChange.bind(this);
	      this.ShowForm = this.ShowForm.bind(this);
	}

	handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });

    }

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		$("html,body").scrollTop(0);
		$(document).ready(()=>{
		  // var $contenta = $(".contenta").hide();
		  
		  $(".toggle").on("click", (e)=>{
		    $(this).toggleClass("expanded");
		    // $contenta.slideToggle();
		    $(".contenta").slideToggle();
		  });
		});
  	}
  	componentWillReceiveProps(nextProps){
		this.setState({supplierListOne : ''});
	 	var supplierDetail = nextProps.post;
    	var supplierarray = [];
	  	if(supplierDetail){
	  		// // console.log('Suppliers',supplierDetail);
	  		for (var i = 0; i < supplierDetail.length; i++) {
	  			if (supplierDetail[i].logo) {
	  				var logo = supplierDetail[i].logo;
	  			}else{
	  				var logo = '/images/imgNotFound.jpg';
	  			}
				if(supplierDetail[i].locationDetails.length>0 && supplierDetail[i].contactDetails.length>0){
					supplierarray.push({
							'companyName'     : supplierDetail[i].companyname,
							'category'        : supplierDetail[i].category,
							'website'     	  : supplierDetail[i].website,
							'logo'     	  	  : logo,
							'city' 	   		  : supplierDetail[i].locationDetails[0].city,
							'states'  		  : supplierDetail[i].locationDetails[0].states,
							'pincode'         : supplierDetail[i].locationDetails[0].pincode,
							'id'	   		  : supplierDetail[i]._id,
							'name'			  : supplierDetail[i].contactDetails[0].LocationLevel[0].Name ? supplierDetail[i].contactDetails[0].LocationLevel[0].Name : '',
						});
				}else{
					supplierarray.push({
							'companyName'     : supplierDetail[i].companyname,
							'category'        : supplierDetail[i].category,
							'website'     	  : supplierDetail[i].website,
							'logo'     	  	  : logo,
							'city' 	   		  : 'NA',
							'states'  		  : 'NA',
							'pincode'         : 'NA',
							'id'	   		  : supplierDetail[i]._id,
							'name'			  : 'NA',
						});
				}
	  		}

	  	}
	  	// // console.log(supplierarray)
	  	this.setState({
				supplierarrayS : supplierarray,
			},()=>{this.suppliersDetails()}); 
    }
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

  	toggleFormShow(event){
  		
	    $(".filter_wrapper").slideToggle();
	}

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);

	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}
	
	getTextValue(event){
		event.preventDefault();
		var searchby= $('.Searchfind').val();
		if(searchby){
			var RegExpBuildValue = this.buildRegExp(searchby);
			this.setState({
				firstname   : RegExpBuildValue,
				country 	: '-',
				state 		: '-',
				city 		: '-',
				catgory 	: '-',
				initial		: '',
			},()=>{this.showAllList()});
			
		}
		else{
			this.setState({
				firstname   : '',
				country 	: '-',
				state 		: '-',
				city 		: '-',
				catgory 	: '-',
				initial		: '',
			},()=>{this.showAllList()});
		}
	}

	ShowForm(event){
		// console.log('inside')
		var data = $(event.currentTarget).attr('data-child');
		// console.log('data',data);
		if(data){
			if(this.state.data && this.state.data.split('-')[1] === this.state.index){
		        this.setState({
		            index:'',
		            id:'',
		        });
			}else if(data){
		        this.setState({
		            index:data.split('-')[1],
		            id:data.split('-')[0],
		        });			
			}
		}
			$('.commonSup').show()
			$('.selected').removeClass('selectedSupplier');
			$(event.currentTarget).addClass('selectedSupplier');
		
	}

	shortByAlpha(event){
		var supplierList = this.props.post;
		var supplierslenght = supplierList.length;
		var letterUpper = $(event.target).attr('value');
		var letterLower = $(event.target).attr('value').toLowerCase() ;
		var supplierArr = [];
		const suppList  = [];
		var supplierListOne = ''
		this.setState({supplierarrayS : '',supplierListOne: ''})
		for (var i = 0; i < supplierslenght; i++) {
			var suppliersD = supplierList[i].companyname;
			supplierArr.push({'companyname':supplierList[i].companyname});
		}
		var pluck = _.pluck(supplierArr, 'companyname');
		// var data = _.uniq(pluck);

		var startsWith = pluck.filter((suppliersD) => suppliersD.startsWith(letterUpper)|| suppliersD.startsWith(letterLower));
        if(startsWith.length>0){
          	for(var j=0;j<startsWith.length;j++){
	            var uniqueArea = startsWith[j];
	            var supplierLists = Suppliers.find({'companyname':uniqueArea}).fetch();
	        	if(supplierLists){
		            for (var k = 0; k <supplierLists.length; k++) {
		                suppList.push({
		                              'companyname' : uniqueArea,
		                              
		                            });
		                supplierListOne =  uniqueArea;
		                              
		                           
		            }
	            }//if
	        }//j
        }//length'

        this.setState({
				supplierListOne : suppList,
			},()=>{this.suppliersDetails()});
        // this.setState({
		// 		initial : supplierListOne,
		// 	},()=>{this.showAllList()});
        $('.commonSup').hide();
	}

	suppliersDetails(){
		var suppListAlpha = this.state.supplierListOne;
    	var supplierDetail = this.props.post;
    	var supplierarray = [];
	  	if(supplierDetail){
	  		for (var i = 0; i < supplierDetail.length; i++) {
	  			if (supplierDetail[i].logo) {
	  				var logo = supplierDetail[i].logo;
	  			}else{
	  				var logo = '/images/imgNotFound.jpg';
	  			}
	  			for (var j = 0; j < suppListAlpha.length; j++) {
					var suppListCompany = suppListAlpha[j].companyname;
					if (suppListCompany ===  supplierDetail[i].companyname) {
						if(supplierDetail[i].locationDetails.length>0 && supplierDetail[i].contactDetails.length>0){
			  				supplierarray.push({
			  						'companyName'     : supplierDetail[i].companyname,
			  						'category'        : supplierDetail[i].category,
			  						'website'     	  : supplierDetail[i].website,
			  						'logo'     	  	  : logo,
			  						'city' 	   		  : supplierDetail[i].locationDetails[0].city,
			  						'states'  		  : supplierDetail[i].locationDetails[0].states,
			  						'pincode'         : supplierDetail[i].locationDetails[0].pincode,
			  						'id'	   		  : supplierDetail[i]._id,
			  						'name'			  : supplierDetail[i].contactDetails[0].LocationLevel[0].Name,
			  					});
				  		}else{
				  			supplierarray.push({
			  						'companyName'     : supplierDetail[i].companyname,
			  						'category'        : supplierDetail[i].category,
			  						'website'     	  : supplierDetail[i].website,
			  						'logo'     	  	  : logo,
			  						'city' 	   		  : 'NA',
			  						'states'  		  : 'NA',
			  						'pincode'         : 'NA',
			  						'id'	   		  : supplierDetail[i]._id,
			  						'name'			  : 'NA',
			  					});
				  		}

					}
				}
	  		}
	  	}//companyData
	  	var newsuplierarray = this.state.supplierarrayS;

	  	// $('.commonSup').show();
	  	if(newsuplierarray){
	  		supplierarray = newsuplierarray;
	  	}
  		return supplierarray;
    }
 
  	handleChangeCountry=(event)=>{
  		this.setState({
  			'country' : event.target.value,
  		},()=>{this.showAllList()});
  	}

  	handleChangeStates=(event)=>{
  		this.setState({
  			'states' : event.target.value,
  		},()=>{this.showAllList()});
  	}

  	handleChangeCity=(event)=>{
  		this.setState({
  			'city' : event.target.value,
  		},()=>{this.showAllList()});
  	}
  	
  	handleChangeCategory=(event)=>{
  		this.setState({
  			'category' : event.target.value,
  		},()=>{this.showAllList()});
  	}

  	resetFilter(event){
  		event.preventDefault();
  		var supplierDetail = this.props.post;
	    	
    	var supplierarray = [];
	  	if(supplierDetail){
	  		for (var i = 0; i < supplierDetail.length; i++) {
	  			if (supplierDetail[i].logo) {
	  				var logo = supplierDetail[i].logo;
	  			}else{
	  				var logo = '/images/imgNotFound.jpg';
	  			}
				if(supplierDetail[i].locationDetails.length>0 && supplierDetail[i].contactDetails.length>0){
					supplierarray.push({
							'companyName'     : supplierDetail[i].companyname,
							'category'        : supplierDetail[i].category,
							'website'     	  : supplierDetail[i].website,
							'logo'     	  	  : logo,
							'city' 	   		  : supplierDetail[i].locationDetails[0].city,
							'states'  		  : supplierDetail[i].locationDetails[0].states,
							'pincode'         : supplierDetail[i].locationDetails[0].pincode,
							'id'	   		  : supplierDetail[i]._id,
							'name'			  : supplierDetail[i].contactDetails[0].LocationLevel[0].Name,
						});
				}else{
					supplierarray.push({
							'companyName'     : supplierDetail[i].companyname,
							'category'        : supplierDetail[i].category,
							'website'     	  : supplierDetail[i].website,
							'logo'     	  	  : logo,
							'city' 	   		  : 'NA',
							'states'  		  : 'NA',
							'pincode'         : 'NA',
							'id'	   		  : supplierDetail[i]._id,
							'name'			  : 'NA',
						});
				}
	  		}

	  	}

  		this.setState({
  			country : '',
			state 	: '',
			city 	: '',
			category : '',
			initial	: '',
			supplierarrayS: supplierarray
  		},()=>{this.suppliersDetails()});
  	}

  	showAllList(event){
  		this.setState({
  			country : this.state.country,
			state 	: this.state.states,
			city 	: this.state.city,
			catgory : this.state.category,
			initial	: '',
  		})
		this.setState({supplierListOne : ''});
		var firstName = this.state.firstname;
		var formValues = {
			country : this.state.country,
			state 	: this.state.states,
			city 	: this.state.city,
			catgory : this.state.category,
			initial	: this.state.initial,
		}

		// // console.log('formValues: ',formValues);
		// // console.log('firstName: ',firstName);

		if(firstName) {
			// // console.log('inside firstname');
	    	var supplierDetail = Suppliers.find({'companyname':firstName},{sort:{createdAt:1}}).fetch();
		}else if((formValues.country !== '' && formValues.country !== '-') || (formValues.state !== '' && formValues.state !== '-' ) || (formValues.city !== '' && formValues.city !== '-')|| (formValues.catgory !== '' && formValues.catgory !== '-' ) || formValues.initial){
			// // console.log('else');
			var initial = "";
			var catgory = "";
			var country = "";
			var state = "";
			var city = "";
			var selectorArray = [];

			if(formValues.initial !== ""){
				var init1 = formValues.initial ; 
				initial = {"companyname" : init1 } ;
				selectorArray.push(initial);
			}

			if(formValues.catgory !== "" && formValues.catgory !== '-'){
				catgory = {"category": formValues.catgory};
				selectorArray.push(catgory);
			}


			if(formValues.city !== "" && formValues.city !== '-'){
				city = {"locationDetails.city" : formValues.city };
				selectorArray.push(city);
			}


			if(formValues.state !== "" && formValues.state !== '-' ){
				state = {"locationDetails.states" : formValues.state };
				selectorArray.push(state);
			}


			if(formValues.country !== "" && formValues.country !== '-'){
				country = {"locationDetails.country": formValues.country} ;
				selectorArray.push(country);
			}

			var selector = {$and: selectorArray };

			// // console.log('selector: ',selector);

	    	var supplierDetail = Suppliers.find(selector).fetch();
		}else{
	    	var supplierDetail = this.props.post;
		}
		// // console.log('supplierDetail: ',supplierDetail);
    	var supplierarray = [];
	  	if(supplierDetail){
	  		for (var i = 0; i < supplierDetail.length; i++) {
	  			if (supplierDetail[i].logo) {
	  				var logo = supplierDetail[i].logo;
	  			}else{
	  				var logo = '/images/imgNotFound.jpg';
	  			}
				if(supplierDetail[i].locationDetails.length>0 && supplierDetail[i].contactDetails.length>0){
					supplierarray.push({
							'companyName'     : supplierDetail[i].companyname,
							'category'        : supplierDetail[i].category,
							'website'     	  : supplierDetail[i].website,
							'logo'     	  	  : logo,
							'city' 	   		  : supplierDetail[i].locationDetails[0].city,
							'states'  		  : supplierDetail[i].locationDetails[0].states,
							'pincode'         : supplierDetail[i].locationDetails[0].pincode,
							'id'	   		  : supplierDetail[i]._id,
							'name'			  : supplierDetail[i].contactDetails[0].LocationLevel[0].Name,
						});
				}else{
					supplierarray.push({
							'companyName'     : supplierDetail[i].companyname,
							'category'        : supplierDetail[i].category,
							'website'     	  : supplierDetail[i].website,
							'logo'     	  	  : logo,
							'city' 	   		  : 'NA',
							'states'  		  : 'NA',
							'pincode'         : 'NA',
							'id'	   		  : supplierDetail[i]._id,
							'name'			  : 'NA',
						});
				}
	  		}

	  	}

	  	var lenghtCount = supplierarray.length;

	  	this.setState({
				supplierarrayS : supplierarray,
				lenghtCount    : lenghtCount,
			},()=>{this.suppliersDetails()});
  	}
  	locationDetails(props){
    	var locaDetail = Suppliers.findOne({'createdBy':Meteor.userId()});
    	var locationarray = [];
	  	if(locaDetail){
	  		if(locaDetail.locationDetails){
	  			for(i=0;i<locaDetail.locationDetails.length;i++){
	  				locationarray.push({
	  						'location' :locaDetail.locationDetails[i],
	  						'id'	   : locaDetail._id,

	  					});
	  			}//i
	  		}
	  	}//companyData
  		return locationarray;
    }
	
	render() {
		var locationDataList 	 =  this.props.post3;
		var locationTypeSelect 	 =  this.props.post4;

		var locationTypeArry = [];
		var currentCountry 	 = [];
		var currentState     = [];
		var currentCity      = [];
		// var currentArea      = [];
		// var currentPincode   = [];

		var currentCountryVal 	= (this.state.country );
		var currentStateVal		= (this.state.states );
		var currentCityVal 		= (this.state.city );
		// var currentAreaVal 		= (this.state.area );
		
		for (var i = 0; i < locationTypeSelect.length; i++) {
			locationTypeArry.push({value:locationTypeSelect[i].value});
		}

		for(var k=0;k<locationDataList.length;k++){
			currentCountry.push({value:locationDataList[k].countryName});
			
			if(currentCountryVal === locationDataList[k].countryName){
				currentState.push({value:locationDataList[k].stateName});
			
				if(currentStateVal === locationDataList[k].stateName){
					currentCity.push({value:locationDataList[k].districtName});

				}
			}
		}

		currentCountry = currentCountry.filter((obj,index,array)=>{
			return index === array.findIndex((t)=>(
				t.value === obj.value
			));
		});
		currentState = currentState.filter((obj,index,array)=>{
			return index === array.findIndex((t)=>(
				t.value === obj.value
			));
		});
		currentCity = currentCity.filter((obj,index,array)=>{
			return index === array.findIndex((t)=>(
				t.value === obj.value
			));
		});
		
		// console.log('index id: ',this.state.index , this.state.id )
       return (
    <div>
	    <div className="content-wrapper">
	      <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
		    <section className="content">
		        <div className="row">
		            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxtop">
		                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 box">
			                    <div className="box-header with-border">
						           	<h4 className="weighttitle">List of Suppliers</h4>
						        </div>
						        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
							        <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
							        	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 filterMargin">
							        		<div className="toggle"></div>
								        	<span className="selfilter">Select Filter</span>
								        		<hr className="mrtpzero"/>
								        </div>
							        </div>
						           	<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12">Total Suppliers :&nbsp;&nbsp;<b>{this.props.post6}</b></h5>
						           	<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12">Filtered :&nbsp;&nbsp;<b>{this.state.lenghtCount ?this.state.lenghtCount : 0}</b></h5>

						        	<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 box-title2" >
				                   		<span className="blocking-span" onClick={this.showAllList.bind(this)}>
					                   		<input type="text" name="search"  className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers Searchfind inputTextSearch outlinebox pull-right texttrans"  placeholder="Search..." onInput={this.getTextValue.bind(this)} />
					                   	</span>
				                    </div>		        	
						        </div>
						        
						        <div className="contenta col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
							        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        	<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
							        		<button type="button" className="reset" onClick={this.resetFilter.bind(this)}>RESET FILTER</button>
							        	</div>
							        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
									        	<select className="form-control resetinp selheight" ref="category" name="category" value={this.state.category} onChange={this.handleChangeCategory}>
									        	<option selected="true" value="-" disabled>Select Category</option>
									        	{
														this.props.post5.map((Categorydata, index)=>{
															return(      
																	<option  key={index} value={Categorydata.value}>{Categorydata.value}</option>
																);
															}
														)
													}
									        	</select>
							        	</div>
							        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
									        	<select className="form-control resetinp selheight" value={this.state.country}  ref="country" name="country" onChange={this.handleChangeCountry} >
									        		<option selected="true" value="-" disabled>Select Country</option>
									        		{
														currentCountry.map((Countrydata, index)=>{
															return(      
																	<option  key={index} value={Countrydata.value}>{Countrydata.value}</option>
																);
															}
														)
													}
									        	</select>
							        	</div>
							        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
									        	<select className="form-control resetinp selheight" value={this.state.states}  ref="states" name="states" onChange={this.handleChangeStates}>
									        	<option selected="true" value="-" disabled>Select State</option>
									        	{
													currentState.map((Statedata, index)=>{
														return(      
																<option  key={index} value={Statedata.value}>{Statedata.value}</option>
															);
														}
													)
												}
									        	</select>
							        	</div>
							        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
									        	<select className="form-control resetinp selheight" value={this.state.city}  ref="city" name="city" onChange={this.handleChangeCity}>
									        		<option selected="true" value="-" disabled>Select City</option>
									        		{
														currentCity.map((Citydata, index)=>{
															return(      
																	<option  key={index} value={Citydata.value}>{Citydata.value}</option>
																);
															}
														)
													}
									        	</select>
							        	</div>
							        	
							        </div>

							        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 alphabate">
							        	<button type="button" className="btn alphab filterallalphab" onClick={this.showAllList.bind(this)} name="initial" value={this.state.initial} onChange={this.handleChange}>All</button>
							        	<button type="button" className="btn alphab" value="A" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>A</button>
							        	<button type="button" className="btn alphab" value="B" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>B</button>
							        	<button type="button" className="btn alphab" value="C" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>C</button>
							        	<button type="button" className="btn alphab" value="D" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>D</button>
							        	<button type="button" className="btn alphab" value="E" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>E</button>
							        	<button type="button" className="btn alphab" value="F" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>F</button>
							        	<button type="button" className="btn alphab" value="G" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>G</button>
							        	<button type="button" className="btn alphab" value="H" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>H</button>
							        	<button type="button" className="btn alphab" value="I" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>I</button>
							        	<button type="button" className="btn alphab" value="J" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>J</button>
							        	<button type="button" className="btn alphab" value="K" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>K</button>
							        	<button type="button" className="btn alphab" value="L" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>L</button>
							        	<button type="button" className="btn alphab" value="M" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>M</button>
							        	<button type="button" className="btn alphab" value="N" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>N</button>
							        	<button type="button" className="btn alphab" value="O" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>O</button>
							        	<button type="button" className="btn alphab" value="P" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>P</button>
							        	<button type="button" className="btn alphab" value="Q" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Q</button>
							        	<button type="button" className="btn alphab" value="R" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>R</button>
							        	<button type="button" className="btn alphab" value="S" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>S</button>
							        	<button type="button" className="btn alphab" value="T" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>T</button>
							        	<button type="button" className="btn alphab" value="U" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>U</button>
							        	<button type="button" className="btn alphab" value="V" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>V</button>
							        	<button type="button" className="btn alphab" value="W" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>W</button>
							        	<button type="button" className="btn alphab" value="X" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>X</button>
							        	<button type="button" className="btn alphab" value="Y" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Y</button>
							        	<button type="button" className="btn alphab" value="Z" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Z</button>
							        </div>
							        </div>
						        </div>
						        {this.suppliersDetails() && this.suppliersDetails().length >0 ?

							        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 scrollbar" id="style-2">
								        <div className="borderlist12">	
								        	{
								        		this.suppliersDetails().map((data,index)=>{

								        			return(
											        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist selected" key={index} onClick={this.ShowForm.bind(this)} name={index}  data-child={data.id+'-'+index} id={data.id}>
						        								<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
						        									<img src={data.logo} className="supplierLogoImage"></img>
												        		</div>
												        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
												        			<h5 className="titleprofile">{data.companyName}</h5>
												        			<ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
												        				<li><i className="fa fa-user-o col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{data.name}</li>
												        				<li><i className="fa fa-map-marker col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{data.city},&nbsp;{data.states},{data.pincode}</li>
												        				<li><i className="fa fa-arrows col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;Category: {data.category}</li>
												        				<li><i className="fa fa-globe col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{data.website}</li>
												        			</ul>					        		
												        		</div>
											        		</div>		
								        			);

								        		})

								        	}
								        </div>
							        </div>
							       	:
						        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
							        	<h5>No Data Found</h5>
							        </div>
						        }
							    {this.state.index && this.state.id ? 
		        					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 pdcls suppliersOneProfile commonSup"  id={this.state.id}>
						        		<div id={this.state.id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
										  	<ListOfAllSupplier name={this.state.index}  id={this.state.id}/>
										</div>
						        	</div>
						        	: 
						        		null
						        		 }
						        
	                	</div>
	               	</div>
	            </div>
	        </section>
	    </div>
	</div>
       		
	    );
	} 
}
export default EditListOfSupplier = withTracker((props,nextProps)=>{
	var post = [];
    const postHandle = Meteor.subscribe('allSupplierList');
    if(Roles.userIsInRole(Meteor.userId(), ['Vendor'])){
    	post       = Suppliers.find({'OwnerId':Meteor.userId()}).fetch()||[];
    }else{
    	post       = Suppliers.find({}).fetch()||[];
    }
    
    const post6       = Suppliers.find({'createdBy':Meteor.userId()}).count();
    
    const loading    = !postHandle.ready();
  	const post2 = Suppliers.find({'createdBy':Meteor.userId()},{sort:{createdAt:-1}}).fetch()||[];

  	const postHandle2 = Meteor.subscribe('locationdata');
	const post3       = Location.find({}).fetch()||[];
	const loading2    = !postHandle2.ready();
	
	const postHandle3 = Meteor.subscribe('MasterDataSupplierLocationType');
	const post4       = MasterData.find({}).fetch()||[];
	const loading3    = !postHandle3.ready();

	const postHandle4 = Meteor.subscribe('MasterDataSupplierCategory');
	const post5       = MasterData.find({"type": "Supplier Category"}).fetch()||[];
	const loading4    = !postHandle4.ready();
    return {
      loading,
      post,
      post2,     
      post3,     
      post4,
      post5,
      post6,     
    };
}) (ListOfSupplier);