import React from 'react';
import axios from 'axios';

import './Typecomponent2.css';

export default class Typecomponent2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockComponentName"  : "Typecomponent2",
        "blockType"          : "simple",
       "blockDescription" : "This is a Description. Some text goes here. You can replace the text as per your choice.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "fgImage": "/images/bgimage1.jpg",
      },
      blockID:"",
      block_id:""

    }; 
    
  }

componentDidMount(){
/*console.log("==>",this.props.block_id);*/
          {
             axios
                .get('http://iogapi.iassureit.com/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                    if(response.data){
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
    

    render(){
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 margin-top posRel">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 posRel onselecthover">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="col-lg-6 col-md-6 hidden-sm hidden-xs img1">
                 <img src={this.state.blocks.fgImage} alt="" className="img-responsive" hight="200"/>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                   {/*<h2 className="lightbluetext para-top">{this.state.blocks.blockTitle}</h2>*/}
                   <div>
                     <p className="righttextaboutus"  dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
                   </div>
                </div>
              </div>
            </div> 
           </div>   
        );
    }
}