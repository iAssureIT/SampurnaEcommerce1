import React, { version } from 'react';
import './Distribution.css';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import jQuery from 'jquery';
import $ from 'jquery';

export default class DeliveryChallans extends React.Component {
	constructor(props) {
		super(props);
		  this.state = {
					currentDate       : '',
                    FranchiseId       : '',
                    DeliveryChallanNo : '',
					DistributionDate  :'',
					FranchiseData     : [],
					totalDemand       : 0,
                    totalSupply       : 0,
                    totalRemain       : 0,
                    user_id           :'',
                    role              : '',
                    accepted          : 'false',
                    rejected          : 'false',
                    rejectRemark      : '',
                    FranchiseDeliveryId : '',
                    entityInfo        : '',
                    contacts 	      : '',
                    locations 	      : '',
                    entityType 	      : '',
                    franchise_name    : '',
                    DeliveryChallanArray : [],
                    challanData       : [],
      };
    }
    
    componentDidMount(){
        console.log("fffff");
        console.log('orderID',this.props.match.params.purchaseId);
        var poId = this.props.match.params.purchaseId;
        this.getdeliveryChallansForPo(poId);
        var  role = localStorage.getItem("roles");

        this.setState({
            role : role
        });

        jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});

        
        $("#remarkForm").validate({
        rules: {
            remark: {
                required: true,
            },
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") === "remark") {
            error.insertAfter("#remark");
            }
        }
        });
       
    }

    getdeliveryChallansForPo(id){
        // deliveryChallansForPo
        axios.get('/api/franchiseDelivery/get/deliveryChallansForPo/'+id)
        .then((franchiseData) => {
            console.log('franchiseData',franchiseData.data[0].franchise_id);

            var DeliveryChallanArray = [];
            var challanNo;
            franchiseData.data.filter(function(item,index){
                var i = DeliveryChallanArray.findIndex(x => x.deliveryChallanNum == item.deliveryChallanNum);
                if(i <= -1){
                    DeliveryChallanArray.push(item.deliveryChallanNum);
                }
                return null;
            });

            this.setState({
                DeliveryChallanArray : DeliveryChallanArray,
                AllChallans          : franchiseData.data,
                FranchiseId          : franchiseData.data[0].franchise_id
            },()=>{   
                this.getFranchiseDetails();
                this.SelectDeliveryChallan(DeliveryChallanArray[0]);

            })
        })
        .catch(error=>{
            console.log("error in franchise Challan = ", error);
        })
	}
    
    getFranchiseChallan(distributionId){
        // // axios.get('/api/franchiseDelivery/get/franchiseDeliveryChallan/'+distributionId)
        // // .then((franchiseData) => {
        // //           var FranchiseData = [];
        // //           var DistributionData = [];
        // //           var FranchiseOrderedData = []; 
        // //           if(franchiseData){
        // //             //console.log("franchiseData",franchiseData);
        // //             let remain = franchiseData.data.supply.reduce(function(prev, current) {
        // //                 return prev + +current.remainQty
        // //             }, 0); 

        // //             let totalDemand = franchiseData.data.supply.reduce((prev, current) => {
        // //                 return prev + +current.orderedQty;
        // //             }, 0); 
          
        // //             let totalSupply = franchiseData.data.supply.reduce(function(prev, current) {
        // //                   return prev + +current.suppliedQty
        // //             }, 0); 

                    
        // //             this.setState({
        // //                 "FranchiseDeliveryId" : franchiseData.data._id,
        // //                 "FranchiseData"       : franchiseData.data.supply,
        // //                 "DeliveryChallanNo"   : franchiseData.data.deliveryChallanNum,
        // //                 "DistributionDate"    : moment(franchiseData.data.distributionDate).format("YYYY-MM-DD"),
        // //                 "FranchiseId"         : franchiseData.data.franchise_id,
        // //                 "totalDemand"         : totalDemand,
        // //                 "totalSupply"         : totalSupply,
        // //                 "totalRemain"         : remain,
                        
        // //             },()=>{
        // //                 this.getFranchiseDetails();
        // //             });
        // //           }

                
        //   })
        //   .catch(error=>{
        //       console.log("error in franchise Challan = ", error);
        //   })
    }

    getFranchiseDetails(){
        axios.get("/api/entitymaster/get/one/"+this.state.FranchiseId)
        .then((response)=>{
            this.setState({
                franchise_name : response.data.companyName,
                entityInfo 	: response.data,
                contacts 	: response.data.contactData,
                locations 	: response.data.locations.reverse(),
                entityType 	: response.data.entityType
            });
        })
        .catch((error)=>{
        })
    }

    changeAttribute(event){
		event.preventDefault();
		var attribute = event.target.getAttribute('data-attribute');
    	var attributeValue = event.target.getAttribute('data-attributeValue');
        var itemcode  = event.currentTarget.getAttribute('data-itemcode');
        var suppliedQty = event.currentTarget.getAttribute('data-suppliedqty');
        var orderedQty = event.currentTarget.getAttribute('data-orderedqty');
        if(itemcode){
            if(attributeValue=="true"){
                attributeValue = false;
            } else {
                attributeValue = true;
            }

            if(orderedQty == suppliedQty){
                if(attribute == 'deliveryAccepted'){
                    attribute = 'deliveryCompleted';
                }
            }

            var data = {
				attribute           : attribute,
				attributeValue      : attributeValue,
                itemcode            : itemcode,
                FranchiseDeliveryId : this.state.FranchiseDeliveryId,
            }

            if(attribute == "accepted"){
                
                this.setState({
                    accepted   : attributeValue,
                },()=>{
                   // console.log("accepted",this.state.accepted);
                })
            }else{
                this.setState({
                    rejected   : attributeValue,
                },()=>{
                    //console.log("accepted",this.state.accepted)
                })  
            }
            this.updateFranchiseDelivery(data);
        }
    }

    updateFranchiseDelivery(data){
        axios.put('/api/franchiseDelivery/attribute', data)
        .then((response)=>{
            var poId = this.props.match.params.purchaseId;
            this.getdeliveryChallansForPo(poId);
            this.setState({
                rejectRemark : ''
            })
        })
        .catch((error)=>{
          console.log('error', error);
        })
    }

    delete(event){
        event.preventDefault();
        if($('.remarkForm').valid()){
            var attribute = event.target.getAttribute('data-attribute');
            var attributeValue = event.target.getAttribute('data-attributeValue');
            var itemcode  = event.currentTarget.getAttribute('data-itemcode');
            var data = {
				attribute      : attribute,
				attributeValue : attributeValue,
                itemcode       : itemcode,
                FranchiseDeliveryId  : this.state.FranchiseDeliveryId,
                remark         : this.state.rejectRemark
            }

            if(attribute == "accepted"){
                this.setState({
                    accepted   : attributeValue,
                },()=>{
                    //console.log("accepted",this.state.accepted);
                })
            }else{
                this.setState({
                    rejected   : attributeValue,
                },()=>{
                    //console.log("accepted",this.state.accepted)
                })  
            }
            this.updateFranchiseDelivery(data);
        }

        
    }

    addRejectRemark(event){
        event.preventDefault();
        this.setState({
            rejectRemark : event.target.value
        });
    }

    SelectDeliveryChallan(challanNo){
        var filteredArray = this.state.AllChallans.filter(function(item,index){
            if(item.deliveryChallanNum ==  challanNo){
                return item;
            }
            return null;
        });

        this.setState({
            FranchiseDeliveryId : filteredArray[0]._id,
            challanData       : filteredArray[0].supply,
            DeliveryChallanNo : filteredArray[0].deliveryChallanNum,
            DistributionDate  : moment(filteredArray[0].deliveryDate).format("YYYY-MM-DD")
        },()=>{
            console.log("state",filteredArray.deliveryChallanNum);
        })
    }

	render() {
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="" style={{"display": "inline-block","float": "left"}}>Delivery Challan</h4>
                            <a href="/franchise-order-summary" className="backtoMyOrders" style={{"display": "inline-block","float": "right"}}><i class="fa fa-chevron-circle-left"></i> Back</a>
                        </div>
                        {this.state.DeliveryChallanArray.length > 1  ? 
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <h5 className="col-lg-4 col-md-4 col-xs-12 col-sm-12">All Challans Numbers</h5>
                            <div className="col-lg-8 col-md-8 col-xs-12 col-sm-12">
                                {
                                    this.state.DeliveryChallanArray.map((result, index)=>{
                                        // console.log("result",result);
                                        if(this.state.DeliveryChallanNo == result){
                                            return(
                                                <button className="btn btn-sm result activeChallanBtn" onClick={this.SelectDeliveryChallan.bind(this,result)}>{result}</button>
                                            )
                                        }else{
                                            return(
                                                <button className="btn btn-sm result challanBtn" onClick={this.SelectDeliveryChallan.bind(this,result)}>{result}</button>
                                            )
                                        }
                                       
                                    })
                                }
                            </div>
                        </div>
                        : null
                        }
                        <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 outerbox">
                            <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12">
                               <strong class="box-title"><span>Challan Number</span></strong>
                               <div className="box-content">{this.state.DeliveryChallanNo}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12">
                               <strong class="box-title"><span>Distribution Date</span></strong>
                               <div className="box-content">{this.state.DistributionDate}</div>
                            </div>
                            {/* <div className=" col-lg-4 col-md-4 col-xs-12 col-sm-12">
                               <strong class="box-title"><span>Franchise</span></strong>
                               <div className="box-content">{this.state.franchise_name}</div>
                            </div> */}
                        </div>
                        
                        <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 outerbox">
                            <div className="table-responsive">          
								<table className="table table-bordered table-striped table-hover">
									<thead className="thead-light text-center bg-primary">
                                        <tr>
                                            <th rowSpan="2">Product Name</th>
                                            <th>Ordered Quantity </th>
                                            <th>Supplied Quantity</th>
                                            {/* <th>Accept</th> */}
                                            <th>Action</th>
                                        </tr>
                                       
									</thead>
								    <tbody>
                                    {
                                        Array.isArray(this.state.challanData) && this.state.challanData.length > 0
                                        ? 
                                            this.state.challanData.map((result, index)=>{
                                                console.log("result",result);
                                              
                                                return(
                                                    <tr key={index}>
														<td>{result.productName} <br/><small>{result.productCode} - {result.itemCode}</small></td>
                                                        <td>{result.orderedQty} {result.orderedUnit}</td>
                                                        <td>{result.suppliedQty} {result.suppliedUnit}</td>
                                                        {/* <td><i onClick={this.changeAttribute.bind(this)} data-attribute="deliveryAccepted" data-itemcode={result.itemCode} data-attributeValue={(result.status == "deliveryAccepted") ? "true" : "false"} title={ (result.status === "deliveryAccepted" )? "Disable It" : "Enable It" } className={'fa fa-check-circle prodCheckboxDim ' + ( result.status === "deliveryAccepted" ? "prodCheckboxDimSelected" : "prodCheckboxDimNotSelected" )} aria-hidden="true"></i></td>	 */}
                                                        <td>
                                                        <button onClick={this.changeAttribute.bind(this)} data-orderedqty={result.orderedQty} data-suppliedqty={result.suppliedQty} data-attribute="deliveryAccepted" data-itemcode={result.itemCode} data-attributeValue={(result.status == "deliveryAccepted" || result.status == "deliveryCompleted") ? "true" : "false"} title="When you accept,this quantity will be added to your current stock" className={'btn btn-success btn-sm inactiveAccept ' + ( result.status === "deliveryAccepted" || result.status == "deliveryCompleted" ? "Accepted" : "NotClicked" )}>Accept</button>
                                                        <button type="button" data-toggle="modal" data-target={"#showDeleteModal-"+(result.itemCode)}  data-attribute="deliveryRejected" data-itemcode={result.itemCode} data-attributeValue={(result.status == "deliveryRejected") ? "true" : "false"} title="When you reject,this quantity will not be added to your current stock"  className={' btn btn-warning btn-sm ' + ( result.status === "deliveryRejected" ? " rejected" : "NotClicked" )} data-backdrop="false">Reject</button>
                                                        <div className="modal fade" id={"showDeleteModal-" + (result.itemCode)} role="dialog">
																<div className=" adminModal adminModal-dialog modal-centered col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
																		<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <h4 class="col-lg-6 col-md-6 col-sm-6 col-xs-12 pull-left">Reject Product</h4>
                                                                            <div className="adminCloseCircleDiv pull-right  col-lg-6 col-md-6 col-sm-6 col-xs-12 NOpadding-left NOpadding-right pull-right">
                                                                                    <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#showDeleteModal-" + (result.itemCode)}>&times;</button>
                                                                            </div>
																		</div>
																		<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingTop5" style={{paddingBottom:"0"}}>                                                                            
                                                                            <div className="row">
                                                                               <h5><b>Product Name : {result.productName}</b>  (Product Code : {result.productCode} Item Code    : {result.itemCode})</h5>
                                                                            </div>
                                                                            <br/>
                                                                            <div className="row">
                                                                                <form className="remarkForm">
                                                                                <div className="form-group text-align-left col-lg-12 col-md-12 col-xs-12 col-sm-12 mbt25">
                                                                                    <label>Remark <i className="redFont">*</i></label>
                                                                                    <textarea type="textarea" name="remark" className="rejectRemark form-control" data-itemcode={result.itemCode} value={this.state.rejectRemark} onChange={this.addRejectRemark.bind(this)} required/>
                                                                                </div>
                                                                                </form>
                                                                            </div>
																		</div>

																		<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
																				<button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
																			</div>
																			<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                                {this.state.rejectRemark ?
																				<button onClick={this.delete.bind(this)} id={(result.itemCode)} type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1"  data-attribute="deliveryRejected" data-itemcode={result.itemCode} data-attributeValue={(result.status == "deliveryRejected") ? "true" : "false"} data-dismiss="modal">DELETE</button>
                                                                                : 
                                                                                <button onClick={this.delete.bind(this)} id={(result.itemCode)} type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1 disabled"  data-attribute="deliveryRejected" data-itemcode={result.itemCode} data-attributeValue={(result.status == "deliveryRejected") ? "true" : "false"} >DELETE</button>
                                                                                }
																			</div>
																		</div>
																	</div>
																</div>
															</div>
                                                        </td>															
													</tr> //onClick={this.showModal.bind(this)}
                                                )
                                            })
                                        : null
                                    }
                                    </tbody>
                                    <tfoot style={{fontWeight:'bold',display:'none'}}>
                                        <tr>
                                            <td>Total</td>
                                            <td>{this.state.totalDemand}</td>
                                            <td>{this.state.totalSupply}</td>
                                            <td></td>
                                        </tr>
									</tfoot>
                            </table>
                            </div>
                           </div>
					</div>
				</div>
			</div>
		);
	}
}
