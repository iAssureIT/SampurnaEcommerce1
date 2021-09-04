import React, { Component }        from 'react';
import { Link } from 'react-router-dom';

import './css/circlemenubars.css';


export default class CircleMenuBars extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
            url:""
           
        }
    }

    componentDidMount(){
        var urlParam = window.location.pathname;
       // console.log('urlParam=>',urlParam);
       // const pathname = this.props.location;
       console.log(" url   =>",urlParam);
        // var vname =   this.props.match.params;

        let a = urlParam.split('/');
        console.log("a==>",a[1]); 
        this.setState({
                        url:urlParam
                    });

      
    }

    componentWillUnmount() {
   
    }

    render() {
     
       

        console.log("this.state.urlParam",this.state.url);
            return (
                    <div className="bgoftitle">
                        <img src="/images/header3.jpg" height="185" width="100%"/>
                        <div className="wizard col-lg-12 col-md-12 col-xs-12 col-sm-12 bgImgTitleBox">
                        <div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h2 className="text-center">Create New Page </h2>
                        </div>
                        <div className="wizard-inner col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className="connecting-line"></div>
                            <ul className="nav nav-tabs" role="tablist">
                                <li role="presentation" className={this.state.url ==="/viewpage1" ? "active": this.state.url ==="/viewpage2" || this.state.url ==="/viewpage3" ? "tab-done" : ""}>
                                    <Link to="/viewpage1" title="viewpage1">
                                        <span className="round-tab circleSpan">
                                            <i className="fa fa-object-group fa-stack-1x circleIcon"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote ">List Of Pages</div>
                                </li>
                                <li role="presentation" className={this.state.url === "/viewpage2/:url"? "active":this.state.url === "/viewpage3" ? "tab-done" : ""}>
                                    <Link to="/viewpage2" title="viewpage2">
                                        <span className="round-tab  circleSpan">
                                            <i className="fa fa-info fa-stack-1x circleIcon"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote">Add Block</div>
                                </li>
                               <li role="presentation" >{/*className={urlParam === "viewpage3"? "active" : ""}*/}
                                    <Link to="/viewpage3" title="viewpage3">
                                        <span className="round-tab  circleSpan">
                                            <i className="fa fa-file fa-stack-1x circleIcon circleIconReceipt"></i>
                                        </span>
                                    </Link>
                                    <div className="wizardNote">View Page</div>
                                </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                );
            }
}

