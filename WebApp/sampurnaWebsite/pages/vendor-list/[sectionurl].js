
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
        var url = window.location.href;
        console.log("url===",url.split('/'));
        var sectionId = url.split('/')[4];
        // var sectionId = 
        var formValues =  {
            "startRange" : 0,
            "limitRange" : 10,
            "section_ID" : sectionId,
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
                        <div className={"col-12 text-center mt2 mb2 " +Style.vendorlistTitle}> Select Shop</div>
                        <div className={"col-12  "+Style.vendorListWrapper}>

                           { Array.isArray(this.state.vendorList) && this.state.vendorList.length >0?
                                this.state.vendorList.map((vendordata, index)=>{
                                    // {console.log("vendordata===",vendordata);}
                                    return(
                                        <div className={"card col-4  " +Style.vendorCard} key={index}>
                                            <div className={"card-body " +Style.cardBody}>
                                                <div className={Style.vendorLogo}>
                                                    <img src={vendordata.companyLogo[0]} className="img-thumbnail"/>
                                                </div>   
                                                <div>{vendordata.companyName}</div>
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