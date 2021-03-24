import React, { Component } from 'react';
import { Link } from 'react-router-dom';
/*import { Link } from 'react-router-dom';*/
/*import { BrowserRouter } from 'react-router-dom';*/
/*import { Route, Redirect } from 'react-router';*/
import axios 				from 'axios';

/*import { browserHistory ,withRouter } from 'react-router';*/
// import history from '../../history';

 

import '../css/selectpagedesign.css';

class Selectpagedesign extends Component {
   

    constructor(props) {
        super(props);
        this.state={
        	pageDesigns : [],
    	}

    	console.log("---->",this.props)
    }

    componentDidMount(){
    	/*const inputData =  [
        			{
					    
					    "_id": 1,
					    "designName": "Design 1",
					    "designImage": "/images/about-us.jpg",
					  },
					  {
					    "_id": 2,
					    "designName": "Design 2",
					    "designImage": "/images/MobileAppService.jpg",
    				  },
					  {
					    "_id": 3,
					    "designName": "Design 3",
					    "designImage": "/images/WebAppService.jpg",
					    
					  }
        	];*/

        const inputData = axios
        .get('/api/pageDesignmasters/list')
		  	.then(response=> {
		  	   let data = response.data;
		  	   this.setState({
        			"pageDesigns" : data,
       			});

		    // handle success
		    	console.log("here data",this.state.pageDesigns);
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});

        
        

    }

    selectDesign(event){
    	var id = event.currentTarget.id;
    	console.log("id",id);
    	console.log("props = ",this.props);
    	/*var data = this.state.allData;*/
    	// this.props.history.push('/viewpage2/'+id);
    	/*{<Redirect push to="/viewpage2"/>}*/
    }
      selectDesign1(event){
    	
    	console.log("=this.props=>",this.props);
    	// this.props.history.push('/viewpage2');
    	
    }

    render() {
    	var data = this.state.pageDesigns;
    	console.log("all data ",data);
        return (
        			<div className="container-fluid">
							<div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
							<section className="content">
								<div className="row">
									<div className="addrol col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxtop">
											<div className="box selectBox col-lg-12 col-md-12 col-xs-12 col-sm-12">       	
												<div className="noPadLR col-lg-12 col-md-12 col-xs-12 col-sm-12">
												   	<div className="with-border box-header col-lg-12 col-md-12 col-xs-12 col-sm-12">
												        <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 txtCenter pdcls">
												            <h2 className="weighttitle ctext">Select Design</h2>
												        </div>
												    </div>		
												    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
					                					{
								                			data && data.length > 0 ?
								          		        				                                                  
										      				data.map((data, index)=>{
								                					return(
							                							<div key={index} className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
												                			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectDiv designList">
												                				<Link to={'/viewpage2/'+ data._id}>
												                				{/*<div  id={data._id} type="submit" onClick={this.selectDesign.bind(this)}>*/}{/*to={"/viewpage2"}*/}
												                					<img alt='' src={data.designImage} className="img-responsive"  />
													                				<div  className="row">
														                				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														                					<p className="mtop25 txtCenter ctext">{data.designName}</p>
														                					{/*<button  type="submit" className="col-lg-3 col-md-3 col-sm-6 col-xs-12 btn " onClick={this.selectDesign1.bind(this)}>Next</button>*/}
														                				</div>												                				
													                				</div>
													                			</Link>
												                			{/*</div>*/}
											                				</div>
												                		</div>	
								                					);
							                					})
							                				:
							                				null
								                		}				
								                					    
							                		</div>		                
												</div> 
											</div>		
								       	</div>
								 	</div>
								</div>
							</section>	
			</div>
            
        );
    }
}

export default Selectpagedesign;
