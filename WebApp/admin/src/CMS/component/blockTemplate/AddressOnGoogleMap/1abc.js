import React, {Component} from 'react';
import axios              from 'axios';
import $                  from 'jquery';


import './AddressOnGoogleMap.css';


export default class AddressOnGoogleMap extends Component{

	constructor(props){
		super(props);
		this.state = {
            blocks:{
                "blockTitle"         : "<b>OUR</b> SPECIALITY",
                "blockSubTitle"      : "We are passionate about our work",
                "blockDescription"   : 'iAssureIT is an innovative IT company with energetic, talented and ambitious pool of 30+ Software Engineers, passionate about bringing the disruptive change in technology arena.<br/>We are the Change Makers.<br/>&nbsp;&nbsp;&nbsp;&nbsp;Our world class quality application development with latest cutting-edge technologies used for rapid development and blazing fast performance.A tremendous journey of 7 years started in 2011. We have developed over 150+ projects of small and large sizes. Our clientele is spread across the globe, from countries like USA, Europien Countries, South Africa, Gulf Region, Singapore and Australia.<br/>&nbsp;&nbsp;&nbsp;&nbsp;iAssureIT has customers from various industry domains that include Start ups too. Our clients are from industries like Financial Services, Healthcare, Manufacturing, Pharmaceuticals, Real Estate, Shipping and Logistics, Education, etc. We have been helping them to craft their organizational level digital road map.',
                "blockComponentName" : "",
                "blockType"          : "",
                "bgImage"            : "/images/1.png",
                "fgImage"            : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                "bgVideo"			 : "",
                "fgVideo"			 : "",
                "blockGroup"		 : "",
                "blockAppearOnPage"	 : ""
            },
            blockID  : "",
            block_id : ""
		};
    }

	componentDidMount(){
    	// console.log("==>",this.props.block_id);
        $("#mapouter").show();
            $("#mapouterxs").show();
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
                            if(error.message === "Request failed with status code 401"){
                                // swal("Your session is expired! Please login again.","", "error");
                            }
                        })
                }
                this.setState({
                    block_id:this.props.block_id
                });
	}

	render(){
		return(
			<div className="container-fluid gmapwrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center Glocationmap">
                    <h1 className="location">
                        <b>{this.state.blocks.blockTitle}</b>
                    </h1>
                </div>
				<div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 demogmap_canvas">
					<div className="mapouter" id="mapouter">
						<div className="gmap_canvas">
							<iframe width="100%" height="480" id="gmap_canvas" src="https://maps.google.com/maps?q=iAssureIT%20hadapsar&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
						</div>
					</div>
				</div>
            </div>
		);
	}
}