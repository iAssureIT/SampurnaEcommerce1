// import React, { Component,Suspense } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// import CmsBlock from "../createnewblock/Cmsblock.js"
// import {Route, withRouter} from 'react-router-dom';

// import '../css/selectpagedesign.css';

// class SelectBlockDesign extends Component {
   

//     constructor(props) {
//         super(props);
//         this.state={
//         	allData:[
//         			{
					    
// 					    "_id": 1,
// 					    "designName": "Block 1",
// 					    "designImage": "/images/block1.jpg",
// 					  }
//         	],
//         	ListOfBlocks:{},
//         	addedBlocks:[]

//     	}
//     }
// 	handleChange(event)
// 	{
// 		var attaribute_Value = event.target.getAttribute('data_id');
// 		// console.log("attaribute_Value",attaribute_Value);
// 		this.state.addedBlocks.push(attaribute_Value)


// 	}
// 	submitData(event){
// 		var AttachmentValues =this.state.addedBlocks;
// 		console.log("ids =",this.state.addedBlocks);
// 		axios
// 			.post('api/pages/patch/blocks/add/about-page',AttachmentValues)
// 		  	.then(function (response) {
// 		    // handle success
// 		    	console.log(response);
// 		  	})
// 		  	.catch(function (error) {
// 		    // handle error
// 		    	console.log(error);
// 		  	});


// 	}

// 	getAllBlockList(){
// 	axios
// 			.get('/api/blocks/get/list')
// 			.then((response)=>{
// 					        console.log("AllBlogs=",response.data);
// 					       /* var blocks = this.state.ListOfBlocks;
// 					        blocks.push(response.data);
// */					      	this.setState({
// 				      			ListOfBlocks:response.data
// 				      		},()=>{
// 				      			/*		console.log(this.state.ListOfBlocks);*/
// 				      		});
// 				      	})
// 		  	.catch(function (error) {
// 		    // handle error
// 		    	console.log(error);
// 		  	});
// }
// componentDidMount(){
// 	this.getAllBlockList();

// }
//     render() {
//     	var data = this.state.ListOfBlocks;
//     	console.log("data blocks in render",data);	
    	
//         return (
//         			<div className="container-flex">
// 							<section>
// 								<div className="row">
// 									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
// 										<div className="noPadLR  selectBox col-lg-12 col-md-12 col-xs-12 col-sm-12">
// 											<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadLR">

// 			                					<div className="panel panel-default">
// 												    <div className="panel-heading">
// 												        <h4 className="panel-title">
// 													        <a href="/viewpage2">Back</a>
// 													        <a className="pull-right" data-toggle="collapse" data-parent="#accordion" href="#collapse1">
// 													        + Create New Block</a>
// 												        </h4>
// 												    </div>
// 												    <div id="collapse1" className="panel-collapse collapse">
// 												      	<div className="panel-body">
// 												      		<CmsBlock/>
// 												        </div>
// 												    </div>
// 												</div>  
// 			                				</div>
// 						                		{
// 													this.state.ListOfBlocks && this.state.ListOfBlocks.length>0?
// 														this.state.ListOfBlocks.map((result, index)=>{
// 															// console.log(" block_id",result._id);
// 															var component = result.block_id.blockComponentName ? result.block_id.blockComponentName : 'Typecomponent1';
// 															console.log("component ===> > >",component);
// 															const NewPageComponent = React.lazy(() => import('../BlockTemplate/'+component+'/'+component+'.js'));
// 															console.log("NewPageComponent==>",NewPageComponent);
// 															var block_id=result._id;
// 															return(
// 										                			<div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectDiv1 designList">
// 										                				<div className="checkbox pull-right">
// 																	        <label><input type="checkbox" onChange={this.handleChange.bind(this)} data_id={block_id}/>Add</label>
// 																	    </div>
// 																		<Suspense fallback={<div>Loading...</div>} key={index}>
// 																    		<NewPageComponent block_id={block_id}/>
// 																    	</Suspense>
// 																    </div>	
// 													    	)
// 														})
// 													:
// 													null
// 												}	
// 												<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 						                            <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={() => this.submitData()} >Add Blocks</button>
// 						                        </div>			
// 										</div> 
// 							       	</div>
// 								</div>
// 							</section>	
// 			</div>
            
//         );
//     }
// }

// export default withRouter(SelectBlockDesign);

