import React from 'react';
import "./NewTask.css";
import Axios from 'axios';

export default class NewTask extends React.Component {

	constructor(props) {
		
		super(props);
		this.state = {
			startRange  : 0,
            limitRange  : 10,
		}; 
					   }
					   


	componentDidMount(){
					var data=({
					startRange : this.state.startRange,
					limitRange :this.state.limitRange
					});
				Axios.get('http://qaapi-bookstore.iassureit.in/api/category/get/list', data)
				.then((response)=>{

					console.log('category data', response.data);
					var filtered = response.data.filter(function(item,index){return (index>=8)})


					this.setState({
					blocks: filtered
			
                   },()=>{
					   console.log("blocks",this.state.blocks)
				   })
                 })
				.catch((error)=>{
					console.log('error', error);
				});
					
	}
	

	render() {

		return(
			<div className="pageWrapperMain col-lg-10 col-lg-offset-1">
			
		

					{
						this.state.blocks && this.state.blocks.length > 0 ?
						this.state.blocks.map((data, index)=>{
						console.log("blocks",data);
					return (
						<div className="pageWrapper col-lg-3">
                              
							<div className="container boxWrapper col-lg-12">
						    
								<div className="col-md-12 col-lg-12" key={index}>
								     <div className="row">
										<div className="box" style={{backgroundImage:"url("+data.categoryImage+")"}}>
											
											<h2>{data.category}</h2>
										</div>
									</div>	
								</div>
								
							</div>
							
							
					</div>
								
								
						
				     	);
						})
						
						:
						
					   null
				    }
               
            </div>

	            );
	        	}

            	}
 
			
 