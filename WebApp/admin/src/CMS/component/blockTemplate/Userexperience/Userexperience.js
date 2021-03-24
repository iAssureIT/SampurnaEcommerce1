import React,{Component}from 'react';
import './Userexperience.css';
import axios from 'axios';

export default class Userexperience extends Component{

    constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "RICH USER <b>EXPERIENCE</b>",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/ecom4.png",
            "fgImage": "/images/ecom14.png",
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
            <div className="uexperiencewrapp">
                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 boxspace">
                    <ul className="dashmtechnology">
						  <li className="dash1mtechnology"></li>
						 <li className="dash2mtechnology"></li>
						<li className="dash3mtechnology"></li> 
					</ul>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtelogytextwrapper">
                    <div className="text-center">
                        <div className="h1title00mm" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                     </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgwrapper">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mtechlogywrapp">
                    <p className="paragraphmtech01"  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}>
                    </p>
                     <h3 className="mtechracermore">Read More </h3> <div className="arrowmtech"><i className="fas fa-angle-double-right"></i></div>
                </div> 
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 imageframemtechlogy ">
                   <img src={this.state.blocks.fgImage} alt="001" className="sideimagemtechlogy img-responsive"/>  
                 </div> 
             </div>
                
            </div>
        )
    }
}