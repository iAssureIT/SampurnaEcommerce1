import React,{Component} from 'react';
import './Endlesspossibility.css';
import axios from 'axios';

export default class Endlesspossibility extends Component{

    constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "<b>ENDLESS </b> POSSIBILITIES",
            
            "blockSubTitle": "Mobile App Development",
            "blockDescription": "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/costadvantage.png",
            "fgImage": "/images/000001.png",
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
            <div className="endpossibwrapper">
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashboxwrapper">
                      <ul className="dashBox">
						  <li className="dash1"></li>
						  <li className="dash2"></li>
					      <li className="dash3"></li> 
				      </ul>
                    </div>
                </div>
   
                     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 endmainrow">
                        <div className="text-center">
                            <div className="h1titleless" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div >
                        </div>
                    </div> 
                     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 endlesscontentwrapper">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 enpsbcontent">
                            {/* <div className="headingtitle"> */}
                                {/* <div className="mobileappd"  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div> */}
                            {/* </div> */}
                            <div className="paragraphendpsb01"  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></div>
                              {/* <h3 className="enspsbrmrr">Read More </h3> <div className="arrowenspsb"><i className="fas fa-angle-double-right"></i></div>  */}
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 rightsideendpsbfw">
                            <img src={this.state.blocks.fgImage} alt="002" className="rightsideimgendpsw img-responsive"/>  
                         </div> 
                    </div> 
                </div>

            
        )
    }
}