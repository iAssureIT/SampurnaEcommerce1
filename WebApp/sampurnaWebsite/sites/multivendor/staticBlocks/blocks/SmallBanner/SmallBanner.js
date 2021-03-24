import React, { Component } from 'react';
// import $                    from 'jquery';
// import axios                from 'axios';

import "../../../sites/currentSite/blocks/SmallBanner.css";

class SmallBanner extends Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 banner" style={{"backgroundImage": `url(`+this.props.bannerData.backgroungImage+`)`}}>
                        <h1>{this.props.bannerData.title}</h1>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bannerText">
                            {
                                this.props.bannerData.breadcrumb ?
                                    <ul className="bannerUL">
                                        <li><a href="/">Home</a></li>&nbsp;&nbsp;
                                        <li>/ &nbsp;<strong>{this.props.bannerData.breadcrumb}</strong></li>
                                    </ul>
                                :
                                null
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default SmallBanner;