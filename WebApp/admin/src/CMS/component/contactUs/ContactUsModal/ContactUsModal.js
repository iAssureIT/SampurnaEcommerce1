import React,{Component}      from 'react';
import swal                   from 'sweetalert';
import $                      from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';

// import { render } from 'react-dom';
import Select                 from 'react-select-nested';
import ContactUsform from '../../allBlocks/ContactUsform/ContactUsform.js';



import './ContactUsModal.css';
class ContactUsModal extends Component{
  constructor(){
    super();
     this.state={
    
     }

  }
  render(){
    const fruit = [
          {
              val: 0,
              label: 'Services',
              items: [{parentVal: 1, val: 7, label: 'Upstream'},{parentVal: 1, val: 8, label: 'Downstream'},{parentVal: 1, val: 9, label: 'Health safty & Environment '},{parentVal: 1, val: 10, label: 'Asset Management'},{parentVal: 1, val: 11, label: 'Digital Services'}]
          },
          {
              val: 1,
              label: 'Sales'
          },  {
              val: 2,
              label: 'Support'
          },  {
              val: 3,
              label: 'Consulting'
          },
        /*  {
              val: 2,
              label: 'Sales',
              items: [{parentVal: 2, val: 5, label: 'sub item 3'}, {parentVal: 2, val: 6, label: 'sub item 4'}]
          },
          {
              val: 3,
              label: 'Pomegranate',
              items: [{parentVal: 3, val: 9, label: 'sub item 5'}, {parentVal: 3, val: 10, label: 'sub item 6'}]
          },
          {
              val: 4,
              label: 'Strawberry',
          }*/
      ];
 
    return(
      <div className="modal fade" id="contactUsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg " role="document">
          <div className="modal-content ContactmodalContent  ">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="row">
                    <div className="contactText lightbluetext  text-center">
                        <span>Contact</span><span className="us"> Us</span>
                    </div>
                </div>
              </div>
            </div>
            <div class="modal-body">
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <ContactUsform />                               
              </div>   
            </div>        
          </div>
        </div>
      </div>
     
              
       
    );
  }
}

export default ContactUsModal;



