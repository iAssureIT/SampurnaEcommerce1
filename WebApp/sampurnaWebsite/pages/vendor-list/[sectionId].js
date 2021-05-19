
import React, { Component } from 'react';
import axios                from 'axios';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import { components }       from 'react-select';
import Style                from "./vendor-list.module.css";

class VendorList extends Component {
    constructor(props) {
        super(props);
        this.state ={
            vendorList : [],
        }
    }

    componentDidMount(){
        var formValues =  {
            "startRange" : 0,
            "limitRange" : 10,
            "section_ID" : "60a36920f7bfdf0e7ee8e0ce",
            "latitude"   : "",
            "longitude"  : ""
        }
        axios.post("/api/entitymaster/post/vendor/list",formValues)
			.then((vendorResponse) => {
                if(vendorResponse){
                    console.log('VendorList', vendorResponse.data)
                    this.setState({
                        vendorList: vendorResponse.data
                    })
                }
			})
			.catch((error) => {
				console.log('error', error);
			})

    }

    render(){
        return(
            <section>
                <Header />    
                <div className="col-12">
                    <div className="row">
                        <div className="col-12"> Vendor List</div>
                        <div className={"col-12  "+Style.vendorListWrapper}>

                           { Array.isArray(this.state.vendorList) && this.state.vendorList.length >0?
                                this.state.vendorList.map((vendordata, index)=>{
                                    {console.log("vendordata===",vendordata);}
                                    return(
                                        <div className={"card col-4  " +Style.vendorCard}>
                                            <div className="card-body"><span style={{color:"#fff"}}>{vendordata.companyName}</span>
                                                <div style={{height:50,width:50}}>
                                                    <img src={vendordata.companyLogo[0]} className="img-thumbnail"/>
                                                </div>   
                                            </div> 
                                        </div>
                                    )
                                })
                                
                            :null
                            }

                        </div>
                    </div>
                </div>
                < Footer />
            </section>
        )
    }
}

export default VendorList;