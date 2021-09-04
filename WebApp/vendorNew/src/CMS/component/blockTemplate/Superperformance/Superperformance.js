import React,{Component} from  'react';
import './Superperformance.css';
import axios from 'axios';

export default class SuperPerformance extends Component{

    constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "<b>SUPER</b> PERFORMANCE",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/costadvantage.png",
            "fgImage": "/images/ecom5.png",
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
            <div className="sperwrapper">
                <div className="supbgwrapper" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                     <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashwrapp">
                        <ul className="dashBox1">
                            <li className="dash01"></li>
                            <li className="dash02"></li>
                            <li className="dash03"></li> 
                        </ul>
                    </div> 
                 </div> 
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 titlewrapper1">
                        <div className=" text-center">
                            <div className="h1title00" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                        </div>
                   </div>
                   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 maincontentwrapper"> 
                         <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 contentframework">
                            <p className="hdescription"  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>

                             {/* <h3 className="ftracermore">Read More </h3> <div className="arrow"><i className="fas fa-angle-double-right"></i></div> */}
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 imageframework ">
                            <img src={this.state.blocks.fgImage} alt="001" className="sideimageftrack img-responsive"/>  
                          </div>
                         </div>
                         

                
                </div>



            </div>
        )
    }
}