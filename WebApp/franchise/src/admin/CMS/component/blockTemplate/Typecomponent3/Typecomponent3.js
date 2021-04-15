import React from 'react';
import './Typecomponent3.css';
import axios from 'axios';


export default class Typecomponent3 extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      blocks:{
        "blockTitle"      : "About US right",
        "blockSubTitle"   : "",
        "blockDescription"  : ".Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "blockComponentName"  : "Typecomponent3",
        "blockType"       : "simple",
        "repeatedBlocks"    : [
                      {
                        "Title"     : "Geology &amp; Geophysics",
                          "SubTitle"    : "iOG understands the various paradigms",
                          "Description" : "iOG understands the various paradigms of the sub-surface ecosystem and its complexity. The domain knowledge and expertise in multiple discipline enables it to understand, interpreted and model the subsurface.",
                          "Image"     : "/images/Icon_1.png",
                          "Link"      : "/iogstudy"
                      },
                      {
                        "Title"     : "Geology",
                          "SubTitle"    : "iOG understands the various paradigms",
                          "Description" : "iOG understands the various paradigms of the sub-surface ecosystem and its complexity. The domain knowledge and expertise in multiple discipline enables it to understand, interpreted and model the subsurface.",
                          "Image"     : "/images/Icon_2.png",
                          "Link"      : "/iogimplement"
                      },
                      {
                         "Title"     : "Geology &amp; Geophysics",
                          "SubTitle"    : "iOG understands the various paradigms",
                          "Description" : "iOG understands the various paradigms of the sub-surface ecosystem and its complexity. The domain knowledge and expertise in multiple discipline enables it to understand, interpreted and model the subsurface.",
                          "Image"     : "/images/Icon_1.png",
                          "Link"      : "/iogtrain"
                      },
                      {
                        "Title"     : "Geology",
                          "SubTitle"    : "iOG understands the various paradigms",
                          "Description" : "iOG understands the various paradigms of the sub-surface ecosystem and its complexity. The domain knowledge and expertise in multiple discipline enables it to understand, interpreted and model the subsurface.",
                          "Image"     : "/images/Icon_2.png",
                          "Link"      : "/iogstudy"
                      }

        ],
        "bgImage"       : "",
        "bgVideo"       : "",
        "fgImage"       : "",
        "fgVideo"       : ""

      },
      blockID:"",
      block_id:""

    };    
  }
componentDidMount(){
// console.log("==>",this.props.block_id);
          {
             axios
                .get('http://iogapi.iassureit.com/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                /*var blocks = this.state.blocks;
                blocks.push(response.data);*/
                this.setState({
                  blocks:response.data
                  });
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
      // console.log("------------>",this.state.blocks.repeatedBlocks);
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 posRel">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-11 col-md-12 col-sm-12 col-xs-12"><div className="line2 col-lg-2 col-md-2 col-sm-2 col-xs-2 col-lg-offset-6"></div></div>
                    <h2 className="lightbluetext text-center para1-top">{this.state.blocks.blockTitle}
                    </h2>
                        
                    <div>
                     <p className="col-lg-offset-2 col-lg-10 col-md-10 col-sm-12 col-xs-12 type3text" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
                    </div>

                </div>
                  <div  className="col-lg-12 blk_ht">
                  { 
                    this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length>0?
                        this.state.blocks.repeatedBlocks.map((result, index)=>{
                          return(
                            <a href={result.Link} key={index}>
                              <div className="col-lg-3  col-md-3 col-sm-12 col-xs-12">
                                <div className="RB_block repeated_block1height ">
                                  <div className="RBicon1">
                                    <img src={result.Image} alt="" className="rbicn_1" />
                                  {/*<img src="/images/11.png" alt="" className="icn1_hover"  />*/}
                                  </div>
                                   <p className="lightbluetext rb-para-top">{result.Title}</p>

                                  {/*<p className="iog_txt" dangerouslySetInnerHTML={ { __html: result.Description } }></p>*/}
                                </div>
                              </div>
                            </a>
                        )
                     })
                    : null
                  }
                  </div>
            </div>

        );
    }
}