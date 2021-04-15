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
            "editId" : "",
            "askPincodeToUser" : "",
        };
        
    }
    componentDidMount() {
    }  
    
    componentWillReceiveProps(nextProps) {
        
    }
    handleChange(event) {
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });  
        console.log("websiteModel:", this.state.websiteModel); 
        console.log("askpincode",this.state.askPincodeToUser);
    }
    submit(event){
        event.preventDefault();    
                var formValues = {
                    "websiteModel" : this.state.websiteModel ,  
                    "askPincodeToUser" : this.state.askPincodeToUser,         
                }
                 console.log('formValues', formValues);
                if($("#websiteModelId").valid()){        
                    axios.post('/api/adminpreference/post', formValues)
                    .then((response)=>{                
                        console.log("response after insert webapp:",response.data.message); 
                        swal({
                            text : response.data.message
                        })               
                        this.setState({
                            WebsiteModel  : ""
                        })
                    })
                    .catch((error)=>{
                        console.log('error', error);
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
                                            <h4 className="">Website Model</h4>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <br/>
                                            <br/>
                                            <form id="websiteModelId" className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12" >
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">Select Website Model <span><i className="astrick">*</i></span></div>

                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">
                                                        <input name="websiteModel" type="radio" value="SingleOwner" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        onClick={this.handleChange.bind(this)} />
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Single Owner website</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">
                                                        <input name="websiteModel" type="radio" value="MarketPlace" className=" webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        onClick={this.handleChange.bind(this)} />
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Multi vendor Marketplace</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">
                                                        <input name="websiteModel" type="radio" value="FranchiseModel" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        onClick={this.handleChange.bind(this)} />
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Franchise Model</span>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 askPincodeToUser NOpadding">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteTitle">Ask Pincode To User on Homepage Launch <span><i className="astrick">*</i></span></div>

                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper ">
                                                        <input name="askPincodeToUser" type="radio" value="true" className="webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        onClick={this.handleChange.bind(this)} />
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">Yes</span>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webmodelInputWrapper">
                                                        <input name="askPincodeToUser" type="radio" value="false" className=" webModelInput col-lg-1 col-md-1 col-sm-2 col-xs-2"
                                                        onClick={this.handleChange.bind(this)} />
                                                        <span className="col-lg-11 col-md-11 col-sm-10 col-xs-10 modelLabel">No</span>
                                                    </div>
                                                </div>
                                                <br/> 
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    {this.state.editId
                                                        ?
                                                        <button onClick={this.update.bind(this)} className="btn button3 btn-primary pull-right">Update</button>
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

