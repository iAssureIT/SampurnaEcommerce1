import React, {Component, Suspense} 	from 'react';
import { render } 					from 'react-dom';

import "./css/designpattern1.css";





class DesignPattern1 extends Component{
	constructor(props){
		super(props);
		this.state = {
		};
	}
	
render(){
		var data= this.props.pageData;
		var componentName = data ? data.blocks : 'abc';
		var NewPageComponent;
		/*const NewPageComponent = React.lazy(() => import('/imports/CMS/BlockTemplates/'+componentName+'.jsx'));*/
		/*console.log("componentName =>",componentName);*/
		return( 
			<div className="pageHeight">
				<PageHead pageUrl={this.props.currentUrl}  />
				<div className="height1" style={{"backgroundImage":"url("+data.backimage+")"}}>
					<div>
						<p className="dp-pageTitle">{data.pageTitle}</p>
					</div>
					<div className="row inputrow">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group col-lg-12 col-md-6 col-xs-12 col-sm-12 dp-pageswscription">
                           		<label className="label-category page-Description">{data.cmspageDescription}</label>
                          	</div>
                        </div>
                     	<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 row">
                      		<div className="form-group">
                      			<img src={data.pageimage} className="img-responsive pageimage1"  />
                      		</div>
                    	</div>
			        </div>
				</div>
				
				<div className="col-lg-12 col-md-6">
					<button type="button" className=" col-lg-4 col-lg-offset-4 btn b1 success btn-lg" data-pageurl={this.props.pageUrl} data-toggle="modal" data-target="#myModal">Add new Block</button>
				  	{/*<!-- Modal -->*/}
				  	<div className="modal fade" id="myModal" role="dialog">
				    	<div className="modal-dialog">
				      	{/*<!-- Modal content-->*/}
				      		<div className="modal-content">
					      		<div className="modal-body">    
					      			<SelectBlockDesign/>
							    </div>
						        <div className="modal-footer">
						          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						        </div>
				      		</div>
				    	</div>
				  	</div>
				</div>
			</div>
		);
	}
}
/*
export default withTracker( props => {
		
			var designPattern1;
			var cmsData = Meteor.subscribe('DesignPattern1');
			const loading 	 = !cmsData.ready();
			const pageData = cmsPageMaster.findOne({"componentName":"DesignPattern1"});
			/*console.log("====> ",pageData);*/
			/*if(pageData){
				console.log('pageData= Component>',pageData[0].blocks[0].componentName);
			}
			
	    return {
	    		'pageData':pageData,	        
	    };
})(DesignPattern1);		
*/