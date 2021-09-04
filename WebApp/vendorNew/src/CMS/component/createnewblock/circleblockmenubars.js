import React, { Component }        from 'react';
import { Link } from 'react-router-dom';

import '../css/circlemenubars.css';


export default class CircleBlockMenuBars extends Component{


    componentDidMount(){
      
    }

    componentWillUnmount() {
   
    }

    render() {
       var urlParam = window.location.pathname;
       // console.log('urlParam=>',urlParam);
       const pathname = this.props.location;
       // console.log(" url   =>",pathname);
        /*var vname =   this.props.match.params;
        console.log("vname",vname);*/
            return (
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                   
                    <div className="wizard  boxItem1CMBlock">
                        
                        <div className="wizard-inner col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className="connecting-line"></div>
                            <ul className="nav nav-tabs" role="tablist">
                                <li role="presentation" className={urlParam ==="/cms/select-new-block" ? "active": urlParam ==="/cms/create-new-block" || urlParam ==="/cms/view-blocks" ? "tab-done" : ""}>
                                    <Link to="/cms/select-new-block" title="Select block design for new block">
                                        <span className="round-tab circleSpan">
                                            <i className="fa fa-object-group fa-stack-1x circleIcon"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote ">Select Block Design</div>
                                </li>
                                <li role="presentation" className={urlParam === "/cms/create-new-block"? "active":urlParam === "/cms/view-blocks"?"tab-done" : ""}>
                                    <Link to="/cms/create-new-block" title="">
                                        <span className="round-tab  circleSpan">
                                            <i className="fa  fa-info fa-stack-1x circleIcon"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote"> Enter Data</div>
                                </li>
                               <li role="presentation" className={urlParam === "/cms/view-blocks"? "active" : ""}>
                                    <Link to="/cms/view-blocks" title="">
                                        <span className="round-tab  circleSpan">
                                            <i className="fa fa-file fa-stack-1x circleIcon circleIconReceipt"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote">View Blocks List</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>
                );
            }
}

