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
    }
}

componentDidMount(){
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

render(){
    return(   
            <ul className="nav navbar-nav navbar-default justify-content-left navbar-center main-nav col-12">        
           {          
                 Array.isArray(this.state.categoryData) && this.state.categoryData.map((sectionDetails,sectionindex)=>{  
                    return( 
                    <li key={sectionindex.toString()} className="nav-item dropdown dropDownLevel1">

                        {/* <Link className={"HeaderSection_"+sectionDetails._id} href={"/vendor-list/[sectionurl]"}  as={"/vendor-list/"+sectionDetails.sectionUrl} passHref={true}>
                            <a className={"HeaderSection_"+sectionDetails._id}>{sectionDetails.section}&nbsp;</a>
                        </Link>  */}
                        
                        <a href={"/vendor-list/"+sectionDetails.sectionUrl} className={"HeaderSection_"+sectionDetails._id}>{sectionDetails.section}&nbsp;</a>
                        
                    </li> 
                    );
                })
            }
          </ul>
    )
}
}
export default Megamenu;