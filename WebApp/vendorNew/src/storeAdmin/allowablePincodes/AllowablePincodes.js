import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import  './AllowablePincodes.css';

class AllowablePincodes extends Component {
    constructor(props) {        
        super(props);
        this.state = {
            "editId"             : "",
            allowablePincodes    : {},
            franchiseList        : [],
            allowablePincodeList : [],
            finalList            : [],
        };
        
    }
    componentDidMount() {
        // this.getEntityList();
        // this.getAllowablePincode();

    }  
    componentWillMount() {
        this.getEntityList();
        // this.getAllowablePincode();
    }
    
    getAllowablePincode(){
        axios.get("/api/allowablepincode/get")
			.then((allowablepincodesData) => {
				if(allowablepincodesData){
                    // console.log("2. allowable pincodes list:",allowablepincodesData);
                    // await this.getEntityList();
                    // console.log("franchiseList:====",this.state.franchiseList);
					// console.log("allowable pincodes list length:",allowablepincodesData.data.length);
					this.setState({
						allowablePincodeList  : allowablepincodesData.data,												
                    });
                    // this.state.allowablePincodeList.reverse();
                    // console.log("get allowablePincodeList list=======",this.state.allowablePincodeList);      
                    // console.log("get allowablePincodeList list=======",this.state.allowablePincodeList.length);              
                }
            })			
			.catch((error) => {
                console.log("Error while getting pincodes:",error);
			})
    }

    getEntityList(){
        var entityType = "franchise";
        axios.get("/api/entitymaster/get/"+entityType)
			// .then(async(franchiseData) => {
            .then((franchiseData) => {
				if(franchiseData){
                    console.log("1. get franchise list response===:",franchiseData);
                    // await this.getAllowablePincode();
                    // this.getAllowablePincode();
                    this.setState({
						franchiseList  : franchiseData.data,						
                    });
                axios.get("/api/allowablepincode/get")
                .then((allowablepincodesData) => {
                    if(allowablepincodesData){
                        // console.log("2. allowable pincodes list:",allowablepincodesData);
                        // await this.getEntityList();
                        // console.log("franchiseList:====",this.state.franchiseList);
                        // console.log("3. allowable pincodes list length:",allowablepincodesData.data);
                        
                        var finalList = [];
                        var matched = 'false';
                        for(let i=0;i<franchiseData.data.length;i++){
                            console.log("inside for i loop");
                            console.log("pincodelist==========",allowablepincodesData.data.length);                            
                                for(let k=0;k<allowablepincodesData.data.length;k++){          
                                
                                        if(franchiseData.data[i]._id === allowablepincodesData.data[k].franchiseID){
                                            console.log("allowable FID:",allowablepincodesData.data[k].franchiseID);
                                            console.log("Franchise FID:",franchiseData.data[i]._id);
                                            console.log("Inside for k loop",allowablepincodesData.data[k].allowablePincodes);                                        
                                                finalList[i] = {
                                                    "franchiseID"       : franchiseData.data[i]._id,
                                                    "companyID"         : franchiseData.data[i].companyID,
                                                    "companyName"       : franchiseData.data[i].companyName,
                                                    "locations"         : franchiseData.data[i].locations,
                                                    "state"             : franchiseData.data[i].state,
                                                    "allowablepincodes" : allowablepincodesData.data[k].allowablePincodes ? allowablepincodesData.data[k].allowablePincodes:"",
                                                    "PincodesID"        : allowablepincodesData.data[k]._id ? allowablepincodesData.data[k]._id : "",   
                                                } 
                                                matched = 'true';                                     
                                            
                                            break;
                                        }                    
                                            
                                    }// k loop end 
                                    if(matched === 'false'){
                                                finalList[i] = {
                                                    "franchiseID"       : franchiseData.data[i]._id,
                                                    "companyID"         : franchiseData.data[i].companyID,
                                                    "companyName"       : franchiseData.data[i].companyName,
                                                    "locations"         : franchiseData.data[i].locations,
                                                    "state"             : franchiseData.data[i].state,
                                                    "allowablepincodes" : '',
                                                    "PincodesID"        : "",   
                                                }                                        
                                            
                                            }   

                                                         
                        }//i loop end
                        this.setState({
                            finalList  : finalList
                                                                             
                        });
                        console.log("finalList=======:" ,this.state.finalList);
                    
                    }
                })			
                .catch((error) => {
                    console.log("Error while getting pincodes:",error);
                })           

					
                                       
                }
            })            			
			.catch((error) => {
                console.log("error:",error);
			})
    }
    handleChange(event) {
        // event.preventDefault();
        const target = event.target;
        console.log("target:",target);
        var id  = target.getAttribute('data-fid');
        console.log("franchise Id :" ,id);
        var allowablePincodes = this.state.allowablePincodes;

        allowablePincodes[id]={
                                "pincodes"    :event.target.value.split(','),
                                "companyID"   :target.getAttribute('data-cid'),
                                "franchiseID" : id,
                              }
       
        console.log("allowablepincods object:",this.state.allowablePincodes);
       
    }
    submit(event){
        event.preventDefault();    
                var formValues = this.state.allowablePincodes         
                
                 console.log('formValues', formValues);
                if($("#allowablePincodeId").valid()){        
                    axios.post('/api/allowablepincode/post', formValues)
                    .then((response)=>{                
                        console.log("response after insert pincode:",response.data.message); 
                        swal({
                            text : response.data.message
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
                                            <h4 className="">Franchise Allowable Pincodes</h4>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <br/>
                                            <br/>
                                            <form id="allowablePincodeId" className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12" autocomplete="off" >
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 websiteModel NOpadding">                                                    
                                                    <table class="table table-bordered table-striped table-hover allowablePincodeTable">
                                                        <thead>
                                                            <tr>
                                                                <th className="col-lg-1 col-md-1 col-sm-2">Sr. No.</th>
                                                                <th className="col-lg-7 col-md-7 col-sm-6">Franchise Details</th>
                                                                <th className="col-lg-4 col-md-4 col-sm-4">Allowable Pincodes</th>                                                                
                                                            </tr>

                                                        </thead>
                                                        <tbody>                                                            
                                                             {Array.isArray(this.state.finalList) &&
                                                                this.state.finalList.map((data, index) => {                                                               
                                                                    return (
                                                                        <tr className ="pincodesRow">
                                                                            <td>{index +1}</td>
                                                                            <td>
                                                                                {data.companyName},<br/>
                                                                                {data.locations[0] ? data.locations[0].locationType : null},&nbsp;{data.locations[0] ? data.locations[0].addressLine1 : null},<br/>
                                                                                {data.locations.state}
                                                                            </td>                                                                            
                                                                            <td>
                                                                                    <input type="text" id={data.franchiseID} data-cid={data.companyID} data-fid={data.franchiseID} autocomplete="false" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                                                    ref="pincodes" name={data.franchiseID} defaultValue={data.allowablepincodes}  onChange={this.handleChange.bind(this)} placeholder="Enter allowable pincodes.."/>
                                                                            </td>                                                                           
                                                                        
                                                                        </tr> 
                                                                    );
                                                                })   
                                                            } 
                                                            { Array.isArray(this.state.finalList.length) === 0 
                                                                ?
                                                                <tr className="trAdmin">
                                                                    <td colspan="3" class="noTempData textAlignCenter">No Record Found!</td>
                                                                </tr> 
                                                                :null
                                                            }

                                                        </tbody>
                                                    </table>
                                                                                                                                                     
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
export default AllowablePincodes;

