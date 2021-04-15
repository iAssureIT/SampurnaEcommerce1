import React, { Component } from 'react';
import S3FileUpload from 'react-s3';

const config = {
      
      }
         

class Awsfile extends Component {
  constructor(props) {
    super();
    this.state={
      uploadedImage : [],
      imgPath: "",
    }
  }
  upload(e){
    console.log("upload =",e.target.files[0]);
    this.setState({
      uploadedImage: e.target.files[0]
    },()=>{
    	console.log("uploadToS3 =",this.state.uploadedImage);
    	 S3FileUpload
      .uploadFile(this.state.uploadedImage, config)
      .then((Data)=>{
        console.log(Data);
        console.log("===>",Data.location);
        this.setState({
        	imgPath:Data.location
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    })
  }
  render(){

    return(
        <div className="col-lg-12 App-header">
	        <h3>Upload File</h3>
	        <input type="file" onChange={this.upload.bind(this)}/>
	        <div> 
	        	<img alt="selected design" src={this.state.imgPath ? this.state.imgPath : null} width="150" height="100"/>
	        </div>	
        </div>
    );
  }
}
export default Awsfile;