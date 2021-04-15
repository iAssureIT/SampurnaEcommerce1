import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from 'jquery';
import axios                from 'axios';


export default class BusinessAssociateList extends Component {
  
  constructor(props) {
      super(props);
      this.state={'baList':[]}
    
    }
  componentDidMount(){
    this.getBA();
  }
  getBA(){
      axios.get("/api/businessassociates/get/list")
            .then((response)=>{
              console.log(response.data);
              this.setState({
                  baList : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })  
    }
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  
  render() {
    return (
      <div>
      <div className="content-wrapper">
        <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
        <section className="content">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 box">
                          <div className="box-header with-border">
                        <h4 className="weighttitle">Business Associate List</h4>
                    </div>
                    
                    
                    {
                      this.state.baList && this.state.baList.length >0 ?
                      this.state.baList.map((data,index)=>{
                        console.log(data);
                              return(
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist selected" key={index} 
                                   name={index}  data-child={data._id+'-'+index} id={data._id}>
                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 baLogoDiv">
                                      <img src={data.logo} className="baLogoImage"></img>
                                    </div>
                                    <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
                                      <h5 className="titleprofile">{data.companyName}</h5>
                                      <ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
                                      <li><i className="fa fa-arrows col-lg-1 noPadding" aria-hidden="true"></i>Website: {data.website}</li>
                                      <li>&nbsp;PAN: {data.pan}</li>
                                      <li>&nbsp;GST No: {data.gstno}</li>
                
                                      </ul>                     
                                    </div>
                                  </div>    
                              );

                      })
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
                        <h5>No Data Found</h5>
                      </div>
                    }
                  
                    </div>
                  </div>
              </div>
          </section>
      </div>
  </div>
    )
  }
}