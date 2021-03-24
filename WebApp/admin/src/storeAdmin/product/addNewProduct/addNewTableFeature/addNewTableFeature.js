import React, { Component }   from 'react';
import $                      from 'jquery';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';

export default class AddNewTableFeature extends Component{
    constructor(props) {
      super(props);
      this.state = {
        ['attributeName'+props.index] : props.attributeName,
        ['attributeValue'+props.index] : props.attributeValue
      };
    }
    deleteProductTableRow(event){
        event.preventDefault();
        $(event.currentTarget).parent().parent().remove();
    }

    handleChange(event){
      const target = event.target;
      const name   = target.name;
      this.setState({
          [name]: event.target.value,
      });
    }
    componentWillReceiveProps(nextProps) {
      this.setState({
        ['attributeName'+nextProps.index] : nextProps.attributeName,
        ['attributeValue'+nextProps.index] : nextProps.attributeValue
      });
    }
    render(){
        return(
            <tr>
               <td className="col-lg-5">
                  <input type="text" value={this.state['attributeName'+this.props.index]} name={"attributeName"+this.props.index} onChange={this.handleChange.bind(this)} className={"attributeName"+this.props.index + " form-control attributeNameRef"} ref={"attributeName"+this.props.index} />
               </td>
               <td className="col-lg-5">
                  <input type="text" value={this.state['attributeValue'+this.props.index]} name={"attributeValue"+this.props.index} onChange={this.handleChange.bind(this)} className={"attributeValue"+this.props.index + " form-control attributeValueRef"} ref={"attributeValue"+this.props.index} />
               </td>
               <td  className="col-lg-1">
                   <div className="delete-product-table-row" onClick={this.deleteProductTableRow.bind(this)} >
                       <i className="fa fa-trash redFont" aria-hidden="true"></i>
                   </div>
               </td>
           </tr>
        );
    }
}
