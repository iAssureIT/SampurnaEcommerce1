import React,{Component}from 'react'
import "./TechnologyStacksWebAppDev.css";
import axios from 'axios';


export default class TechnologyStacksWebAppDev extends Component{

	constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockTitle": "TECHNOLOGY STACKS",
        "blockTitle1": "Node JS Web App ",
        
        "blockSubTitle": " With the in-depth expertise gain from several successfull applications deployments, iAssureIT works directly with customers to overcome to day's challenges, combining the right technologies and skill sets.",
        "blockDescription": "Lorem Ipsum is simply dummy text of the printing and typesetting industry,Lorem Ipsum is simply dummy text of the printing and typesetting industry,Lorem Ipsum is simply dummy text of the printing and typesetting industry,<br/><br/>Lorem Ipsum is simply dummy text of the printing and typesetting industry,Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        "blockComponentName": "TemplateOverview",
        "blockType": "",
        "bgImage": "/images/nodejs.png",
        "fgImage": "/images/TechnologyStack.png",
        "fg1Image": "/images/nodejs.png",
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
            <div className="TstackWebwrapp col-lg-12">
                 <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 Tstackboxwrapp">
                     <ul className="TstackBox">
                       <li className="Tdash01"></li>
                       <li className="Tdash02"></li>
                       <li className="Tdash03"></li> 
                    </ul>
                </div> 
            
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Tstackdevtitlewrapp">
                    <div className="text-center">
                        <div className="h1mtitletext"dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                    </div>
                </div> 

                 <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 TstackSubtitlewrapp">
                    <p className="Tstacksubtitletext" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></p>
                </div> 

                
                <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 TstackContentwrapper"> 
                     <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 rightsideTstack">
                        <img src={this.state.blocks.fgImage} alt="002" className="rightsideimgTstack img-responsive"/>  
                    </div> 

                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 Tstackcontent"> 
                  
                        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 TstackTitleWrapper2">
                              <div className="Tstackimage2"><img src={this.state.blocks.bgImage} alt="Nodejs Image" className=" img-responsive"/></div>
                              <div className="TstackTitle2" dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks.Title}}></div>
                        </div> */}

                        <div className="paragraphTstack01"  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></div> 
                        
                    </div> 
                    
                </div>  
         </div>     
        )
    }
}