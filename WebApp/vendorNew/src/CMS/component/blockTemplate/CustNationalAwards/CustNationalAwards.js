import React from 'react';

import axios from 'axios';
import './CustNationalAwards.css';


export default class CustNationalAwards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockTitle": "<b>NATIONAL</b> AWARDS",
        
        "blockSubTitle": "The Company Of The Year 2018",
        "blockDescription": "",
        "blockComponentName": "TemplateOverview",
        "blockType": "",
        "bgImage": "/images/NationalAwads1.png",
        "fgImage": "/images/00.png",
        "repeatedBlocks": [
                            
                              {
                                 Title :"Lorem ipsum",
                                 Description :" ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                                 Image :"/images/NationalAwads3.png",
                              },
                              {
                                Title :"Lorem ipsum",
                                Description :"or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                                Image :"/images/NationalAwads4.png",
                            },
                             {
                               Title :"Lorem ipsum",
                               Description :" ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                               Image :"/images/NationalAwads5.png",
                            },
                            {
                              Title :"Lorem ipsum",
                              Description :"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                              Image :"/images/NationalAwads6.png",
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
              })
            }
      this.setState({
                block_id:this.props.block_id
              });
}
displayDetails(event){

}
render(){
    return(
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="CustNawardswrapp" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
	                 <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 BoxAwardStart">
	                    <ul className="dashBox">
	                        <li className="dash1"></li>
	                        <li className="dash2"></li>
	                        <li className="dash3"></li> 
	                    </ul>
	                </div> 
	            </div>
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NAh1title">
	                <div className=" text-center">
	                    <h1 className="" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1>
	                </div>
	            </div>  
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 narionalawardwrapp">  
	                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 awardleftwrapp">
	                   <img src="/images/NationalAwads32.png" alt="awardn" className="RightImageAward img-responsive"/>
	                </div>  
	                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NATextwrapp1"> 
	                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NAtextwrapp1"> 
	                     	<div ></div> 
	                     		<div className="row"> 
	                       			<div className="col-lg-12 col-lg-md-12 col-sm-12 col-xs-12 tabwrap">
	                        			<div className="tab-content">
				                          	{
				                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
				                            ?
				                              this.state.blocks.repeatedBlocks.map((data, index)=>{
				                              return(
				                                  <div key={"key1-"+index} id={"tab-"+index} className={"tab-pane fade in " + (index===0 ? "active" : "")}>
				                                    <h2 className="NAhetitle" dangerouslySetInnerHTML={{ __html: data.Title } }></h2>
				                                    <h3 className="NAhetitle" dangerouslySetInnerHTML={{ __html: data.Description } }></h3>
				                                  </div>
				                                );
				                              })
				                            :
				                              null
				                          	}
				                        </div>

				                        <ul className="nav nav-pills">
				                          {
				                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
				                            ?
				                              this.state.blocks.repeatedBlocks.map((data, index)=>{
				                              return(
				                                  <li className={"bgcolorhide bgImgonclick "+(index===0 ? "active" : "")} key={index}>
				                                    <a href={"#tab-"+index} data-toggle="pill" className="">
				                                      <img src={data.Image} alt="award" className="CustAwImage img-responsive"/>
				                                    </a>
				                                  </li>
				                                );                                    
				                              })
				                            :
				                              null
				                          }
				                        </ul>

	                   				</div>        
	              				</div> 
	            			<div> 
	        			</div> 
	    			</div> 
				</div> 
			</div>  
		</div>
	</div>
    )
	}

}