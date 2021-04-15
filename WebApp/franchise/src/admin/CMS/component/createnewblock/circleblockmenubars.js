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
                <div className="bgoftitle">
                    <img src="/images/header3.jpg" height="185" width="100%"/>
                    <div className="wizard col-lg-12 col-md-12 col-xs-12 col-sm-12 bgImgTitleBox">
                        <div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h2 className="text-center">Select Required Block from Following list </h2>
                        </div>
                        <div className="wizard-inner col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className="connecting-line"></div>
                            <ul className="nav nav-tabs" role="tablist">
                                <li role="presentation" className={urlParam ==="/viewblock1" ? "active": urlParam ==="/viewblock2" || urlParam ==="/viewblock3" ? "tab-done" : ""}>
                                    <Link to="/viewblock1" title="viewblock1">
                                        <span className="round-tab circleSpan">
                                            <i className="fa fa-object-group fa-stack-1x circleIcon"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote ">Select Block Design</div>
                                </li>
                                <li role="presentation" className={urlParam === "/viewblock2"? "active":urlParam === "/viewblock3"?"tab-done" : ""}>
                                    <Link to="/viewblock2" title="viewblock2">
                                        <span className="round-tab  circleSpan">
                                            <i className="fa  fa-info fa-stack-1x circleIcon"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote"> Enter Data</div>
                                </li>
                               <li role="presentation" >{/*className={urlParam === "viewpage3"? "active" : ""}*/}
                                    <Link to="/viewblock3" title="viewpage3">
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

