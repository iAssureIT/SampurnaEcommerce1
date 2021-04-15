import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import OneFieldForm         from '../../Master/OneFieldForm/OneFieldForm.js';

const format = "h:mm a";
class Roles extends Component{
   constructor(props) {
    super(props);
    this.state = {
      fields : {
        placeholder : "Enter the name of entity",
        title       : "Roles",
        attributeName : "role"
      },
      "tableHeading": {
                role: "Roles",
                actions: 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/roles/',
                paginationApply: false,
                searchApply: false,
                editUrl: '/umroleslist'
            },
            "startRange": 0,
            "limitRange": 10,
            "editId": this.props.match.params ? this.props.match.params.fieldID : ''


      };
  }
  componentDidMount() {
        var editId = this.props.match.params.fieldID;
       
        this.setState({
            editId: editId
        })
        var editId = this.props.match.params.fieldID;
        window.scrollTo(0, 0);
    }
     componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.fieldID;
        if (nextProps.match.params.fieldID) {
            this.setState({
                editId: editId
            })
        }
    }

    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <OneFieldForm fields={this.state.fields}
                              tableHeading={this.state.tableHeading}
                              tableObjects={this.state.tableObjects}
                              editId ={this.props.match.params.fieldID}
                              history={this.props.history} />
            </div>

        );
    }
}

 export default Roles;










// import React, { Component } from 'react';
// import { render }           from 'react-dom';
// import TimePicker           from 'rc-time-picker';
// import moment               from 'moment';
// import jQuery               from 'jquery';
// import $                    from 'jquery';
// import OneFieldForm         from '../../Master/OneFieldForm/OneFieldForm.js';
// import 'rc-time-picker/assets/index.css';
// import {connect}            from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { getRoleWiseAccessToModule, getAccessToFacility } from '../../actions/index';

// const format = "h:mm a";
// class Roles extends Component{
//    constructor(props) {
//     super(props);
//     this.state = {
//       "tableHeading": {
//           role      : "Role",
//           actions   : 'Action',
//       },
//       "tableObjects": {
//           deleteMethod    : 'delete',
//           apiLink         : '/api/roles',
//           paginationApply : false,
//           searchApply     : false,
//           editUrl         : '/umroleslist'
//       },
//       "startRange"    : 0,
//       "limitRange"    : 10,
//       "fields" : {
//         placeholder   : "Enter role..",
//         title         : "Role",
//         attributeName : "role"
//       },
//       // "editId"        : this.props.match.params ? this.props.match.params.fieldID : '',
//     };
//   }
//   componentDidMount(){
    
 
//   }
//   async componentDidMount() {
//       var editId = this.props.match.params.fieldID;
     
//       this.setState({
//           editId: editId
//       })
//       var editId = this.props.match.params.fieldID;

//   }
//    componentWillReceiveProps(nextProps) {
//       var editId = nextProps.match.params.fieldID;
//       if (nextProps.match.params.fieldID) {
//           this.setState({
//               editId: editId
//           })
//       }
//   }
 
//   render(){
//     return(
//           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
//               <div>
//               {
//                 this.props.match.params.fieldID 
//                 ? 
//                 <OneFieldForm fields={this.state.fields}
//                               tableHeading={this.state.tableHeading}
//                               tableObjects={this.state.tableObjects}
//                               editId ={this.props.match.params.fieldID}
//                               history={this.props.history} />
//               :null
//               }
//               </div>
//           </div>       
//     );
//   }
//  }

// export default Roles;