import React, { Component } 		from 'react';
import $ 				 			from 'jquery';
import { bindActionCreators } from 'redux';
import { getCartData } from '../../actions/index';
import axios                  from 'axios';
// import swal from 'sweetalert';
import "../../../sites/currentSite/blocks/ProductViewEcommerce.css";
import _                      from 'underscore';
import { connect }                from 'react-redux';
import Message from '../Message/Message.js';



const user_ID = localStorage.getItem("user_ID");
class ProductModalViewEcommerce extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	"productData":[],
	    	"subImgArray":[],
	    	"totalQuanity":1,
	    	"quanityLimit":5,
	    	"imgsrc" : "",
	    	"productID" : "",
	    };
    this.changeImage = this.changeImage.bind(this); 
  	}  

  	async componentDidMount(){
		await this.props.fetchCartData(); 
      	
  		// var imageArray=[
  		// 	{"image":"/images/45-home_default.jpg"},
  		// 	{"image":"/images/41-home_default.jpg"},
  		// 	{"image":"/images/32-home_default.jpg"},
  		// 	{"image":"/images/45-home_default.jpg"},
  		// ]
  	}
  	componentWillReceiveProps(nextProps){
      
      if (nextProps.productInfo) {
        // console.log('nextProps',nextProps.productInfo);
        if (nextProps.productInfo.productID) {
          this.getData(nextProps.productInfo.productID);
        }
        
      }
  	}
  	getData(productID){
  		axios.get("/api/products/get/one/"+productID)
            .then((response)=>{
            	// console.log("product info---->",response);
              this.setState({ 
                  productData : response.data,
                  quanityLimit : response.data.availableQuantity
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })
  	}
  	 changeImage = (event)=>{
  	 	
        // console.log('parent',this.props.productInfo.productType);

        // console.log('parent',$('#productviewmodal'+this.props.productInfo.productType).find('#change-image'));


        $('#productviewmodal'+this.props.productInfo.productType).find('#change-image').attr('src',event.target.src) 
        
        // var index = event.target.getAttribute('data-index');
        
        this.setState({
        	imgsrc:event.target.getAttribute('data-index')
        })

  }
    

  addtocart(event) {
    event.preventDefault();
    if (user_ID) {
      
      var id = event.target.id;
      // console.log('id', id);
      axios.get('/api/products/get/one/' + id)
        .then((response) => {
          var totalForQantity = parseInt(1 * response.data.discountedPrice);
          const userid = localStorage.getItem('user_ID');
          var availableQuantity = response.data.availableQuantity;
          var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
          var productCartData = recentCartData.filter((a)=>a.product_ID === id);
          var quantityAdded = productCartData.length>0 ? productCartData[0].quantity : 0;
          // console.log('abc', availableQuantity, quantityAdded);

          const formValues = {
            "user_ID": userid,
            "product_ID": response.data._id,
            "currency": response.data.currency,
            "productCode": response.data.productCode,
            "productName": response.data.productName,
            "section_ID"        : response.data.section_ID,
            "section"           : response.data.section,
            "category_ID": response.data.category_ID,
            "category": response.data.category,
            "subCategory_ID": response.data.subCategory_ID,
            "subCategory": response.data.subCategory,
            "productImage": response.data.productImage,
            "quantity": 1,
            "discountedPrice": parseInt(response.data.discountedPrice),
            "originalPrice": parseInt(response.data.originalPrice),
            "discountPercent" :parseInt(response.data.discountPercent),
            "totalForQantity": totalForQantity,

          }
          if(quantityAdded >= availableQuantity){
            this.setState({
                messageData : {
                  "type" : "outpage",
                  "icon" : "fa fa-check-circle",
                  "message" : "Last "+availableQuantity+" items taken by you",
                  "class": "success",
                  "autoDismiss" : true
                }
            })
            setTimeout(() => {
                this.setState({
                    messageData   : {},
                })
            }, 3000);
          }else{
            axios.post('/api/carts/post', formValues)
              .then((response) => {
                this.props.fetchCartData();
                this.setState({
                  messageData : {
                    "type" : "outpage",
                    "icon" : "fa fa-check-circle",
                    "message" : "&nbsp; "+response.data.message,
                    "class": "success",
                    "autoDismiss" : true
                  }
                })
                setTimeout(() => {
                  this.setState({
                      messageData   : {},
                  })
              }, 3000);
                // this.props.changeCartCount(response.data.cartCount);
                
              })
              .catch((error) => {
                console.log('error', error);
              })
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
    else {
      this.setState({
        messageData : {
          "type" : "outpage",
          "icon" : "fa fa-exclamation-circle",
          "message" : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
          "class": "danger",
          "autoDismiss" : true
        }
      })
      setTimeout(() => {
        this.setState({
            messageData   : {},
        })
    }, 3000);
    }
    
  }
   addtowishlist(event){
    event.preventDefault();
    var user_ID = localStorage.getItem('user_ID'); 
    // console.log('user_ID ===============>>>>>>>>..', user_ID);
    if(user_ID){
    	var id = event.target.id;
	    axios.get('/api/products/get/one/'+id)
	    .then((response)=>{
	          const userid = localStorage.getItem('user_ID');
	          // console.log("userid",response.data);
	          const formValues = 
	          { 
	              "user_ID"    : userid,
	              "product_ID" : response.data._id,
	          }
	          axios.post('/api/wishlist/post', formValues)
	          .then((response)=>{
              if(response.status === 200){
                
                this.setState({
                  messageData : {
                    "type" : "outpage",
                    "icon" : "fa fa-check-circle",
                    "message" : response.data.message,
					"class": "success",
					"autoDismiss" : true
                  }
				})
				setTimeout(() => {
					this.setState({
						messageData   : {},
					})
				}, 3000);
              }
              this.setState({
                messageData : {
                  "type" : "outpage",
                  "icon" : "fa fa-exclamation-circle",
                  "message" : response.data.message,
				  "class": "warning",
				  "autoDismiss" : true
                }
			  })
			  setTimeout(() => {
				this.setState({
					messageData   : {},
				})
			}, 3000);
	          })
	          .catch((error)=>{
	            console.log('error', error);
	          })
	    })
	    .catch((error)=>{
	      console.log('error', error);
	    })
    }else{
          
          this.setState({
          messageData : {
            "type" : "outpage",
            "icon" : "fa fa-exclamation-circle",
            "message" : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
			"class": "warning",
			"autoDismiss" : true
          }
		})
		setTimeout(() => {
			this.setState({
				messageData   : {},
			})
		}, 3000);
      }
    
  }
    Closepagealert(event){
    event.preventDefault();
    $(".toast-error").html('');
    $(".toast-success").html('');
    $(".toast-info").html('');
    $(".toast-warning").html('');
    $(".toast-error").removeClass('toast');
    $(".toast-success").removeClass('toast');
    $(".toast-info").removeClass('toast');
    $(".toast-warning").removeClass('toast');

  }

  addQuantity(){
    console.log("#addQuantity",$('#productviewmodal'+this.props.productInfo.productType).find('#addQuantity'));
  	var totalQuanity = this.state.totalQuanity
  	totalQuanity++;
    console.log("#totalQuanity122",totalQuanity);
    console.log("#quanityLimit",this.state.quanityLimit);
  	$('#productviewmodal'+this.props.productInfo.productType).find('#addQuantity').addClass('auto');
  	$('#productviewmodal'+this.props.productInfo.productType).find('#addQuantity').css('background-color','#fff');
  	$('#productviewmodal'+this.props.productInfo.productType).find('#decreaseQuantity').addClass('auto');
  	$('#productviewmodal'+this.props.productInfo.productType).find('#decreaseQuantity').css('background-color','#fff');


    if(Number(totalQuanity) > Number(this.state.quanityLimit) ){

  	 	$('#productviewmodal'+this.props.productInfo.productType).find('#addQuantity').css('background-color','#ccc');
  	 	$('#productviewmodal'+this.props.productInfo.productType).find('#addQuantity').addClass('no-drop');
  	}else{
      console.log("#totalQuanity",$('#productviewmodal'+this.props.productInfo.productType).find('#totalQuanity'));

  		this.setState({totalQuanity : totalQuanity});
  		$('#productviewmodal'+this.props.productInfo.productType).find('#totalQuanity').html(totalQuanity) ;
  	}
  }
  decreaseQuantity(){
  	var totalQuanity = this.state.totalQuanity
  	totalQuanity--;
  	$('#productviewmodal'+this.props.productInfo.productType).find('#addQuantity').addClass('auto');
  	$('#productviewmodal'+this.props.productInfo.productType).find('#addQuantity').css('background-color','#fff');
  	$('#productviewmodal'+this.props.productInfo.productType).find('#decreaseQuantity').addClass('auto');
  	$('#productviewmodal'+this.props.productInfo.productType).find('#decreaseQuantity').css('background-color','#fff');
  	if(Number(totalQuanity) === 1 || Number(totalQuanity) > 1){
  		this.setState({totalQuanity : totalQuanity},() =>{
  			$('#productviewmodal'+this.props.productInfo.productType).find('#totalQuanity').html(totalQuanity);
  		});
  		
  	}else{
  		$('#productviewmodal'+this.props.productInfo.productType).find('#decreaseQuantity').addClass('no-drop');
  		$('#productviewmodal'+this.props.productInfo.productType).find('#decreaseQuantity').css('background-color','#ccc');	
  	}
  }
  render() {
  	       // console.log('prohbnhvhvhgcvhgchgchgc',this.props.productInfo,this.state.productData); 
		return (
				
			this.state.productData?
			<div className="row">
        <Message messageData={this.state.messageData} />
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20 mb20 NoPadding">
					<div className="col-lg-5 col-md-5 col-sm-12 col-xs-12 NoPadding" id="parentDiv">							
					<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 imageContainer NoPadding">
						{
							this.state.productData.productImage && this.state.productData.productImage.length>0? 
							this.state.productData.productImage.map((data, index)=>{
								
								if( !_.isEmpty(data)){
								// if(index>0 && !_.isEmpty(data)){
									return(
                   					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 miniImagesInNew" key={this.props.productInfo.productType ? index+this.props.productInfo.productType : index} onClick={this.changeImage} >
										<div className="row">
										{
											data &&  <img data-index={index} className={index===this.state.imgsrc?"imgbxborder":""} src={data} alt="default"/>
										}
										</div>
									</div>
                   					);
								}
                   				
                   			})	
                   			:
                   			null
						}
					</div>
					<div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 imageContainer imgCont">
						<div className="row">
							<img className="productView" src={this.state.productData.productImage && this.state.productData.productImage[0]} id="change-image" alt="default"/>
							
						</div>
					</div>
					</div>
					<div className="col-lg-7 col-md-7 col-sm-12 col-xs-12 ">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 productInfoEcommerce">
							<div className="row">
								<div id="brand"><label className="productNameClassNewBrand"> {this.state.productData.productName} </label></div>
								<br/>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="row">
									<p className="orangetxt "><a href="#gotoreview" className="anchorclr">Be the first to review this product</a></p>
									{/*<span className="priceEcommerce" ><i className={"fa fa-"+this.state.productData.currency}></i>&nbsp;{this.state.productData.discountedPrice}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									{this.state.productData.offered === true ? <span className="originalPrice"><i className={"fa fa-"+this.state.productData.currency}>&nbsp;{this.state.productData.originalPrice}</i></span> : null}*/}
									</div>
									<div className="undrln row"> </div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="row">
										<span className="col-md-3 col-lg-3 col-sm-3 col-xs-3 paddingleftzero ttl" >
											Price:
										</span>
										<span className="col-md-6 col-sm-12 col-xs-12 col-lg-6 ">
											<span className="priceEcommerceNew" ><i className={"fa fa-"+this.state.productData.currency}></i>&nbsp;{this.state.productData.discountedPrice}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											{this.state.productData.offered === true ? <span className="originalPrice"><i className={"fa fa-"+this.state.productData.currency}>&nbsp;{this.state.productData.originalPrice}</i></span> : null}
										</span>				                         
			                        </div>
			                        <div className="row listspace">
										<span className="col-md-3 col-lg-3 col-sm-3 col-xs-3 paddingleftzero ttl" >
											In Stock
										</span>
										<span className="col-md-6  col-sm-12 col-xs-12 col-lg-6 ttl" >
											{this.state.productData.availableQuantity}
										</span>
			                        </div>
			                        <div className="row listspace">
										<span className="col-md-3 col-lg-3 col-sm-3 col-xs-3  paddingleftzero paddingrightzero ttl" >
											Product Code
										</span>
										<span className="col-md-6  col-sm-12 col-xs-12 col-lg-6 ttllist" >
											{this.state.productData.productCode}
										</span>
			                        </div>
			                        <div className="row listspace">
										<span className="col-md-3 col-lg-3 col-sm-3 col-xs-3 paddingleftzero ttl" >
											Features:
										</span>
										<div className="col-md-9 col-sm-9 col-xs-12 col-lg-9 ttllist" >												
											{ this.state.productData.featureList &&
												<ul className="paddingleftzero">
												{ this.state.productData.featureList && 
													this.state.productData.featureList.map((data,index)=>{
														return (

															<div className="singlefeature" key={this.props.productInfo.productType ? index+this.props.productInfo.productType : index}>
															<div className="">
															 <span className="fa fa-circle-o tealColorfnt "></span>
															  <span className="blackColor ">&nbsp;&nbsp;{data.feature}</span>
															</div>
															</div>
														);
													})
													
												}
												</ul>
											}
										</div>			                         
			             </div>
			          </div>
							</div>
						</div>
						<br/>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
							<div className="row spc">
								<div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 paddingrightzero">
								{
                                            this.state.productData.availableQuantity > 0 ?
									<div>
										<div className="col-lg-2 col-md-3 col-sm-3 col-xs-3 NoPadding">
											<span className="qty" id="totalQuanity">
											&nbsp;&nbsp;1
											</span>
										</div>
										<div className="col-lg-2 col-md-2 col-sm-4 col-xs-4 NoPadding">
											<span className="qty2 col-lg-12 col-md-12 col-sm-12 col-xs-12 cursorpointer" id="addQuantity" onClick={this.addQuantity.bind(this)}>
											<span >+</span>
											</span>
											<span className="qty3 col-lg-12 col-md-12 col-sm-12 col-xs-12 cursorpointer"  id="decreaseQuantity" onClick={this.decreaseQuantity.bind(this)}>
												<span >-</span>
											</span>
										</div>
										<div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 NoPadding">
											<span onClick={this.addtocart.bind(this)} id={this.state.productData._id} className="qtycart clr cursorpointer">
												<i className="fa fa-shopping-cart " aria-hidden="true" id={this.state.productData._id}></i> Add to Cart
											</span>
										</div>
									</div>
									:
									<div className=" col-lg-9 col-md-9 col-sm-12 col-xs-12 NOpadding pull-right">
										<span className="soldOut">Sold Out</span>
										<p className="soldOutP">This item is currently out of stock</p>
									</div>
								}

									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 paddingleftzero">
										<span onClick={this.addtowishlist.bind(this)}  id={this.state.productData._id} className="icns clr cursorpointer">
										 	<i className="fa fa-heart-o" aria-hidden="true"  id={this.state.productData._id}></i>
										</span>
									</div>	
								</div>
								<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 paddingleftzero"></div>   
		          </div>
						</div>
					</div>
        </div>
        <div id="gotoreview" className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 faq">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 faq">
              <div className="col-lg-12 topspace detailtitle">DETAILS</div>
              <div className="spcbx topspace15"></div>
               <div className="col-lg-12 detailtxt topspace15">{this.state.productData.productDetails}</div>
            </div>
          </div>               
        </div>               
		</div>			
			:
			null
		
		);
	}
}
const mapStateToProps = (state)=>{
  return {
    recentCartData :  state.recentCartData
  }
}
const mapDispachToProps = (dispatch) =>{
  return bindActionCreators({ fetchCartData: getCartData }, dispatch)
}
export default connect(mapStateToProps, mapDispachToProps)(ProductModalViewEcommerce);


