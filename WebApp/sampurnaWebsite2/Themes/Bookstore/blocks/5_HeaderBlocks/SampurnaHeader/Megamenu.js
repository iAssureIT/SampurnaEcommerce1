import React from 'react';
import axios from 'axios';
import Link  from 'next/link';
// import { useRouter } from 'next/router'
import $, { post }            from 'jquery';

// const router = useRouter()

class Megamenu extends React.Component{
constructor(props){
    super(props);
    this.state = {
        menudata : {},
        categoryData : [],
        vendorList : [],
        loading : true,
    }
}

componentDidMount(){

    this.getVendorData();

    var url = window.location.href.split('/');
    // console.log("url===",url);
    if(url[4]===undefined){
      this.setState({
        addToCart :true,
      })
    }
    
    axios.get("/api/sections/get/get_megamenu_list")
        .then((response)=>{
        if(response.data){
        // console.log("section data===",response.data); 
        this.setState({ 
            categoryData : response.data
        },()=>{
            for(let i=0;i<this.state.categoryData.length;i++){
                // console.log("url[4]==",url[4]);
                if(url[4]=== this.state.categoryData[i].sectionUrl){
                    // console.log("section match==",url[4],this.state.categoryData[i]._id);
                    $('.HeaderSection_'+this.state.categoryData[i]._id).addClass('activeSection');
                }else if(url[6]=== this.state.categoryData[i].sectionUrl){
                    // console.log("section match==",url[4],this.state.categoryData[i]._id);
                    $('.HeaderSection_'+this.state.categoryData[i]._id).addClass('activeSection');
                }
            }
        })
        }
        })
        .catch((error)=>{
            console.log('error', error);
        })

  }  
    getVendorData(){
        var url = window.location.href.split('/');
        const sectionurl = url[4];
        if(sectionurl){
            this.setState({
                "sectionurl" :sectionurl,
            })
        }
        var formValues={};
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));  
        console.log("sampurnaWebsiteDetails=>",sampurnaWebsiteDetails);
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionurl,
                    "latitude"   : sampurnaWebsiteDetails.deliveryLocation.latitude,
                    "longitude"  : sampurnaWebsiteDetails.deliveryLocation.longitude
                }
            }else{
                formValues =  {
                    "startRange" : 0,
                    "limitRange" : 10,
                    "sectionUrl" : sectionurl,
                    "latitude"   : "",
                    "longitude"  : ""
                }
            }
        }else{
            formValues =  {
                "startRange" : 0,
                "limitRange" : 10,
                "sectionUrl" : sectionurl,
                "latitude"   : "",
                "longitude"  : ""
            }
        }

        axios.post("/api/vendorlist/post/vendor/list",formValues)
        .then((vendorResponse) => {
            if(vendorResponse){
                console.log("vendorResponse 99 ===>",vendorResponse);
                this.setState({
                    "vendorList" : vendorResponse.data,
                    "loading"    : false
                });
            }
        })
        .catch((error) => {
            console.log('productwise vendorlist error', error);
        })
    }

render(){
    return(
        <ul className="nav navbar-nav navbar-default justify-content-left navbar-center main-nav col-12">        
            {
                Array.isArray(this.state.categoryData) && this.state.categoryData.map((sectionDetails,sectionindex)=>{  
                    return( 
                    <li key={sectionindex.toString()} className="nav-item dropdown dropDownLevel1">

                        {/* <Link className={"HeaderSection_"+sectionDetails._id} href={"/vendor-list/[sectionurl]"}  as={"/vendor-list/"+sectionDetails.sectionUrl} passhref={true}>
                            <a className={"HeaderSection_"+sectionDetails._id}>{sectionDetails.section}&nbsp;</a>
                        </Link>  */}
                        
                        <a href={"/vendor-list/"+sectionDetails.sectionUrl} className={"HeaderSection_"+sectionDetails._id}>{sectionDetails.section}&nbsp;</a>
                        
                    </li> 
                    );
                })
                
                // Array.isArray(this.state.categoryData && this.state.vendorList) && this.state.categoryData.map((vendordata,sectionDetails,sectionindex)=>{  
                //     return( 
                //         <li key={sectionindex.toString()} className="nav-item dropdown dropDownLevel1">

                //             {/* <Link className={"HeaderSection_"+sectionDetails._id} href={"/vendor-list/[sectionurl]"}  as={"/vendor-list/"+sectionDetails.sectionUrl} passHref={true}>
                //                 <a className={"HeaderSection_"+sectionDetails._id}>{sectionDetails.section}&nbsp;</a>
                //             </Link>  */}

                //             <a href={"/products/"+vendordata.vendor_ID+"/"+vendordata.vendorLocation_id +"/"+this.state.sectionurl} className={"HeaderSection_"+sectionDetails._id}>{sectionDetails.section}&nbsp;</a>
                //         </li> 
                //     );
                // })
            }
        </ul>

        // {
        //     Array.isArray(this.state.vendorList) && this.state.vendorList.length >0?
        //     this.state.vendorList.map((vendordata, index)=>{
        //         return(
        //             <div className="col-6" key={index}>
        //                 <div className={"col-12 card mt-4"}>
        //                     <Link href={"/products/"+vendordata.vendor_ID+"/"+vendordata.vendorLocation_id +"/"+this.state.sectionurl} className={"HeaderSection_"+sectionDetails._id}>{sectionDetails.section}
        //                     </ Link >
        //                 </div>
        //             </div>
        //         )
        //     })
        // :
        //     <div className={"col-8 offset-2 text-center mt-4"}>
        //         <div className="alert alert-warning">
        //             <i className="fa fa-warning"></i> &nbsp;
        //             Section are not availabe.
        //         </div>
        //     </div>
        // }
    )
}

}
export default Megamenu;