import React, { Component } from 'react';
// import $                    from 'jquery';
// import axios                from 'axios';

// import "../../../sites/currentSite/blocks/SmallBanner.css";

class SmallBanner extends Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <div className="col-12 col-xl-12">
                <div className="row">
                    <div className="col-12 col-xl-12 banner" style={{"backgroundImage": `url(`+this.props.bannerData.backgroungImage+`)`}}>
                        <h1 className="hidden-xs hidden-sm bannerTitle_">{this.props.bannerData.title}</h1>
                       {/* <h2 className="hidden-lg hidden-md hidden-xs" >{this.props.bannerData.title}</h2>
                        <h3 className="hidden-lg hidden-md hidden-sm" >{this.props.bannerData.title}</h3>*/}
                        <div className="col-col-xl-12 col-12 bannerText">
                            {
                                this.props.bannerData.breadcrumb ?
                                    <ul className="bannerUL">
                                        <li><a href="/">Home</a></li>&nbsp;&nbsp;
                                        <li>/ &nbsp;<span>{this.props.bannerData.breadcrumb}</span></li>
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