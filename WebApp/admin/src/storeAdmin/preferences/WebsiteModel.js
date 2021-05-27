import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import  './WebsiteModel.css';

class WebsiteModel extends Component {
    constructor(props) {        
        super(props);
        this.state = {
            "editId"           : "",
            "askPincodeToUser" : "",
            "preferences"      : "",
            "franchise"        : "",
            "marketplace"      : "",
            "SingleOwner"      : "",
            "askPincodeYes"    : "",
            "askPincodeNo"     : "",
            "websiteModel"     : "",
            "showInventory"    : "",
            "showDiscount"     : "",
            "showCoupenCode"   : "",
            "showOrderStatus"  : "",
            "currency"         : "",
        };
    }

    componentDidMount(){        
        // console.log("2.inside component didmount");
        var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
        var token         = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
        console.log("userDetails = > ",userDetails);
        console.log("Bearer = > ",(axios.defaults.headers.common['Authorization'] = 'Bearer '+ token));
    }

    componentWillMount() {
        axios.get("/api/adminpreference/get")
        .then(preferences =>{
        if(preferences.data){
            console.log("preferences.data=========",preferences.data);
            console.log("preferences.datashowDiscount=========",preferences.data.showDiscount);
                var askpincodeToUser = preferences.data[0].askPincodeToUser;
                this.setState({
                    'editId'           : preferences.data[0]._id,
                    'websiteModel'     : preferences.data[0].websiteModel,
                    'askPincodeToUser' : preferences.data[0].askPincodeToUser,
                    'showLoginAs'      : preferences.data[0].showLoginAs,
                    'showInventory'    : preferences.data[0].showInventory,
                    'showDiscount'     : preferences.data[0].showDiscount,
                    'showCoupenCode'   : preferences.data[0].showCoupenCode,
                    'showOrderStatus'  : preferences.data[0].showOrderStatus,
                    "currency"         : preferences.data[0].currency,
                })        
            }
        })
        .catch(error=>{
            console.log("error => ",error);
            // if(error.message === "Request failed with status code 401"){
            //     var userDetails =  localStorage.removeItem("userDetails");
            //     localStorage.clear();
            //     swal({  
            //         title : "Your Session is expired.",                
            //         text  : "You need to login again. Click OK to go to Login Page"
            //     })
            //     .then(okay => {
            //         if (okay) {
            //             window.location.href = "/login";
            //         }
            //     });
            // }
        })
    }  
    
    handleChange(event) {
        //event.preventDefault();
        console.log("event",event.target);
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });  
        // console.log("websiteModel:", this.state.websiteModel); 
        // console.log("askpincode",this.state.askPincodeToUser);
        // console.log("loginAs: ",this.state.showLoginAs);
        // console.log("showInventory: ",this.state.showInventory);
        // console.log("showDiscount===========: ",this.state.showDiscount);
        // console.log("showCoupenCode: ",this.state.showCoupenCode);
        // console.log("showOrderStatus: ",this.state.showOrderStatus);
    }
    submit(event){ 
        event.preventDefault();    
        var formValues = {
            "websiteModel"     : this.state.websiteModel ,  
            "askPincodeToUser" : this.state.askPincodeToUser,   
            "showLoginAs"      : this.state.showLoginAs,      
            "showInventory"    : this.state.showInventory,  
            "showDiscount"     : this.state.showDiscount,    
            "showCoupenCode"   : this.state.showCoupenCode,  
            "showOrderStatus"  : this.state.showOrderStatus, 
            "currency"         : this.state.currency   
        }
            console.log('formValues', formValues);
        if($("#websiteModelId").valid()){        
            axios.post('/api/adminpreference/post', formValues)
            .then((response)=>{                
                console.log("response after insert webapp:",response.data.message); 
                swal({
                    text : response.data.message
                }) 
                                
            // window.location.reload();
            })
            .catch((error)=>{
                console.log("error => ",error);
                // if(error.message === "Request failed with status code 401"){
                //     var userDetails =  localStorage.removeItem("userDetails");
                //     localStorage.clear();
                //     swal({  
                //         title : "Your Session is expired.",                
                //         text  : "You need to login again. Click OK to go to Login Page"
                //     })
                //     .then(okay => {
                //         if (okay) {
                //             window.location.href = "/login";
                //         }
                //     });
                // }
                
            })
        }        
    }
        
    render() {        
        return (
            <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section className="content">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                            <div className="row">
                                <div className="">
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 paddingZeroo">
                                        <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                            <h4 className="weighttitle">Preferences</h4>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <br/>
                                            <br/>
                                            <form id="websiteModelId" className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12" >
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">Select Website Model <span><i className="astrick">*</i></span></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">                                                        
                                                        <input name="websiteModel" type="radio" value="SingleOwner" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                         checked={this.state.websiteModel === "SingleOwner"} onClick={this.handleChange.bind(this)} />                                                        
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Single Owner website</span>
                                                    </div>

                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">                                                    
                                                        <input name="websiteModel" type="radio" value="MarketPlace" className=" webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        checked={this.state.websiteModel === "MarketPlace"} onClick={this.handleChange.bind(this)} />                                                     
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Multi vendor Marketplace</span>
                                                    </div>

                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">                                            
                                                        <input name="websiteModel" type="radio" value="FranchiseModel" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        checked={this.state.websiteModel === "FranchiseModel"}  onClick={this.handleChange.bind(this)} />                                                     
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Franchise Model</span>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 askPincodeToUser NOpadding">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">Ask Pincode To User on Homepage Launch <span><i className="astrick">*</i></span></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">                                                    
                                                            <input name="askPincodeToUser" type="radio" value="Yes" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                             checked={this.state.askPincodeToUser === "Yes"} onClick={this.handleChange.bind(this)} />                                                        
                                                            <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Yes</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">                                                    
                                                            <input name="askPincodeToUser" type="radio" value="No" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                             checked={this.state.askPincodeToUser === "No"} onClick={this.handleChange.bind(this)} />                                                        
                                                            <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">No</span>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 askPincodeToUser NOpadding">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">For login show separate page or modal <span><i className="astrick">*</i></span></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">
                                                            <input name="showLoginAs" type="radio" value="modal" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                             checked={this.state.showLoginAs === "modal"} onClick={this.handleChange.bind(this)} />
                                                            <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Show Modal</span>
                                                    </div>  
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">
                                                            <input name="showLoginAs" type="radio" value="loginPage" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                             checked={this.state.showLoginAs === "loginPage"} onClick={this.handleChange.bind(this)} />
                                                            <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Show Login Page</span>
                                                    </div>                                                   
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding askPincodeToUser">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">Show Inventory Management <span><i className="astrick">*</i></span></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">                                                        
                                                        <input name="showInventory" type="radio" value="Yes" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                         checked={this.state.showInventory === "Yes"} onClick={this.handleChange.bind(this)} />                                                        
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Yes</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">                                                    
                                                        <input name="showInventory" type="radio" value="No" className=" webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        checked={this.state.showInventory === "No"} onClick={this.handleChange.bind(this)} />                                                     
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">No</span>
                                                    </div>

                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding askPincodeToUser">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">Show Discount Management <span><i className="astrick">*</i></span></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">                                                        
                                                        <input name="showDiscount" type="radio" value="Yes" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                         checked={this.state.showDiscount === "Yes"} onClick={this.handleChange.bind(this)} />                                                        
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Yes</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">                                                    
                                                        <input name="showDiscount" type="radio" value="No" className=" webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        checked={this.state.showDiscount === "No"} onClick={this.handleChange.bind(this)} />                                                     
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">No</span>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding askPincodeToUser">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle"> Show Order Status Management <span><i className="astrick">*</i></span></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">                                                        
                                                        <input name="showOrderStatus" type="radio" value="Yes" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                         checked={this.state.showOrderStatus === "Yes"} onClick={this.handleChange.bind(this)} />                                                        
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Yes</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">                                                    
                                                        <input name="showOrderStatus" type="radio" value="No" className=" webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        checked={this.state.showOrderStatus === "No"} onClick={this.handleChange.bind(this)} />                                                     
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">No</span>
                                                    </div>

                                                </div>
                                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding askPincodeToUser">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">Show Coupen Code <span><i className="astrick">*</i></span></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">                                                        
                                                        <input name="showCoupenCode" type="radio" value="Yes" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                         checked={this.state.showCoupenCode === "Yes"} onClick={this.handleChange.bind(this)} />                                                        
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Yes</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">                                                    
                                                        <input name="showCoupenCode" type="radio" value="No" className=" webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        checked={this.state.showCoupenCode === "No"} onClick={this.handleChange.bind(this)} />                                                     
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">No</span>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding askPincodeToUser form-group">
                                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle" for="sel1">Currency <span><i className="astrick">*</i></span></label>
                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 webmodelInputWrapper ">  
                                                        <select className="col-lg-12 form-control" id="currency" name="currency" value={this.state.currency} onChange={this.handleChange.bind(this)}>
                                                            <option value="₹">₹</option>
                                                            <option value="$">$</option>
                                                            <option value="AED">AED</option>
                                                            <option value="AED">SAR</option>
                                                            <option value="AED">QAR</option>
                                                        </select>
                                                    </div>    
                                                </div>   
                                                <br/> 
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    {this.state.editId
                                                        ?
                                                        <button onClick={this.submit.bind(this)} className="btn button3 btn-primary pull-right">Update</button>
                                                        :
                                                        <button onClick={this.submit.bind(this)} className="btn button3 btn-primary pull-right">Submit</button>
                                                    }
                                                </div> 
                                                                                         
                                            </form>                                            
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    </div>
                </div> 
            </div> 
        );
    } 
}
export default WebsiteModel;

