import React from 'react';
import axios from 'axios';
import "./StaffBanner.module.css";

export default class StaffBanner extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
          blocks: {
		      	"blockTitle": "RESOURCE OUTSOURCING",
		      	"blockSubTitle": "We are passionate about our work",
	            "blockDescription": "Experienced, Qualified & Team-Driven developers & Team-Leads at feasible cost",
	            "blockComponentName": "TemplateOverview",
	            "blockType": "",
	            "bgImage": "/images/contactbanner.png",
	            "fgImage": "/images/Graphic4.png",
	            "repeatedBlocks": [
	                                
	                                { 
	                                    Title: "Sample 5", 
	                                    SubTitle: "", 
	                                    Image: "/images/4.png",
	                                    Link: "", 
	                                    Description: ""
	                                }
	            ],
	            "bgVideo"				: "",
	            "fgVideo"				: "",
	            "blockGroup"			: "",
	            "blockAppearOnPage"		: ""
          },
          blockID:"",
          fgImage1:"/images/StaffAgum2.png",
          block_id:""
        };   
    }
    handleChange(){

    }
    handleSubmit(){

    }
    componentDidMount(){
    /*console.log("==>",this.props.block_id);*/
             if(this.props.block_id){
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                            // console.log("ListofServices =",response.data);
                          this.setState({
                              blocks:response.data
                          });
                        }                  
                      })           
                    .catch(function(error){
                      console.log(error);
                  })
                }
            this.setState({
                    block_id:this.props.block_id
            });
    }


	render() {
		return (
			<div className="">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >				   
					<div className="StaffBannerwrapp" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
							<div className="col-lg-9 col-lg-offset-3  col-md-9 col-md-offset-3 col-sm-12 col-xs-12 ">
								<img src={this.state.blocks.fgImage} className="TopBannerIMGUS img-responsive"></img>
						    	<b><h1 className="h1TitleSB clrwht" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1></b>
						    	<h3 className=" clrwht" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></h3><br/>
							</div>
						</div>
						
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
							<div className="col-lg-6 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12 nopadding ReqForm">
								<img src={this.state.fgImage1} className="BannerIMGUSBrand img-responsive"></img>

								<form>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								   		<h3 className="text-center">Request a free quote</h3>
								   		<h6 className="text-center">Guaranteed response within one business day!</h6>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop10">
										    <div className="form-group">
								        		<input 
								        			type="text" 
								        			ref="repetedLink" 
								        			id="repetedLink" 
								        			value={this.state.repetedLink} 
								        			name="repetedLink"
								        			placeholder="Name"  
								        			className="InputBoxCustom col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" 
								        			onChange={this.handleChange.bind(this)}
								        			/>
										    </div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop10">
										    <div className="form-group">
								        		<input 
								        			type="text" 
								        			ref="repetedLink" 
								        			id="repetedLink" 
								        			value={this.state.repetedLink} 
								        			name="repetedLink"
								        			placeholder="Mobile"  
								        			className="InputBoxCustom col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" 
								        			onChange={this.handleChange.bind(this)}
								        			/>
										    </div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop10">
										    <div className="form-group">
								        		<input 
								        			type="text" 
								        			ref="repetedLink" 
								        			id="repetedLink" 
								        			value={this.state.repetedLink} 
								        			name="repetedLink"
								        			placeholder="Email"  
								        			className="InputBoxCustom col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" 
								        			onChange={this.handleChange.bind(this)}
								        			/>
										    </div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop10">
										    <div className="form-group">
								        		<textarea  className="form-control"rows="3" cols="50" name="message" placeholder="Message"
					                                 defaultValue ={this.state.message}
					                                 onChange    = {this.handleChange.bind(this)}
					                             />
										    </div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
											<button className="btn btn-primary col-lg-6 col-lg-offset-3 marginLeft23" onClick={this.handleSubmit.bind(this)}>Submit</button>
										</div>
									</div>
								</form>
							</div>
						</div>

					</div>
			   </div> 
			</div>
		);
	}
}
					