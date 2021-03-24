import React, { Component } from 'react';
import "../../../sites/currentSite/blocks/ProductDivider.css";

export default class ProductDivider extends Component {
	constructor(props){
    super(props);
	   
	    this.state={
	    	categoriesImg        : [],
	    }
  	} 
  	componentWillReceiveProps(nextProps){
  		
  		this.setState({categoriesImg:nextProps.categories},()=>{
  			
  		});
      // this.changeProductCateWise(categoryID, type);
    } 
  render() {
  	 
		return (
		<div className="col-lg-12 col-md-12 col-ms-12 col-xs-12 flatSale">	
			<div className="col-lg-12 col-md-12 col-ms-12 col-xs-12">
				<div className="col-lg-12 col-md-12 col-ms-12 col-xs-12">
					<div className="col-lg-12 col-md-12 col-ms-12 col-xs-12 shopByCat mt50 mb15">SHOP BY CATEGORY</div>
				</div>
				{
					this.state.categoriesImg && this.state.categoriesImg.map((data,index)=>{
						if (index < 8 ) {
						return(
							<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6" key={index}>
				                <a href={"/section/"+ data.section.replace(/\s+/g, '-').toLowerCase() +'/'+data.section_ID} >
				                <div className="block">
				                    <a className="image" href={"/section/"+data.sectionUrl+'/'+data.section_ID} target="_blank" rel="noopener noreferrer"> 
				                    <img src={data.categoryImage} alt="home banner" className="divImage"/></a>
				                	<div className=" figcaption1">
				                		<span>{data.category}</span>
				                	</div>
				                </div>
				                </a>
			            	</div>
						);
						}
					})
				}
         	</div>  
        </div> 	
		);
	}
}
