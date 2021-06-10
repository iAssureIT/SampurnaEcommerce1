import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import Router                 from 'next/router'; 

import { connect }            from 'react-redux';
import { setProductApiUrl }     from '../../../../../redux/actions/index.js'; 
import  store                 from '../../../../../redux/store.js';

class Searchbar extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
          
         }
    }    
    searchProducts() {        
          var searchstr = this.refs.tableSearch.value.trim();
          if(searchstr){          
            var productApi = "/api/products/get/search/" + searchstr;
            store.dispatch(setProductApiUrl(productApi));
            Router.push('/search-product');          
          }    
      }

   render(){
        return(  
            <div className="col-12 col-sm-7 ">                                
                <div className="col-12 NoPadding">  
                    <div className="row mtm3"> 
                        {/* <select name="category_product" className=" col-3 category-selection">
                            <option value="">All Category</option>
                            {Array.isArray(this.state.categorydata) && this.state.categorydata.map((category,index)=>{
                                    return(
                                        <option value="uncategorized" key={index}>{category.category}</option>                                         
                                    )
                                }) 
                            }
                            
                        </select> */}
                        <input type="text" placeholder="What are you looking for?" 
                        onChange={this.searchProducts.bind(this)} 
                        className="form-control tableSearch col-11" ref="tableSearch" id="tableSearch" name="tableSearch" />
                        <div className="searchIcon"><i className="fa fa-search"></i></div>
                    </div>                              
                </div>                                
            </div>
      
        );        
    }
}

const mapStateToProps = state => (
    // console.log("1. state in header====",state.data),
    {
    });
  
  const mapDispatchToProps = {
    
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);