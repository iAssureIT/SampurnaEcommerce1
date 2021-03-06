import React,{Component}from 'react';
import './CreateOnlineStore.css';
import axios from 'axios';


export default class CreateOnlineStore extends Component{

    constructor(props) {
        super(props);
        this.state = {
            "fgImage1": "https://unimandai.s3.amazonaws.com/CMS/ecom9.png",

          blocks: {
            "blockTitle": "CREATE ONLINE <b>STORE </b>",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the. ",    
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "https://unimandai.s3.amazonaws.com/CMS/ecom7_20201015192033.png",
            "fgImage": "https://unimandai.s3.amazonaws.com/CMS/ecom8_20201015192054.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "Sample 5", 
                                    SubTitle: "", 
                                    Image: "",
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
            <div className="conlinewrapp">
                <div className="createonlinebgimg" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgwrappstore">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 Imgwrapp00">
                         <img src={this.state.blocks.fgImage} className="ecomimgright"></img>
                       </div>

                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 onlinedashwrapp"> 
                            
                            <ul className="dashBox04">
                                <li className="dash01onstore"></li>
                                <li className="dash02onstore"></li>
                                <li className="dash03onstore"></li> 
                            </ul>  
                             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 onlimnewrapp">
                            <div className="text-center">
                                <div className="onlineh1title00" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <p className="onlineh1title01" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                        </div>
                     </div> 

                     <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 Imgwrapp000">
                     <img src={this.state.fgImage1} className="ecomimgleft img-responsive"></img>


                     </div>
                       
                    

                  </div>

             </div>
             </div>
)    
}

} 
                

               