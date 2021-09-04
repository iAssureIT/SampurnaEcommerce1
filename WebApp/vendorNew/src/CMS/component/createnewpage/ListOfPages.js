import React from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import './Createnewpage.css';

export default class ListOfPages extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			UrlId 				:  "",
			
			"pageUrl"			: "",
			"pageTitle"			: "",
			"pageType"			: "",
			"componentName"		: "",

			"designPattern"		: "",
			"pageHeadKeyWords"	: "",
			"pageHeadDescription":"",
			"pageHeadAuther"	:"",
			"ListOfPages"		:"",
			"ListOfPageTypes"		:"",
			"pagetype"		:"",

			"buttonText"		:"Submit",

		};
	}

	componentDidMount(){
		this.getListOfPages();

	}

	getListOfPages(){
		/*/get/list*/
		axios
			.get('/api/pages/get/list')
			.then((response)=>{    
				console.log("response",response.data);    
			      	this.setState({
		      			ListOfPages:response.data
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
}
urlPage(event){
	var id = event.target.id;
	this.props.history.push("/cms/masterpage/"+id);/*+response.data.pageURL*/
		    	/* window.location.reload();*/


}
    
deletePage(event){
	event.preventDefault();
	var URL= event.target.id;
	// console.log("id delet", URL);
	 swal({
  
          title: "Are you sure you want to delete this Page ?",
          text: "Once deleted, you will not be able to recover this Page!",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
            	axios
			    .delete("/api/pages/delete/"+URL)
			    .then((response)=>{
			     	this.getListOfPages();
			       swal("Your Page is deleted!");
			       // window.location.reload();
			       this.setState({
						pageTitle : "",
						pageURL: "",
						pageWords : "",
						pageDescription: "",
						pageAuthor : "",
					}) 
			    })
			    .catch((error)=>{
			       console.log("error = ", error);              
			    });
            
              
            } else {
            swal("Your page is safe!");
          }
        }); 
}	
editPage(event){
	event.preventDefault();
	var URL= event.target.id;
	/*/cms/addnewblockonpage/:id"*/
	this.props.history.push("/cms/createnewpage/"+URL);/*+response.data.pageURL*/
	
/*    axios
      .get("/api/pages/get/"+URL)
      .then((response)=>{
        console.log("=selected page data==>",response.data);
        this.setState({
        	"pageTitle"						: response.data.pageTitle,
			"pageUrl"						: response.data.pageURL,
			"pagetype"						: response.data.pageType,
			"pageHeadKeyWords"				: response.data.pageHead.pageWords,
			"pageHeadDescription"			: response.data.pageHead.pageDescription,
			"pageHeadAuther"				: response.data.pageHead.pageAuthor,
			"UrlId"							: URL,
         
        });
      })
      .catch((error)=>{
         console.log("error = ", error);              
      });
*/
}

	render() {
		return (
			<div className="CreatenewpageWraper">
				
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 newpage1stpart nopadding">
						<div className="logopageleftImg">
                          	<img src="/images/Logo.png" alt="" className="intro_img"  width="100" />
                    	</div>
						<div className="pageleftImg1">
                          	<img src="/images/Selected_Pages.png" alt="" className="intro_img"  width="350" />
                    	</div>
                    	<h2 className="text-center whtclr"><b>LETS START BUILDING <br/>YOUR PAGE</b></h2>

					</div>
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
						<div className="cnpTitle ">
							<div className="col-lg-11 col-lg-offset-1 col-md-12 col-xs-12 col-sm-12">
								<h2>List Of Page</h2>
							</div>
						</div>
						
						<div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								{/*<h3>Header Information</h3>*/}
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
										
										<div className="">
									
											<table className="table fs14T">
											  	<thead className="thead-dark">
											    	<tr className="">
												      <th scope="col">No.</th>
												      <th scope="col">Page Title</th>
												    
												      <th scope="col">Actions</th>
											    	</tr>
											  	</thead>
											    <tbody>
											    {
											    	this.state.ListOfPages 
														?
														this.state.ListOfPages && this.state.ListOfPages.length>0?
															this.state.ListOfPages.map((result, index)=>{
																// console.log('result', result);
																return(
																    <tr key={index}>
																      <td>{index+1}</td>
																      <td >{result.pageTitle}</td>
																      {/*<td id={result.pageURL} className="onHoverClick" onClick={this.urlPage.bind(this)} data-placement="top" title="Click here to view Page">{result.pageURL}</td>*/}
																      <td><i className="fa fa-edit deletIcon" id={result.pageURL} data-toggle="collapse" data-toggle="modal" data-target="#createnewPageModal" onClick={this.editPage.bind(this)} data-placement="top" title="Edit Page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
																      		<i className="fa fa-trash deletIcon" id={result.pageURL} onClick={this.deletePage.bind(this)} data-placement="top" title="Delete page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
																      		<i className="fa fa-eye deletIcon"  id={result.pageURL} onClick={this.urlPage.bind(this)} title="View this Page"></i>
																      </td>
																    </tr>
															    	)
																})
															:
															null
												    	:
														null
												}   
											    </tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
					        	{/*<div className="lineHr"></div>*/}
                        	
						</div>
					</div>
				</div>
			</div>
		);
	}
}
