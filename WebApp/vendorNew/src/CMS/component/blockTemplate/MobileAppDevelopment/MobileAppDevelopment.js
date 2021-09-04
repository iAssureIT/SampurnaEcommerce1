import React,{Component}from 'react'
import "./MobileAppDevelopment.css";
import axios from 'axios';


export default class MobileAppDevelopment extends Component{

	constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockTitle": "<b>MOBILE APP </b> DEVELOPMENT",
        
        "blockSubTitle": " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including.",
        "blockDescription": "",
        "blockComponentName": "TemplateOverview",
        "blockType": "",
        "bgImage": "",
        "fgImage": "https://unimandai.s3.amazonaws.com/CMS/mobileappdev_20201016145113.png",
        "repeatedBlocks": [
                            
                            { 
                                Title: "User Friendly", 
                                SubTitle: "", 
                                Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                Link: "", 
                                Description: ""
                            },
                            { 
                              Title: " Performance", 
                              SubTitle: "", 
                              Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                              Link: "", 
                              Description: ""
                          },
                          { 
                            Title: " Attractive UI", 
                            SubTitle: "", 
                            Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                            Link: "", 
                            Description: ""
                        },
                        { 
                          Title: " Business value", 
                          SubTitle: "", 
                          Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
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
              })
            }
      this.setState({
                block_id:this.props.block_id
              });
}



    render(){
        return(
            <div className="Mappdevwrapp col-lg-12">
                 <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 mobileboxwrapp">
                     <ul className="MobileBox">
                       <li className="Mdash01"></li>
                       <li className="Mdash02"></li>
                       <li className="Mdash03"></li> 
                    </ul>
                </div> 
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mappdevtitlewrapp">
                    <div className="text-center">
                        <div className="h1mtitletext"dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                    </div>
                </div> 
                 <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 subtitlewrapp">
                    <p className="mh2subtitletext" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></p>
                </div> 
                <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 devimagewrapp">
                    <img src={this.state.blocks.fgImage} alt="mobileappdev " className="img-responsive" />

                </div> 
                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 reptedblockwrapp">
                     {
                          
                          this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length>0
                          ?
                          this.state.blocks.repeatedBlocks.map((data,index)=>{
                            return(
                                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 mobileimg1" key={index}>
                                    
                                       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mobileimg2"> 
                                         <img src={data.Image} alt="userfriendly" className="img-responsive" />
                                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="text-center">
                                                <h1 className="mh1titletext" dangerouslySetInnerHTML={{ __html: data.Title } }></h1>
                                             </div>
                                          </div>
                                       </div> 
                                
                                </div>
                      )

                    })
                    :
                    null
                    
                  }
                     
                    
                </div>  


            </div>
        )
    }
}