import React     from 'react';
import { event } from 'jquery';
import swal      from 'sweetalert';
import axios     from 'axios';
import Switch    from "react-switch";
import $         from 'jquery';
// import  './DealsManagement.css';
const textSwitch={  
    display        : "flex",
    justifyContent : "center",
    alignItem      : "center",
    height         : "100%",
    fontSize       : 12,
    color          : "#fff",
    paddingRight   : 2,
    paddingLeft    : 2,
    paddingTop     : 2,
}
class DealsManagement extends React.Component {
	constructor(props) {
        super(props);
        this.state={
            section               : "all",
            category              : "all", 
            subCategory           : "all",
            // product               : "",
            discountInPercentage  : 0,
            

        };
    }
    componentDidMount(){
        this.getSectionData();
    }
    getSectionData() {
        axios.get('/api/sections/get/list')
           .then((response) => {
             this.setState({
                sectionArray: response.data
             })
           })
           .catch((error) => { 
             console.log('error', error);
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
           })
     }
     getCategories() {
        axios.get('/api/category/get/list')
           .then((response) => {
             this.setState({
                categoryArray: response.data
             })
           })
           .catch((error) => {
             console.log('error', error);
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
           })
     }
     getSubCategories(categoryID) {
        axios.get('/api/category/get/one/' + categoryID)
           .then((response) => {
             this.setState({
                subcategoryArray: response.data.subCategory,
             })
           })
           .catch((error) => {
             console.log('error', error);
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
           })
     }
    handle1Change(event){
		event.preventDefault();
    	this.setState({
            [event.target.name]:event.target.value	
    	});
    }
    handleChange(checked,e) {
        this.setState({ checked });
    }
    handleChangeSubcategory(event) {
        const target 	= event.target;
        const name 		= target.name;

        this.setState({
           [name]: event.target.value,
        });
     }


    submitDealsInfo(event){
        event.preventDefault();
        var formValues = {
                section               : this.state.section,
                category              : this.state.category, 
                subCategory           : this.state.subCategory,
                // products              : this.state.products,
                discountInPercentage  : this.state.discountInPercentage,
            }
    
        console.log("formValues====",formValues);
      axios.post('/api/deals/post',formValues)
		.then( (response)=> {
            if (response.data) {
                swal("Thank you. Your deals added successfully.");
                this.setState({
                    section 		      : '',
                    category 		      : '',
                    subCategory 		  : '', 
                    product               : "",
                    discountInPercentage  : ""           
                    
                });	 
            }   	 
        })
        .catch(function (error) {        
            console.log(error);
        });
    }
    
    updateDealsInfo(event){
        event.preventDefault();
        var urlParam = this.state.urlParam;
        // console.log("urlParam===",urlParam);
        var formValues = {
            section               : this.state.section,
            category              : this.state.category, 
            subCategory           : this.state.subCategory,
            discountInPercentage  : this.state.discountInPercentage
        }
        axios.patch('/api/deals/patch/'+formValues)
		  .then( (response)=> {

		  	})
		  	.catch(function (error) {
		    	console.log(error);
		  	});
    }

    showRelevantCategories(event) {
        var section = event.target.value;
        this.setState({
           section: event.target.value,
           section_ID: event.target.value.split('|')[1],
        })
        axios.get('/api/category/get/list/' +section)
           .then((response) => {
             this.setState({
                categoryArray: response.data,
                category: "Select Category",
                subCategory: "Select Sub-Category",
             })
           })
           .catch((error) => {
             console.log('error', error);
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
           })
     }
     showRelevantSubCategories(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var categoryNameRlang = event.target.value.split('|')[2];
   
        this.setState({
           [name]: event.target.value,
           subCategory: "Select Sub-Category",
           categoryNameRlang : categoryNameRlang
        });
        var categoryID = event.target.value;
        this.getSubCategories(categoryID);
     } 
	render() {
		return (
			<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 createECommForm">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bglightgclr">
                        <form className="eCommBlockForm">                         
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding blockSettingsBlock">
                            <div className="col-12 eCommBlockTitle">
                                Create New Shopping Block 
                            </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding blockSettingsTitle">Group Settings</div> 
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Block Title<span className="astrick"></span></label>
                                            <input type="text" ref="blockTitle" id="blockTitle" value={this.state.blockTitle} name="blockTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Block API<span className="astrick"></span></label>
                                            <input type="text" ref="blockApi" id="blockApi" value={this.state.blockApi} name="blockApi"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                       
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Block Title<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showTitle}                                   
                                                onChange={(event) => { this.setState({"showTitle": this.state.showTitle===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>                                
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Carousel<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showCarousel}                                   
                                                onChange={(event) => { this.setState({"showCarousel": this.state.showCarousel===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div> 
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Display Item In Carousel <span className="astrick"></span></label>
                                            <input type="text" ref="displayItemInCarousel" id="displayItemInCarousel" value={this.state.displayItemInCarousel} name="displayItemInCarousel"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 inputFields sectionDiv">
                                        <label>Section <i className="redFont">*</i></label> 
                                        <select onChange={this.showRelevantCategories.bind(this)} value={this.state.section} name="section" className="form-control allProductCategories inputValid" aria-describedby="basic-addon1" id="section" ref="section">
                                            <option defaultValue="all" >All Section</option>
                                            {this.state.sectionArray && this.state.sectionArray.length > 0 ? 
                                                this.state.sectionArray.map((data, index) => {
                                                return (
                                                    <option key={index} value={data._id}>{data.section}</option>
                                                );
                                                })
                                                :
                                                <option disabled>{"No section added"}</option>

                                            }
                                        </select>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Category<span className="astrick"></span></label>
                                            <select onChange={this.showRelevantSubCategories.bind(this)} value={this.state.category} name="category" className="form-control allProductCategories inputValid" aria-describedby="basic-addon1" id="category" ref="category">
                                                <option selected defaultValue="all">All Category</option>
                                                {this.state.categoryArray && this.state.categoryArray.length > 0 ?
                                                    this.state.categoryArray.map((data, index) => {
                                                    return (
                                                        <option key={index} test="one-test" value={data._id}>{data.category}</option>
                                                    );
                                                    })
                                                    :
                                                    <option disabled>{"No category added"}</option>
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Sub Category<span className="astrick"></span></label>
                                            <select className="form-control allProductSubCategories inputValid" aria-describedby="basic-addon1" name="subCategory" id="subCategory" ref="subCategory" value={this.state.subCategory} onChange={this.handleChangeSubcategory.bind(this)}>
                                                <option selected defaultValue="all">All Sub-Category</option>
                                                {this.state.subcategoryArray && this.state.subcategoryArray.length > 0 ?
                                                    this.state.subcategoryArray.map((data, index) => {
                                                    return (
                                                        <option value={data._id} key={index}>{data.subCategoryTitle}</option>
                                                    );
                                                    })
                                                :
                                                    <option disabled>{"No sub category added"}</option>
                                                }
                                            </select>
                                        </div>
                                    </div>                                    
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">show only section<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showOnlySection}                                   
                                                onChange={(event) => { this.setState({"showOnlySection": this.state.showOnlySection===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>   
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">show only category<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showOnlyCategory}                                   
                                                onChange={(event) => { this.setState({"showOnlyCategory": this.state.showOnlyCategory===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>                                    
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">show only Subcategory<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showOnlySubCategory}                                   
                                                onChange={(event) => { this.setState({"showOnlySubCategory": this.state.showOnlySubCategory===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div> 
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">show only brand<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showOnlyBrand}                                   
                                                onChange={(event) => { this.setState({"showOnlyBrand": this.state.showOnlyBrand===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>  
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Total Products<span className="astrick"></span></label>
                                            <input type="text" ref="totalProducts" id="totalProducts" value={this.state.totalProducts} name="totalProducts"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div> 
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Rows<span className="astrick"></span></label>
                                            <input type="number" ref="numOfRows" id="numOfRows" value={this.state.numOfRows} name="numOfRows"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Item Per Row<span className="astrick"></span></label>
                                            <input type="number" ref="numOfItemPerRow" id="numOfItemPerRow" value={this.state.numOfItemPerRow} name="numOfItemPerRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Item Per LG Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfItemPerLGRow" id="noOfItemPerLGRow" value={this.state.noOfItemPerLGRow} name="noOfItemPerLGRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Item Per MD Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfItemPerMDRow" id="noOfItemPerMDRow" value={this.state.noOfItemPerMDRow} name="noOfItemPerMDRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Item Per SM Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfItemPerSMRow" id="noOfItemPerSMRow" value={this.state.noOfItemPerSMRow} name="noOfItemPerSMRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Item Per XS Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfItemPerXSRow" id="noOfItemPerXSRow" value={this.state.noOfItemPerXSRow} name="noOfItemPerXSRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtnWrapper">
                                {
                                    this.state.EditBlock
                                    ?
                                    <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.updateDealsInfo.bind(this)}>Update</button>
                                    :
                                    <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.submitDealsInfo.bind(this)}>Submit</button>
                                }
                            </div>                            
                        </form>
                    </div>
                </div>
            </div>
		);
	}
}

export default DealsManagement;
