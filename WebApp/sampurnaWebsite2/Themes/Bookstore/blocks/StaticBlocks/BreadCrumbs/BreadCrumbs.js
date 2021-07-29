import React, { Component } from 'react';
import Style from  "./BreadCrumbs.module.css";

class BreadCrumbs extends Component{
    constructor(props){
        super(props);
        this.state={
            "breadcrumb" : "",
        }
    }
    componentDidMount(){
       var url = window.location.pathname; 
       url = url.split('/');
    //    console.log("url:",url[1]);
       url = url[1].replace(/\-/g,' ');
    //    console.log("url after repalce -:",url);
       this.setState({
        breadcrumb : url.charAt(0).toUpperCase() + url.slice(1),
       });
    }
    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">                    
                    {
                        this.state.breadcrumb !=="" ?
                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding " +Style.breadCrumbs}>            
                            <ul className={Style.links}>
                                <li><a href="/">Home / {this.state.breadcrumb} </a></li>&nbsp;                
                            </ul>
                        </div>                            
                        :
                        null
                    }                            
                </div>
            </div>
        )
    }
}

export default BreadCrumbs;