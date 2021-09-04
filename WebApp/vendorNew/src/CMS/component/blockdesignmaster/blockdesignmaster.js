import React, { Component } from 'react';
import axios from 'axios';
import S3FileUpload from 'react-s3';

const config = {
        
    }

class BlockDesignMaster extends Component {
    static propTypes = {
       

    };

    constructor(props) {
        super(props);
        this.state={
        	uploadedImage 	: [],
        	
        	imgPath			    : "",
        	"designName"	    : '',
			"designImage" 		: '',
			"componentName"		: '',
			
        }
    }

    handleChange(event){
    	event.preventDefault();
	  	const target = event.target;
	  	const name   = target.name;
	  	this.setState({
	  		[name]           : event.target.value,
		  	"componentName"  : this.refs.componentName.value,
		  	
		});

    }
    submitDesign(event){
    	event.preventDefault();
    	var formValues =  {
				designName 		: this.refs.designName.value,
				componentName   : this.refs.componentName.value,
				imgPath         : this.state.imgPath,
			
				
			}		
			axios
			.post('/api/blockDesignmaster',{ formValues })
		  	.then(function (response) {
		    // handle success
		    	console.log(response);
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});

   		console.log("AttachmentValues =>",formValues);
			

    }
	uploadDesignImg(e){
	    	console.log("upload =",e.target.files[0]);
	    this.setState({
	      uploadedImage: e.target.files[0]
	    },()=>{
	    	console.log("uploadToS3 =",this.state.uploadedImage);
	    	 S3FileUpload
	        .uploadFile(this.state.uploadedImage, config)
	        .then((Data)=>{
	           	console.log(Data);
	           	console.log("===>",Data.location);
		        this.setState({
		        	imgPath:Data.location
		        })
	      })
	      .catch((error)=>{
	        console.log(error);
	      })
	    })

    }

    render() {
    	console.log("th",this.state.imgPath);
        return (
        		<div>
        			<div className="content-wrapper">
							<div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
								<section className="content">
									<div className="row box-body">
										<div className="addrol col-lg-12 col-md-12 col-xs-12 col-sm-12">
											<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxtop">
					                           <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">       	
									            <div className="noPadLR col-lg-12 col-md-12 col-xs-12 col-sm-12">
									               	<div className="with-border box-header col-lg-12 col-md-12 col-xs-12 col-sm-12">
									                    <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 pdcls">
									                         <h4 className="weighttitle ctext">Block Design Master</h4>
									                    </div> 
									                    <div className="col-lg-3 col-md-3 col-sm-3 col-sm-4	noPadding">

									                       {/*<div id="flip" className="addexamform clickforhideshow"  onClick={this.showBtn.bind(this)}>
									                    		Add New Design
									                    	</div> */}
									                    	                      
									                	</div>                                   
									                </div>
									                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									                	<form id="DesignSettingForm" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop17 boxhideshow">
									                		<div className="row">
						                                		<div className="col-lg-6 col-md-6 col-xs-12 col-sm-6 form-group noPadLR marginTop17">
										                			<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Component Name <span className="redFont fa"></span></label>
										                			<input  onChange={this.handleChange.bind(this)} type="text" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 form-control" ref="componentName" id="componentName" name="componentName" value={this.state.componentName}/>
										                		</div>
										                		<div className="col-lg-3 col-md-3 col-xs-12  col-sm-2 marginTop17 ">
							                                		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
							                                			<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row" >Block Image Upload</label>
							                                		</div>
							                                		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
									                                		{/*<label htmlFor="designImg" className="designLabel col-lg-12 col-md-12 col-sm-12 col-xs-12 row">Upload</label>*/}
									                                		<input type="file" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding row" title="Please choose image" id="designImg" onChange={this.uploadDesignImg.bind(this)} />
							                                		</div>
							                                	</div>
							                                	<div className="col-lg-3 col-md-3 col-xs-12  col-sm-2 marginTop17 ">
							                                		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
							                                		{ this.state.imgPath!=="" ? 
							                                			<img alt="selected design" src={this.state.imgPath} width="150" height="100"/>
							                                			: <div> </div>
							                                		}
							                                		</div>
							                                		
							                                	</div>
										                		
									                		</div>
									                		<div className="row">
										                		<div className="col-lg-6 col-md-6 col-xs-12 col-sm-6 form-group noPadLR marginTop17">
										                			<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left row">Block Design Name <span className="redFont fa"></span></label>
										                			<input  onChange={this.handleChange.bind(this)} value={this.state.designName} type="text" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 form-control" ref="designName" id="designName" name="designName" />
										                		</div>
										                		
						                                	</div>
									                		<div className="col-lg-2 col-lg-offset-10 col-md-2 col-md-offset-10 col-xs-12 col-sm-12 form-group btnnone">
										                		<input type="submit" value="Submit" onClick={this.submitDesign.bind(this)} className=" btn btnSubmit btn-primary form-control"/>	
									                		</div>
									                	</form>
									                </div>
									              
									            </div> 
									           </div>
									       	</div>
									 	</div>
									</div>
								</section>
							</div>
        		</div>
            
        );
    }
}

export default BlockDesignMaster;
