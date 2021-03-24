import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import _                      from 'underscore';
import VendorsDetails 	      from './VendorsDetails.jsx'; 
import 'bootstrap/js/tab.js';
import '../css/ListOfVendors.css';
import '../css/ListOfVendorsFilter.css';
import '../css/ListOfAllVendors.css';

class ListOfVendors extends Component {
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
	    	searchByName  	: '',
	    	vendorList		: [],
	    	masterVendor	: []
	    }; 

	      this.handleChange = this.handleChange.bind(this);
	      this.ShowForm = this.ShowForm.bind(this);
	      this.camelCase = this.camelCase.bind(this);
	}

	handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });

    }

	componentDidMount(){
		this.getVendors();
		this.getStates('IN');
		this.getVendorCategory();
  	}
  
  	getVendorCategory(){
      axios.get("/api/vendorCategory/get/list/")
            .then((response)=>{
          
              this.setState({
                  vendorCategory : response.data
              })
              
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    handleChangeCategory(event){
    	event.preventDefault();
    	const target = event.target;
      	const category = $(target).val();
    	this.setState({
        'category' : event.target.value,
      	},()=>{

      		this.showAllList(this.state.masterVendor, "category",null,category)
      		
      		var filtered=this.state.masterVendor.filter(function(i){
      			console.log('i',i);
      			return i.category === category
      		});
      		this.setState({
		        vendorList: filtered
		    });
      	});
       
    }
    getStates(StateCode){
    	console.log("statecode:",StateCode );
      axios.get("http://locationapi.iassureit.com/api/states/get/list/"+StateCode)
            .then((response)=>{
          	  console.log("response after staeCode:",response);
              this.setState({
                  statesArray : response.data
              })
              console.log("response after staeCode:",this.state.statesArray);
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    handleChangeState(event){
      event.preventDefault();
      const target = event.target;
      const stateCode = $(target).val();
      
      this.getDistrict(stateCode,'IN');
      this.setState({
        'states' : event.target.value,
      },()=>{this.showAllList(this.state.masterVendor, "locationDetails", "states",stateCode)});
       
    }
    getDistrict(stateCode,countryCode){
      axios.get("http://locationapi.iassureit.com/api/districts/get/list/"+countryCode+"/"+stateCode)
            .then((response)=>{
              this.setState({
                  districtArray : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    handleChangeDistrict(event){
      const target = event.target;
      const districtName = $(target).val();
      const stateCode = $('.Statesdata').val();
      const countryCode = 'IN';
      //this.getBlocks(districtName,stateCode,countryCode);

      this.setState({
        'districts' : event.target.value,
      },()=>{

        this.showAllList(this.state.masterVendor, "locationDetails", "district",districtName)
      });

    }
    camelCase(str){
      return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    }
  	getVendors(){
  		axios.get("/api/vendors/get/list")
            .then((response)=>{
              console.log(response.data);
              this.setState({
                  vendorList : response.data,
                  masterVendor : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            }) 
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
	
	ShowForm(event){
		// console.log('inside')
		var data = $(event.currentTarget).attr('id');
		this.setState({id:data});
		
			$('.commonSup').show()
			$('.selected').removeClass('selectedSupplier');
			$(event.currentTarget).addClass('selectedSupplier');
		
	}

	showAllList(array, findAt, prop,value){
    

    var searchByName = this.state.searchByName;
    var currentState = this.state.states;

    if(searchByName !== ''){
    	
    }else{

      var filteredData = this.filterByProperty(array, findAt, prop,value);
       
      this.setState({
        vendorList: filteredData
      });
    }

  }

  filterByProperty(array, findAt, prop, value){
    
    var filtered = [];
    var filteredfinal = [];
    	for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
        	
            if(typeof obj[key]  === 'object'){
                if( key === findAt ){ 

                	if (prop) {
	                  var item = obj[key];                  
	                  for(var k in item){
	                     var filtered=item.filter(function(i){
	                        for(var l in i){
	                        return i[prop].toLowerCase()==value.toLowerCase();
	                        }             
	                    });
	                    
	                    if(filtered.length > 0){
	                       filteredfinal.push(obj._id);
	                    }    
	                  }
                	}
                }
              } 
              
        }
    	}
	    console.log('filteredfinal',filteredfinal); 

	    var finalArray = [];   
	    var filtered=array.filter(function(n,i){
	    
	      for(var k in filteredfinal){
	        console.log('[k]',k); 
	        console.log('filteredfinal[k]',filteredfinal[k]); 
	          //return n._id==filteredfinal[k]; 
	          if(n._id==filteredfinal[k]){
	            finalArray.push(n);
	          }
	          
	      }
	    });
	    console.log('finalArray',finalArray);   
	    return finalArray;
    }

	shortByAlpha(event){
	    event.preventDefault();

	    var vendorList = this.state.vendorList;
	    

	    for(var key in document.querySelectorAll('.alphab')){
	      //console.log($($('.alphab')[key]))
	      $($('.alphab')[key]).css('background','#ddd');
	      $($('.alphab')[key]).css('color','#fff');
	      //$($('.alphab')[key]).style.background = '#ddd';
	      //$($('.alphab')[key]).style.color = '#fff';
	    }

	    event.target.style.background = '#000';
	    event.target.style.color = '#fff';
	    
	    if ($(event.target).attr('value') === 'All') {

	      this.setState({vendorList: this.state.masterVendor});
	      if(this.state.states !== '-'){
	        this.showAllList(this.state.masterVendor, "locationDetails", "states",this.state.states);
	      }
	      if(this.state.districts !== '-'){
	        this.showAllList(this.state.masterVendor, "locationDetails", "district",this.state.districts);
	      }
	      if(this.state.city !== '-'){
	        this.showAllList(this.state.masterVendor, "locationDetails", "city",this.state.city);
	      }
	    }else{
	      var letterUpper = $(event.target).attr('value');
	      var letterLower = $(event.target).attr('value').toLowerCase() ;
	      
	      var sorted = this.state.masterVendor.filter((ba) => {
	        return ba.companyName.startsWith(letterUpper) || ba.companyName.startsWith(letterLower)
	      });

	      this.setState({vendorList : sorted});
	    }
	    
	    $('.commonSup').hide();
  	}
	
  	searchVendor(event){
  		this.setState({'searchByName' : event.target.value});
	    //var pattern = '/^'+event.target.value+'/i';
	    var pattern = new RegExp('^' + event.target.value, 'i');
	    var searchedData = this.state.masterVendor.filter((vendor) => {
	      
	        return pattern.test(vendor.companyName);
	    });

	    this.setState({vendorList : searchedData});
  	}
  	resetFilter(event){
  		event.preventDefault();
  		$('.category').prop('selectedIndex', 0);
	    $('.Statesdata').prop('selectedIndex', 0);
	    $('.districtsdata').prop('selectedIndex', 0);
	    $('.SearchVendor').val('');
	    this.setState({
	      'country'         : 'IN',
	      'states'          : '-',
	      'districts'       : '-',
	      'city'            : '-',
	      'category'        : '-',
	      'initial'         : '',
	    })

	    this.setState({
	        vendorList: this.state.masterVendor
	    });
  	}

  	locationDetails(props){
    	// var locaDetail = Suppliers.findOne({'createdBy':Meteor.userId()});
    	// var locationarray = [];
	  	// if(locaDetail){
	  	// 	if(locaDetail.locationDetails){
	  	// 		for(i=0;i<locaDetail.locationDetails.length;i++){
	  	// 			locationarray.push({
	  	// 					'location' :locaDetail.locationDetails[i],
	  	// 					'id'	   : locaDetail._id,

	  	// 				});
	  	// 		}//i
	  	// 	}
	  	// }//companyData
  		// return locationarray;
    }
	
	render() {
		// var locationDataList 	 =  this.props.post3;
		// var locationTypeSelect 	 =  this.props.post4;

		// var locationTypeArry = [];
		// var currentCountry 	 = [];
		// var currentState     = [];
		// var currentCity      = [];
		// // var currentArea      = [];
		// // var currentPincode   = [];

		// var currentCountryVal 	= (this.state.country );
		// var currentStateVal		= (this.state.states );
		// var currentCityVal 		= (this.state.city );
		// // var currentAreaVal 		= (this.state.area );
		
		// for (var i = 0; i < locationTypeSelect.length; i++) {
		// 	locationTypeArry.push({value:locationTypeSelect[i].value});
		// }

		// for(var k=0;k<locationDataList.length;k++){
		// 	currentCountry.push({value:locationDataList[k].countryName});
			
		// 	if(currentCountryVal === locationDataList[k].countryName){
		// 		currentState.push({value:locationDataList[k].stateName});
			
		// 		if(currentStateVal === locationDataList[k].stateName){
		// 			currentCity.push({value:locationDataList[k].districtName});

		// 		}
		// 	}
		// }

		// currentCountry = currentCountry.filter((obj,index,array)=>{
		// 	return index === array.findIndex((t)=>(
		// 		t.value === obj.value
		// 	));
		// });
		// currentState = currentState.filter((obj,index,array)=>{
		// 	return index === array.findIndex((t)=>(
		// 		t.value === obj.value
		// 	));
		// });
		// currentCity = currentCity.filter((obj,index,array)=>{
		// 	return index === array.findIndex((t)=>(
		// 		t.value === obj.value
		// 	));
		// });
		
		// console.log('index id: ',this.state.index , this.state.id )
       return (
    <div>
	    <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
		    <section className="row">
		    	<div className="col-lg-12 col-md-12 col-sm-12 col-lg-12">
		        <div className="content">
		            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
		                <div className="row">
			                    <div className="box-header with-border">
						           	<h4 className="weighttitle">Vendor List</h4>
						        </div>
						        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
							        <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
							        	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 filterMargin">
							        		<div className="toggle"></div>
								        	<span className="selfilter">Select Filter</span>
								        		<hr className="mrtpzero"/>
								        </div>
							        </div>
						           	<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12">Total Suppliers :&nbsp;&nbsp;<b>{this.state.masterVendor.length}</b></h5>
						           	<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12">Filtered :&nbsp;&nbsp;<b>{this.state.vendorList.length}</b></h5>

						        	<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 box-title2" >
				                   		<span className="blocking-span" >
					                   		<input type="text" name="search" className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers SearchVendor inputTextSearch outlinebox pull-right texttrans"  
					                   		placeholder="Search..." onInput={this.searchVendor.bind(this)} />
					                   	</span>
				                    </div>		        	
						        </div>
						        
						        <div className="contenta col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
							        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        	<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
							        		<button type="button" className="reset" onClick={this.resetFilter.bind(this)}>RESET FILTER</button>
							        	</div>
							        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
									        	<select className="form-control resetinp selheight category" ref="category" name="category" onChange={this.handleChangeCategory.bind(this)}>
									        	<option selected="true" value="-" disabled>Select Category</option>
									        	{
													this.state.vendorCategory && this.state.vendorCategory.map((Categorydata, index)=>{
														return(      
																<option  key={index} value={Categorydata.categoryName}>{Categorydata.categoryName}</option>
															);
													})
												}
									        	</select>
							        	</div>
							        	
							        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
				                            <select className="form-control resetinp selheight Statesdata" ref="states" name="states" onChange={this.handleChangeState.bind(this)}>
				                            <option selected="true" value="-" disabled>Select State</option>
				                            { this.state.statesArray && 
				                              this.state.statesArray.map((Statedata, index)=>{
				                                return(      
				                                    <option  key={index} value={Statedata.stateCode}>{this.camelCase(Statedata.stateName)}</option>
				                                  );
				                                }
				                              )
				                            }
				                            </select>
				                        </div>
							        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
				                            <select className="form-control resetinp districtsdata"  ref="district" name="district" onChange={this.handleChangeDistrict.bind(this)}>
				                              <option selected="true" value="-" disabled>Select District</option>
				                              { this.state.districtArray && this.state.districtArray.length>0 &&
				                              this.state.districtArray.map((districtdata, index)=>{
				                                return(      
				                                    <option  key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
				                                  );
				                                }
				                              )
				                          }
				                            </select>
				                        </div>
							        	
							        </div>

							        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 alphabate">
							        	<button type="button" className="btn alphab filterallalphab" onClick={this.shortByAlpha.bind(this)} name="initial" value={this.state.initial} onChange={this.handleChange}>All</button>
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
						        {this.state.vendorList && this.state.vendorList.length >0 ?

							        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 scrollbar" id="style-2">
								        <div className="borderlist12">	
								        	{
								        		this.state.vendorList.map((data,index)=>{
								        			
								        			return(
											        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist selected" key={index} onClick={this.ShowForm.bind(this)} name={index}  data-child={data._id+'-'+index} id={data._id}>
						        								<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
						        									<img src={data.logo} className="supplierLogoImage"></img>
												        		</div>
												        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
												        			<h5 className="titleprofile">{data.companyName}</h5>
												        			<ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
												        				<li><i className="fa fa-user-o col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{data.companyName}</li>
												        				{
												        					data.locationDetails[0] ? 
												        					<li><i className="fa fa-map-marker col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;
												        					{data.locationDetails[0].district},&nbsp;{data.locationDetails[0].area},{data.locationDetails[0].pincode}</li>
												        					: ""
												        				}
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
							    {this.state.id ? 
		        					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 pdcls suppliersOneProfile commonSup"  id={this.state.id}>
						        		<div id={this.state.id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
										  	<VendorsDetails name={this.state.index}  id={this.state.id}/>
										</div>
						        	</div>
						        	: 
						        		null
						        		 }
						        
	                	</div>
	               	</div>
	            </div>
	        </div>
	        </section>
	    </div>
	</div>
       		
	    );
	} 
}
export default ListOfVendors; 
// = withTracker((props,nextProps)=>{
// 	var post = [];
//     const postHandle = Meteor.subscribe('allSupplierList');
//     if(Roles.userIsInRole(Meteor.userId(), ['Vendor'])){
//     	post       = Suppliers.find({'OwnerId':Meteor.userId()}).fetch()||[];
//     }else{
//     	post       = Suppliers.find({}).fetch()||[];
//     }
    
//     const post6       = Suppliers.find({'createdBy':Meteor.userId()}).count();
    
//     const loading    = !postHandle.ready();
//   	const post2 = Suppliers.find({'createdBy':Meteor.userId()},{sort:{createdAt:-1}}).fetch()||[];

//   	const postHandle2 = Meteor.subscribe('locationdata');
// 	const post3       = Location.find({}).fetch()||[];
// 	const loading2    = !postHandle2.ready();
	
// 	const postHandle3 = Meteor.subscribe('MasterDataSupplierLocationType');
// 	const post4       = MasterData.find({}).fetch()||[];
// 	const loading3    = !postHandle3.ready();

// 	const postHandle4 = Meteor.subscribe('MasterDataSupplierCategory');
// 	const post5       = MasterData.find({"type": "Supplier Category"}).fetch()||[];
// 	const loading4    = !postHandle4.ready();
//     return {
//       loading,
//       post,
//       post2,     
//       post3,     
//       post4,
//       post5,
//       post6,     
//     };
// }) (ListOfSupplier);