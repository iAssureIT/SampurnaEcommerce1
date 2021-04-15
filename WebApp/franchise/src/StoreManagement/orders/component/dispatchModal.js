import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import moment                 from "moment";
// import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';


class dispatchModal extends Component{
    constructor(props) {
        super(props);

        if(!this.props.loading){
            this.state = {
                "orderData":[],
                // "notificationData" :Meteor.subscribe("notificationTemplate"),
            };
        } else{
            this.state = {
                "orderData":[],
            };
        }
        window.scrollTo(0, 0);
    }

    componentDidMount() {
      var websiteModel = (localStorage.getItem('websiteModel'));
      this.setState({
        websiteModel: websiteModel
      },()=>{
        // FranchiseModel
       //console.log("websiteModel==>",this.state.websiteModel)
      })
    }
    addDispatchDetails(event){
        event.preventDefault();
        
        var id = $(event.currentTarget).attr('id');

        var businessAssociate = $('.dispatchForm').find('#businessAssociate').val();

        var expDeliveryDate = $('.expDeliveryDate').val();
        
        if(businessAssociate !== '' ){
          var formValues = {
                          "orderID"             :  id,
                          "userid"              :  localStorage.getItem('admin_ID'),
                          "businessAssociateId" : businessAssociate
                          }
          //console.log(formValues);

          axios.patch('/api/orders/patch/dispatchOrder', formValues)
          .then((response)=>{
            //console.log('response', response);
            swal({
              title : response.data.message,
            });
             if(response.status === 200){
                
                    swal({
                        title: 'Order is dispatched Successflly',
                    });
                    // this.getOrders();
                    var modal = document.getElementById('adminModal');
                    modal.style.display = "none";
                    $('#businessAssociate').val('');
                    $('.expDeliveryDate').val('');
                    
                    window.location.reload();
                }
          })
          .catch((error)=>{
            console.log('error', error);
          })
            
        }else{
            swal({
                title: 'Please fill all fields',
            });
        } 
  
    }
    closeModal(event){
       event.preventDefault();
        // console.log('event',event);
        var modal = document.getElementById('dispatchModal');
        
        modal.style.display = "none";
        
       
        $('.dispatchCompanyName').val('');
        $('.deliveryPersonName').val('');
        $('.deliveryPersonContact').val('');
    }
    
    render(){
        return( 
          <div className="col-lg-12">
            {
              /*<div  id="dispatchDetails" role="dialog">
              <div className="modal-dialog adminModal addressModal-dialog" id="adminModal">
              <div className="modal-content adminModal-content col-lg-12 col-md-12  col-sm-12 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">                                                                              
                  <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11">DISPATCH ORDER</h4>
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
                    <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.closeModal.bind(this)} >&times;</button>
                  </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">

                  <form className="dispatchForm" onSubmit={this.addDispatchDetails.bind(this)} id={this.props.orderId}>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      
                      <div className="row inputrow">
                          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                          <div className="form-group">
                              <br/>
                              <label>Business Associate</label><span className="astrick">*</span>
                              <div className="input-group">
                              <span className="input-group-addon" id="basic-addon1"><i className="fa fa-gg" aria-hidden="true"></i></span>
                                <select className="form-control" id="businessAssociate">
                                { this.props.baList && this.props.baList.length > 0 ?
                                    this.props.baList.map( (data, index)=>{
                                        return (
                                          <option key={index} value={data.userID}>{data.companyName}{ data.locationDetails.length > 0 ?  ' ( '+ data.locationDetails[0].area +''+'-'+  data.locationDetails[0].pincode +' )' : ''}</option>
                                        );
                                      })
                                      :
                                      null
                                }
                                </select>
                              
                              </div>
                          </div>
                          </div>
                      </div>
                      <div className="row inputrow">
                          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                          <div className="form-group">
                              <label>Expected Delivery Date</label><span className="astrick">*</span>
                              {
                                
                                <input name="expDeliveryDate" type="date" min={moment().format('YYYY-MM-DD')} className="expDeliveryDate form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="expDeliveryDate"  />
                         
                              }
                               </div>
                          </div>
                      </div>
                      </div>
                      <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" onClick={this.closeModal.bind(this)} data-dismiss="modal">CANCEL</button>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <input  type="submit" className="btn adminFinish-btn col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" value="DISPATCH" />
                          </div>
                      </div>
                  </form>

                  </div>
                  <div className="modal-footer">
                      
                    </div>
                  </div>
                </div>
              </div>*/
              
                }  
                {
                <div className="modal-dialog adminModal addressModal-dialog" id="adminModal">
                  <div className="modal-content">
                    <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">                                                                              
                      <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11">DISPATCH ORDER</h4>
                    </div>
                    <div className="modal-body">
                      <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right" style={{'marginTop':'-48px'}}>
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.closeModal.bind(this)} >&times;</button>
                      </div>
                      <form className="dispatchForm" onSubmit={this.addDispatchDetails.bind(this)} id={this.props.orderId}>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      {this.state.websiteModel !== 'FranchiseModel' ? 
                       <div className="row inputrow">
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                        <div className="form-group">
                            <br/>
                            <label>Business Associate</label><span className="astrick">*</span>
                            <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1"><i className="fa fa-gg" aria-hidden="true"></i></span>
                              <select className="form-control" id="businessAssociate">
                              { this.props.baList && this.props.baList.length > 0 ?
                                  this.props.baList.map( (data, index)=>{
                                      return (
                                        <option key={index} value={data.userID}>{data.companyName}{ data.locationDetails.length > 0 ?  ' ( '+ data.locationDetails[0].area +''+'-'+  data.locationDetails[0].pincode +' )' : ''}</option>
                                      );
                                    })
                                    :
                                    null
                              }
                              </select>
                            
                            </div>
                        </div>
                       </div>
                      </div>
                      : null }
                     
                      <div className="row inputrow">
                          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                          <div className="form-group">
                              <label>Expected Delivery Date</label><span className="astrick">*</span>
                              {
                                
                                <input name="expDeliveryDate" type="date" min={moment().format('YYYY-MM-DD')} className="expDeliveryDate form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="expDeliveryDate"  />
                         
                              }
                               </div>
                          </div>
                      </div>
                      </div>
                      <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" onClick={this.closeModal.bind(this)} data-dismiss="modal">CANCEL</button>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <input  type="submit" className="btn adminFinish-btn col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" value="DISPATCH" />
                          </div>
                      </div>
                  </form>
                      <br/>
                    </div>
                    <div className="modal-footer">
                      
                    </div>
                  </div>
                </div>
              }
            </div>
        );
    }
}

export default dispatchModal
