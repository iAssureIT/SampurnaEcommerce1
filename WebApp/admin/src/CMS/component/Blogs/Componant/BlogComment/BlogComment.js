import React from 'react';
import './BlogComment.css';

export default class BlogComment extends React.Component {
	constructor(props) {
		super(props);
		    this.state={
      "userName"      	: "",
      "companyName"   	: "",
      "email"   		: "",
      "message"     	: "",
      "comment"			:[
      						{
      							/*date:"May 29, 2015, 5:33 pm",*/
      							userName:"Joan Doe",
      							comment:"I think the problem for me is the energistically benchmark focused growth strategies via superior supply chains. Compellingly reintermediate mission-critical potentialities whereas cross functional scenarios. Phosfluorescently re-engineer distributed processes without standardized supply chains. Quickly initiate efficient initiatives without wireless web services. Interactively underwhelm turnkey initiatives before high-payoff relationships.",
      							/*userImg:"https://wealthyvia.s3.ap-south-1.amazonaws.com/website/user.png"*/
     					    },
     					    {
      							/*date:"May 29, 2015",*/
      							userName:"Jennifer Freeman",
      							comment:"Very good point which I had quickly initiate efficient initiatives without wireless web services. Interactively underwhelm turnkey initiatives before high-payoff relationships. Holisticly restore superior interfaces before flexible technology. Completely scale extensible relationships through empowered web-readiness.",
      							/*userImg:"https://wealthyvia.s3.ap-south-1.amazonaws.com/website/user1.png"*/
     					    },
     					   
     					  ]

      };
	}
  handleChange(event){
      event.preventDefault();
      this.setState({
        "userName"         : this.refs.userName.value,
        "email"            : this.refs.email.value,
        "message"          : this.refs.message.value,
         /*[event.target.name]:event.target.value*/
      });
  }
  submitcomment(event){
    event.preventDefault();
    console.log("in comment");
    var formValues = {
      name        : this.state.userName,
      email       : this.state.email,
      comment     : this.state.message,
         
    };
    this.setState({
           comment:{
                    userName   : this.state.userName,
                    email      : this.state.email,
                    comment    : this.state.message,
                       
                  }
            
          })

    console.log("in comment formValues",formValues);
      this.setState({
            userName : "",
            email: "",
            message : "",
            
          })
  }
	render() {
	/*	var data = this.state.comment;
    console.log("datadata",data);*/
		return (
			<div>
				{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
            <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12">
            	<hr/>
            		<h6 className="" style={{marginBottom:"27px",marginTop:"25px",paddingLeft:"25px"}}><b>COMMENTS</b></h6>
            	<hr/>
            	{
            		data && data.length > 0 ?
      				data.map((data, index)=>{
                console.log("RENDER",data);

              		return(<div>
										<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding">
											<img className="img-responsive userImgB" src="https://wealthyvia.s3.ap-south-1.amazonaws.com/website/user.png" alt="Bannerpng"/>
										</div>
										<div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 NOpadding">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
												<div className="row">
													<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 ">
														<h5><b>{data.userName}</b></h5>
														<h6 className="graycolor">{data.date}</h6>
													</div>
													<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
														<h6 className="pull-right"><a href="#">REPLAY</a></h6>
													</div>
													</div>
												<p className="graycolor">{data.comment}</p>

											</div>

										</div>
									</div>
									);
          					})
          				:
          				null
            		}
            </div>
				</div>*/}

				<form id="contactForm" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
            <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12">
              <div className="formcontent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="">
                </div>
              </div>
              <div className="commentBox col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label htmlFor="comment">Add Comment<span className="redFont"></span></label>
                <textarea className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="5" id="comment" name="message" ref="message"  value={this.state.message} onChange={this.handleChange.bind(this)}></textarea>
              </div>
              <div className="formcontent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label htmlFor="userName">Name<span className="redFont">*</span></label>
                <div className="">
                  <input className="form-control nameSpaceUpper col-lg-12 col-md-12 col-sm-12 col-xs-12" id="userName" type="text" name="userName"  ref="userName" value={this.state.userName} onChange={this.handleChange.bind(this)}	 placeholder=""/>
                </div>
              </div>
              <div className="formcontent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label htmlFor="email">Email<span className="redFont">*</span></label>
                <div className="">
                  <input className="form-control" id="email" type="text" name="email" ref="email"  value={this.state.email} placeholder="" onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
              <div className="formcontent col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <button className="btn lightbluebg commentBoxbtn buttonhover" onClick={this.submitcomment.bind(this)} >Post Comment</button>
              </div>
            </div>
        </form>
        
			</div>
		);
	}
}
