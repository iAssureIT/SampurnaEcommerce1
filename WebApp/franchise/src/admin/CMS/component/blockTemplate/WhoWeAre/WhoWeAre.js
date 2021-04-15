import React from 'react';
import "./WhoWeAre.css";
import axios from 'axios';

export default class WhoWeAre extends React.Component {

    constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockTitle": "Who<b> We Are?</b>",
        "blockSubTitle": "We are passionate about our work",
        "blockDescription": 'iAssureIT is an innovative IT company with energetic, talented and ambitious pool of 30+ Software Engineers, passionate about bringing the disruptive change in technology arena.<br/>We are the Change Makers.<br/>&nbsp;&nbsp;&nbsp;&nbsp;Our world class quality application development with latest cutting-edge technologies used for rapid development and blazing fast performance.A tremendous journey of 7 years started in 2011. We have developed over 150+ projects of small and large sizes. Our clientele is spread across the globe, from countries like USA, Europien Countries, South Africa, Gulf Region, Singapore and Australia.<br/>&nbsp;&nbsp;&nbsp;&nbsp;iAssureIT has customers from various industry domains that include Start ups too. Our clients are from industries like Financial Services, Healthcare, Manufacturing, Pharmaceuticals, Real Estate, Shipping and Logistics, Education, etc. We have been helping them to craft their organizational level digital road map.',
        "blockComponentName": "",
        "blockType": "",
        "bgImage": "/images/1.png",
        "fgImage": "/images/37.png",
        "repeatedBlocks": [
        					{ 
        						Title: "Sample 1", 
        						SubTitle: "", 
        						Link: "", 
        						Image: "/images/4.png",
        						Description: ""
        					},
        					{ 
        						Title: "Sample 2", 
        						SubTitle: "", 
        						Link: "", 
        						Image: "/images/4.png",
        						Description: ""
        					},
        					{ 
        						Title: "Sample 3", 
        						SubTitle: "", 
        						Link: "", 
        						Image: "/images/4.png",
        						Description: ""
        					},
        					{ 
        						Title: "Sample 4", 
        						SubTitle: "", 
        						Image: "/images/4.png",
        						Link: "", 
        						Description: ""
        					},
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
      block_id:""
    }; 

    
  }
componentDidMount(){
/*console.log("==>",this.props.block_id);*/
          {
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
                    if(error.message === "Request failed with status code 401")
                      {
                          // swal("Your session is expired! Please login again.","", "error");
                      }
              })
            }
      this.setState({
                block_id:this.props.block_id
              });
}
	render() {
		return (
			<div className="container-fluid nopadding">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xl-12 wwrapper container-fluid hidden-sm hidden-xs nopadding">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xl-12 wwBox2">
						<div className="col-lg-6 col-md-6 col-sm-6 col-xl-6">
							<div className="winfotext1 col-lg-10 col-md-10 col-sm-10 col-xl-10 pull-right">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xl-12 ">
									<ul className="dashBoxWwA col-lg-4	">
									  <li className="dash1WwA"></li>
									  <li className="dash2WwA"></li>
									  <li className="dash3WwA"></li>
									</ul>
								</div>
								<h1 className="wheadingb1" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockTitle } }></h1>
								<p className="wpara1" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
								{/*<h5  className="wrdmore"><span><u> Read More</u></span> >> </h5>*/}
							</div>
						</div>
						<div className="col-lg-6 col-md-6 col-sm-6 col-xl-6 ">
							<img className="winfoImg1 img-responsive" src="./images/38.png" alt="Bannerpng"/>
						</div>
					</div>
				</div>	

				{/*====================================================================================*/
				/*====================================================================================*/
				/*============================== Mobile View =========================================*/
				/*====================================================================================*/
				/*====================================================================================*/}
				
				<div className="col-xs-12 col-sm-12 wwrapperxs container-fluid hidden-lg hidden-md nopadding">
					<div className="col-xs-12 col-sm-12 wwBox2xs">
						<div className="col-xs-12  col-sm-12">
							<div className="winfotext1xs col-sm-12 col-xs-12">
								<div className="col-sm-12 col-xs-12 ">
									<ul className="dashBoxWwAxs col-xs-6 col-xs-offset-4 col-sm-6 col-sm-offset-5">
									  <li className="dash1WwAxs"></li>
									  <li className="dash2WwAxs"></li>
									  <li className="dash3WwAxs"></li>
									</ul>
								</div>
								<h1 className="wheadingb1xs" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockTitle } }></h1>
								<p className="wpara1" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
								<h5  className="wrdmorexs"><span><u> Read More</u></span> >> </h5>

							</div>

						</div>
						<div className="col-sm-12 col-xs-12">
							<img className="winfoImg1xs img-responsive col-sm-offset-3" src="./images/38.png" alt="Bannerpng"/>

						</div>

					</div>
					
				</div>
			</div>
		);
	}
}
