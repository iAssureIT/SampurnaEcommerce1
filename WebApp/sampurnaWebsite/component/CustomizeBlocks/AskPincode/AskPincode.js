import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import jQuery                 from 'jquery';
import $                      from 'jquery';
import { withRouter }             from 'react-router-dom';
import { connect }                from 'react-redux';
import { bindActionCreators }     from 'redux';
// import {getPincode} from '../../actions/index';
import {getPincode,updatePin} from '../../actions/index';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../sites/currentSite/blocks/AskPincode.css';
import pincodeModalImg from '../../../sites/currentSite/images/modalBackground.png';

class AskPincode extends Component {
    
	constructor(props){
    super(props);
        this.state = {
            "pincode"             : "",
            "pincodeModal2"       : "false",
            "AllowDeliveryMsg"    : "",
            "NotAllowDeliveryMsg" : "",
            "DeliveryStatus"      : "",
            "pincode"             : "",
            "pincodeExists"       : "",
            "deliveryPincode"     :"",
            "pinValid"            :"",
        }        
      }  
    //  componentDidMount(){
    //     var pincode = localStorage.getItem('pincode');
        
    //  }
     UNSAFE_componentWillMount(){
        //  console.log("In will mount");
        var pincode = localStorage.getItem('pincode');  
        var pincodeStatus = localStorage.getItem('status');
        this.props.updatePincode(pincode,pincodeStatus); 
        // this.props.updatePincode(pincode);      
        if(pincode){            
            if(localStorage.getItem('status')){
                axios.get("/api/allowablepincode/checkpincode/"+pincode)
                    .then((response)=>{
                        if(response){          
                            if(response.data.message === "Delivery Available"){                
                                // localStorage.setItem("DeliveryStatus","Allowable");
                                localStorage.setItem("status","Allow");
                                
                                // this.setState({
                                //     DeliveryStatus : "Allowable",
                                // })
                                $('.DeliveryStatusMsg').text("Congratulations!! Your saved Pincode is "+pincode +". Now delivery is possible in your area. Continue Your Shopping!")
                                $('.DeliveryStatusMsg').show();  
                                // $('..pinMessage').show();  
                                // $('.pincodeChild').hide();                         
                                localStorage.setItem("DeliveryStatus","Allowable");
                                localStorage.setItem("pincodeFlag","true");
                                
                                //  console.log("delivery allow", localStorage.getItem('status'));
                            }else{

                                // this.setState({
                                //     DeliveryStatus : "NotAllowable",
                                // });
                                $('.DeliveryStatusMsg').text("Your saved Pincode is " +pincode +". Sorry!! Delivery is still not possible in this area. Please check after some days! When delivery is started in your area, we will notify you on mobile and email.")
                                $('.DeliveryStatusMsg').show();    
                                // $('.pincodeChild').hide();
                                
                                localStorage.setItem("DeliveryStatus","NotAllowable");
                                // console.log("delivery not allow", localStorage.getItem('DeliveryStatus'));
                            
                            }
                        }
                    })
                    .catch((error)=>{
                        console.log('error', error);
                    })
                }
            }//end pincode
        // console.log(" componentWillmountUserPincode:====",this.state.pincode);
     }
 
    closeModal(event){
        // event.preventDefault();
        $("#pageOpacity").hide();
        $('#pincodeModal').hide();
        localStorage.setItem('pincodeFlag',"false");

    }

      checkDelivery(event){
        event.preventDefault(); 
        // $("#pageOpacity").show();
        var userPincode =  $('.pinocodeInput').val();        
        //create object to store userPincode data into localStorage
        localStorage.setItem("pincode",userPincode);
        var pincodeStatus = localStorage.getItem('status');        
        localStorage.setItem('deliveryStatusMsg',"true");
        axios.get("/api/allowablepincode/checkpincode/"+userPincode)
            .then((response)=>{
                var status = "";
                if(response){  
                    if(response.data.message === "Delivery Available"){ 
                        // this.setState({
                        // 	AllowDeliveryMsg  : "We can deliver in your area of Pincode " +this.state.pincode +" . Continue Your Shopping!",					
                        // }); 
                      
                        $('.AllowDeliveryMsg').text("Great!! We can deliver in your area of Pincode " +userPincode +" . Continue Your Shopping!")
                        $('.AllowDeliveryMsg').show();  
                        $('.DeliveryStatusMsg').hide();   
                        $('.NotAllowDeliveryMsg').hide();  
                        $('.marginTop').hide();  
                        $('.addPincode').css("margin-top","40px");                     
                        this.closeModal();
                        localStorage.setItem("status","Allow");
                        this.props.updatePincode(userPincode,"Allow"); 
                        // console.log("pincode===",localStorage.getItem('pincode'));
                                 
                    }else{                        
                        this.props.updatePincode(userPincode,"NotAllow"); 
                        $('.NotAllowDeliveryMsg').text("Sorry... We can not deliver in your area of Pincode " +userPincode +" . Check again after few days!")
                        $('.NotAllowDeliveryMsg').show(); 
                        $('.DeliveryStatusMsg').hide();
                        $('.AllowDeliveryMsg').hide();  
                        $('.marginTop').hide(); 
                        $('.addPincode').css("margin-top","40px");                    
                        // var pincodeObj = JSON.parse(localStorage.getItem("pincodData"));
                        // pincodeObj.status = "NotAllow";
                        localStorage.setItem("status", "NotAllow");
                        
                    }           
                }
            })
            .catch((error)=>{
                console.log('error', error);
            })
        
      }
      validatePIN (pin) {
		if(pin.length === 4 ||  pin.length === 6 ) {
		  if( /[0-9]/.test(pin))  {
			return true;
		  }else {return false;}
		}else {
			return false;
			}
	 }

    handleChange(event) {         
        $('#pincode').click(function(){
            $("#pageOpacity").show();        
        });  
         
        // if (event.target.name === 'pincode') {
        //     this.handlePincode(event.target.value);
        // }

        if(event.target.name ==="pincode"){
			var pinValid = this.validatePIN(event.target.value);
			this.setState({
				pinValid : pinValid,
			}); 
			console.log("pincode valid ==",pinValid);
		}
    }
    handlePincode(pincode){        
        if (pincode !== '') {
            axios.get("https://api.postalpincode.in/pincode/" +pincode)
            .then((response) => {
                // console.log('valid', $("[name='modalpincode']").valid())
                // console.log('pincodeExists', this.state.pincodeExists);

                if ($("[name='modalPincode']").valid()) {

                    if (response.data[0].Status === 'Success' ) {
                        this.setState({pincodeExists : true})
                    }else{
                        this.setState({pincodeExists : false})
                    }
                }else{
                    this.setState({pincodeExists : true})
                }
                
            })
            .catch((error) => {
                console.log('error', error);
            })
        }else{
            this.setState({pincodeExists : true})
        }
    }
      
  render() {  
    
    // $('#pageOpacity').click(function(){
    //   $("#pageOpacity").show();
    //   $("#pincodeModal").show();
    //   $('#loginFormModal').show();
   // });
		return (            
			<div className="col-lg-8 col-md-8 col-sm-10 col-xs-12">                
                    <div id="pincodeModal" className="modal in" data-backdrop="static" data-keyboard="false">
                        <div className="modal-dialog">
                            <div className="modal-content pincodemodal col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding" style={{'background': 'url(' +pincodeModalImg  +')'}}>                                                        
                                <div className="modal-body">   
                                <button type="button" className="close"  data-dismiss="modal" aria-hidden="true" onClick={this.closeModal.bind(this)}>&times;</button>                       
                                    <form>                                    
                                        <div className="col-lg-12 col-md-12 addPincode">
                                            <div id="pincode" className=" col-lg-12 col-md-12 col-sm-12 Pincode_div">                                                
                                                <div>
                                                        {(localStorage.getItem('pincode') !== null)?
                                                             <div className="pinMessage">Message</div>
                                                        :
                                                            <div className="marginTop"></div>
                                                        }
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding DeliveryStatusMsg">                                            
                                                            
                                                        </div>
                                                        <div className="pincodeChild">
                                                            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 NotAllowDeliveryMsg deliveryMsg">
                                                                <span>{this.state.NotAllowDeliveryMsg}  </span>                                                    
                                                            </div>
                                                            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 AllowDeliveryMsg deliveryMsg">
                                                                <span>{this.state.AllowDeliveryMsg} </span>                                                                
                                                            </div>
                                                            <div  className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding"style={{padding:"0px"}}>We have just started! </label><br/>
                                                                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding pinInfo">
                                                                    <span className="NoPadding"style={{padding:"0px"}}>Our delivery is restricted to only certain areas. </span>
                                                                    <span className="NoPadding"style={{padding:"0px"}}>Check the delivery in your area. </span>
                                                                </div>
                                                                
                                                                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding"style={{"textAlign":"center"}}>What’s your area pincode? </div>
                                                            </div>
                                                            <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding pincodeBtnwrapper">   
                                                                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">  
                                                                    <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-7">                                                                        
                                                                    <div className="input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                        <span className="input-group-addon"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                                                                        <input id="pincode" type="number" className="form-control pinocodeInput" minLength="6" maxLength="6" name="pincode" placeholder="Pincode..."  onChange={this.handleChange.bind(this)}/>
                                                                    </div> 
                                                                    {this.state.pinValid=== false?
                                                                        <label className="error">Please enter valid pincode</label>
                                                                    :
                                                                        null 
                                                                    }
                                                                    {/* {this.state.pincodeExists ? null : <label className="error" style={{color: "red", fontWeight: "100"}}>This pincode does not exists!</label>}   */}
                                                                    </div>                                           
                                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-5">
                                                                        <button className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn newModalBtn pull-right hidden-lg hidden-md hidden-sm" onClick={this.checkDelivery.bind(this)}>Check</button>
                                                                        <button className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn newModalBtn pull-right hidden-xs" onClick={this.checkDelivery.bind(this)}>Check Delivery</button>
                                                                    </div>
                                                                </div>
                                                            </div> 
                                                        </div>
                                                </div>                     
                                                                                    
                                            </div>
                                            </div>
                                    </form>                                
                                </div>
                            </div>
                        </div>
                    </div>                     
                {/* : null
                }        */}
            </div>
          
		);
	}
}

const mapStateToProps = (state) => {
    // console.log("askpincode form state===",state);
    return {
      
        deliveryPincode : state.deliveryPincode,
        pincodeStatus  : state.pincodeStatus,
  
  
    }
  }
  const mapDispachToProps = (dispatch) => {
    return  bindActionCreators({ showpincode :getPincode,updatePincode : updatePin}, dispatch)
    // return  bindActionCreators({ showpincode :getPincode, updatePincode : updatePin }, dispatch)
  }
  export default connect(mapStateToProps, mapDispachToProps)(withRouter(AskPincode));
// export default AskPincode;