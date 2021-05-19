import React from 'react';
import axios from 'axios';
import Link  from 'next/link';

class Megamenu extends React.Component{
constructor(props){
    super(props);
    this.state = {
        menudata : {},
        categoryData : [],
    }
}
componentDidMount(){
    axios.get("/api/sections/get/get_megamenu_list")
              .then((response)=>{
               if(response.data){
                // console.log("section data===",response.data); 
                this.setState({ 
                    categoryData : response.data
                })
              }
              })
              .catch((error)=>{
                  console.log('error', error);
              })
  }  

render(){
    return(   
            <ul className="nav navbar-nav justify-content-left navbar-center main-nav col-12">        
           {          
                 Array.isArray(this.state.categoryData) && this.state.categoryData.map((sectionDetails,sectionindex)=>{                 
                    return( 
                    <li key={sectionindex.toString()} className="dropdown dropDownLevel1">
                        <Link href={"/vendor-list/" +sectionDetails._id}>
                        {/* <Link href={`/section/${encodeURIComponent(sectionDetails.sectionUrl)}`}> */}
                            <a className="">{sectionDetails.section}&nbsp;{sectionDetails.categorylist.length > 0?<i className="fa fa-angle-down"></i>:null}</a>
                        </Link>   

                        {/* <span className="sectionForMobile hidden-lg hidden-md ">{sectionDetails.section}&nbsp;{sectionDetails.categorylist.length > 0?<i className="fa fa-angle-down"></i>:null}</span>                     */}
                        
                        {sectionDetails.categorylist.length>8?
                        <div className=" mega-menu-warpper ">
                        <ul className="ulDropdown">
                        {Array.isArray(sectionDetails.categorylist) && sectionDetails.categorylist.map((cateoryDetails,catindex)=>{ 
                            return(
                            <li key={catindex.toString()} className="dropDownLevel2 col-12">
                                <Link href={`/category/${encodeURIComponent(cateoryDetails.categoryUrl)}`}>
                                    <a className="col-12 ellipsis" title={cateoryDetails.category}>{cateoryDetails.category}</a>
                                </Link>                                
                            </li> 
                            );
                        })
                        }
                        </ul>
                        </div>
                        :
                        sectionDetails.categorylist.length>0?
                        <ul className="mutilevelDropdown1 categorymenuWrap">
                            {                            
                             Array.isArray(sectionDetails.categorylist) && sectionDetails.categorylist.map((cateoryDetails,catindex)=>{ 
                                 var catindex = catindex+1;                  
                                  return(                                    
                                        <li key={catindex} className="dropDownLevel2">
                                             {/* <Link href={"/category/" +cateoryDetails.categoryUrl}> */}
                                            {cateoryDetails.subCategory && cateoryDetails.subCategory.length>0?
                                             <span>
                                                <Link href={`/category/${encodeURIComponent(cateoryDetails.categoryUrl)}`}>
                                                    <a>{cateoryDetails.category}</a>                                                
                                                </Link>
                                                <i className="fa fa-angle-right pull-right" aria-hidden="true"></i>
                                             </span>
                                            :
                                             <span>
                                                <Link href={`/category/${encodeURIComponent(cateoryDetails.categoryUrl)}`}>
                                                    <a>{cateoryDetails.category}</a>                                                
                                                </Link>                                               
                                            </span>
                                             }
                                            { cateoryDetails.subCategory && cateoryDetails.subCategory.length>0?  
                                            <ul className={"mutilevelDropdown2"}>
                                                {
                                                cateoryDetails.subCategory && cateoryDetails.subCategory.map((subCateoryDetails,index)=>{                       
                                                    return(                                    
                                                        <li key={index} className="dropDownLevel3">
                                                            
                                                            <Link href={`/subcategory/${encodeURIComponent(subCateoryDetails.subCategoryUrl)}`}>
                                                            {/* <Link href={`/subcategory/${encodeURIComponent(subCateoryDetails.subCategoryTitle.replace(/\s/g, '').toLowerCase())}`}> */}
                                                                <a>{subCateoryDetails.subCategoryTitle}</a>
                                                            </Link>                                                                
                                                        </li>
                                                    );                             
                                                })
                                                }
                                            </ul>
                                            :null}
                                        </li>
                                  );                             
                              })
                            }
                        </ul>
                        :null
                        }
                    </li> 
                    );
                })
            }
          </ul>
    )
}
}
export default Megamenu;