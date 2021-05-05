import React, { Component }   from 'react';
import Image                  from 'next/image';
import Link                   from 'next/link';
import axios                  from 'axios';
import Carousel               from 'react-multi-carousel';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import Loader                 from "../../StaticBlocks/loader/Loader.js";
import Message                from '../../StaticBlocks/Message/Message.js';
import Select                 from 'react-select';
import getConfig              from 'next/config';
import $, { post } from 'jquery';
import jQuery from 'jquery';
import 'react-multi-carousel/lib/styles.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Style                  from './ProductCarousel.module.css';
import {getCartData,getWishlistData}  from '../../../../../redux/actions/index.js'; 
import Product from './Product.js';

const { publicRuntimeConfig } = getConfig();
var projectName = publicRuntimeConfig.CURRENT_SITE;
const productImgHeight = publicRuntimeConfig.IMGHeight;
// console.log("IgmHeight====",productImgHeight);

const sortOptions = [
  { value: 'alphabeticallyAsc', label: 'Name A -> Z' },
  { value: 'alphabeticallyDsc', label: 'Name Z -> A' },
  { value: 'priceAsc', label: 'Price Low -> High' },
  { value: 'priceDsc', label:'Price High -> Low'},
];

const displayProductOptions = [
  { value: '10', label: '10 Products / page' },
  { value: '20', label: '20 Products / page' },
  { value: '40', label: '40 Products / page' },
  { value: '1000', label: 'All Products / page'}
];
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

class ProductCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType        : props.type,
      newProducts        : [],      
      products           : [],
      modalIDNew         : [],
      wishList           : [],
      sizeCollage        : false,
      relatedProductArray: [],
      discountedProducts : [],
      productSettings    : {          
          displayAssurenceIcon: false,
          displayBrand: true,
          displayCategory: false,
          displayFeature: "size",
          displayRating: false,
          displaySection: false,
          displaySubCategory: false,
          displayWishlist: true,
      },
      blockSettings      : {
        blockTitle         : "Fruits",
        blockApi           : "/api/products/get/listbysection/Fruits",
        noOfProductPerLGRow: 4,
        noOfProductPerMDRow: 4,
        noOfProductPerSMRow: 4,
        noOfProductPerXSRow: 2,
        showCarousel       : true,
        totalProducts      : 12,
        leftSideFilters    : false
      }, 
      ProductsLoading : false,
      loading         : true,
      blockTitle: "Fruits",
      filterSettings     : [],
      categoryData       : [],
      // categoryData  : [],
      selector:{
          limit:20
      },
      user_ID : '',
    };
  }
  componentDidUpdate(){
    // console.log("3 inside componentdidupdate");
    if(this.state.categoryData.length < 1){
      // console.log("inside rendor length > 1",$('.ProductViewWrapper').hasClass("col-lg-9"));
			$('.filterWrapper').hide();
			$('.ProductViewWrapper').removeClass('col-lg-9');
			$('.ProductViewWrapper').removeClass('col-md-9');			
			$('.ProductViewWrapper').addClass('col-lg-12');
			$('.ProductViewWrapper').addClass('col-md-12');
		}else{
      $('.filterWrapper').show();
			$('.ProductViewWrapper').addClass('col-lg-9');
			$('.ProductViewWrapper').addClass('col-md-9');
			$('.ProductViewWrapper').removeClass('col-lg-12');
			$('.ProductViewWrapper').removeClass('col-md-12');	
		}
  }
  async componentDidMount(){
    this.getCategoryData();
    var user_ID = localStorage.getItem("user_ID"); 
    const websiteModel = localStorage.getItem("websiteModel");      
    const showLoginAs = localStorage.getItem("showLoginAs"); 
    if(user_ID!==null){     
    this.setState({
      user_ID:user_ID,
      showLoginAs: showLoginAs,
      websiteModel:websiteModel
    },()=>{
        this.getWishlistData();
    }); 
  }
    
    //category carousel
    $(".expand").on( "click", function() {      
      $expand = $(this).find(">:first-child");
      if($expand.text() == "+") {
        $expand.text("-");
      } else {
        $expand.text("+");
      }
    });

    //text expand start
    var showChar = 100;
    var ellipsestext = "...";
    var moretext = "more";
    var lesstext = "less";
    $('.more').each(function() {
      var content = $(this).html();
      if(content.length > showChar) {
        var c = content.substr(0, showChar);
        var h = content.substr(showChar-1, content.length - showChar);
        var html = c + '<span className="moreellipses">' + ellipsestext+ '&nbsp;</span><span className="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" className="morelink">' + moretext + '</a></span>';
        $(this).html(html);
      }
    });
  
    $(".morelink").click(function(){
      if($(this).hasClass("less")) {
        $(this).removeClass("less");
        $(this).html(moretext);
      } else {
        $(this).addClass("less");
        $(this).html(lesstext);
      }
      $(this).parent().prev().toggle();
      $(this).prev().toggle();
      return false;
    });
    //text expand end

    var subcatArray = [];
      // subcatArray.push(this.props.match.params.subcategoryID);
      var filterUrl = window.location.href;
      var url       = filterUrl.split('/');
      filterUrl     = url[4];
      var filterUrlType = url[3];
      var filterUrlArray = [];
			filterUrlArray.push(filterUrl);   
      // console.log("filterUrl===",filterUrl);
      // console.log("filterUrlType===",filterUrlType);
      if(filterUrlType === 'section'){
        this.getBrandsBySection(filterUrl);
      }else if(filterUrlType === 'category'){
        this.getBrandsByCategories(filterUrlArray);
      }else if(filterUrlType === 'subcategory'){
        this.getBrandsBySubcategories(filterUrl);
      }

      // console.log("newProducts====",this.state.newProducts); 
      // console.log("Props====",this.props);       
      if(this.props.block_id){
      axios.get('/api/blocks/get/'+this.props.block_id)    
      .then((response)=>{
        if(response.data){
        // console.log("response data====",response.data);                
        this.setState({
           blockSettings   : response.data.blockSettings,  
           productSetting  : response.data.productSettings,   
           blockTitle      : response.data.blockTitle, 
          //  loading         : false,  
          
        },()=>{
          // console.log("state.blockSettings.showCarousel===",this.state.blockSettings.showCarousel);
          // console.log("state.blockSettings.filter===",this.state.filterSettings.length);
          // console.log("this.props.productApiUrl===",this.props.productApiUrl);
          if(!this.state.blockSettings.showCarousel && this.state.filterSettings){
            var productApiUrl = this.props.productApiUrl;
            console.log("productApiUrl===",productApiUrl);
          }else if(!this.state.blockSettings.showCarousel && !this.state.filterSettings){
            var productApiUrl = this.props.productApiUrl;
            console.log("productApiUrl===",productApiUrl);
          }else{ 
              var productApiUrl = this.state.blockSettings.blockApi;
              console.log("productApiUrl===",productApiUrl);
          }
          axios.get(productApiUrl)      
          .then((response)=>{
            if(response.data){     
            // console.log("response.data in product carousel===",response.data);       
            if(localStorage.getItem('websiteModel')=== "FranchiseModel"){
              for(var i=0;i<response.data.length;i++){       
                  var availableSizes = [];         
                  if(response.data[i].size){              
                    availableSizes.push(response.data[i].size*1);
                    availableSizes.push(response.data[i].size*2);
                    availableSizes.push(response.data[i].size*4); 
                    response.data[i].availableSizes = availableSizes;           
                  }
              }
            } 
            this.setState({
              newProducts     : response.data,                          
            },()=>{
              // console.log("newProducts===",this.state.newProducts);
              if(this.state.newProducts.length>0){
                this.setState({
                  ProductsLoading : true,
                  loading         : false
                });  
              }
                // console.log("Products list===",this.state.newProducts);
                // this.getFilteredProducts(this.state.selector);
            });
          }
          })
          .catch((error)=>{
              console.log('error', error);
          })
        });
      }else{
        this.setState({          
          ProductsLoading : false
        });
      }
      })
      .catch((error)=>{
          console.log('error', error);
      })
    }//end if blockid
  }

  getWishlistData() {
    axios.get('/api/wishlist/get/wishlistdata/' + this.state.user_ID)    
      .then((response) => {
        if(response){
          // console.log("wislist response====",response.data);
          this.setState({
            wishList: response.data
          },()=>{
                // console.log("2.My Wislist products ====",this.state.wishList);
          })
        }        
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  getBrandsBySection(sectionUrl) {
    // console.log("sectionUrl===",sectionUrl);
		axios.get("/api/products/get/listBrand/" + sectionUrl)
			.then((response) => {
				this.setState({
					brands: response.data
				})
			})
			.catch((error) => {
				console.log('error', error);
			})
	}
	getBrandsByCategories(filterUrlArray) {
    console.log("inside getBrandsByCategories",filterUrlArray);
		var formValues = {
			filterUrlArray: filterUrlArray
		}

		axios.post("/api/products/get/listBrandByCategories", formValues)
			.then((response) => {
        console.log("brand response.data===",response.data);
				this.setState({
					brands: response.data
				})
			})
			.catch((error) => {
				console.log('error', error);
			})
	}
  getBrandsBySubcategories(categoryUrl) {
		var formValues = {
      subcategories: categoryUrl
      // categoryUrl     : categoryUrl      
		}
		axios.post("/api/products/get/listBrandBySubcategories", formValues)

			.then((response) => {
				this.setState({

					brands: response.data
				})
			})
			.catch((error) => {
				console.log('error', error);
			})
  }
  onSelectedItemsChange(filterType, selecteditems){
    // console.log("filterType===",filterType);
    // console.log("selecteditems===",selecteditems);
		var checkboxes = document.getElementsByName('brands[]');
		var brands = [];
		for (var i = 0, n = checkboxes.length; i < n; i++) {
			if (checkboxes[i].checked) {
				brands.push(checkboxes[i].value);
			}
		}
		if(filterType === 'category') {
			var selector = this.state.selector;
      console.log("selector===",selector);
			delete selector.subCategory_ID;
			selector.section_ID = this.props.match.params.sectionID;
			selector.price = this.state.price;
			selector.category_ID = $(selecteditems.target).data().id;
			if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
				selector.subCategory_ID = this.props.match.params.subcategoryID;
			}
			this.setState({ selector: selector }, () => {
				this.getFilteredProducts(this.state.selector);
			})
		}
		if (filterType === 'subcategory') {
			selector = this.state.selector;
			selector.section_ID = this.props.match.params.sectionID;
			selector.price = this.state.price;
			selector.subCategory_ID = $(selecteditems.target).data().id;

			if (this.props.match.params.categoryID && !selector.category_ID) {
				selector.category_ID = this.props.match.params.categoryID;
			}
			this.setState({ selector: selector }, () => {
				this.getFilteredProducts(this.state.selector);
			})
		}
		if (filterType === 'brands') {
			selector = this.state.selector;
      // console.log("selector==",selector);
			// selector.section_ID = this.props.match.params.sectionID;
			selector.price = this.state.price;
			selector.brands = brands;

			// if (this.props.match.params.categoryID && !selector.category_ID) {
			// 	selector.category_ID = this.props.match.params.categoryID;
			// }
			// if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
			// 	selector.subCategory_ID = this.props.match.params.subcategoryID;
			// }
			this.setState({ selector: selector }, () => {
				this.getFilteredProducts(this.state.selector);
			})
    }
  }
  
  filterCategoriesData(filterBy,filterKey){
    // console.log("filterKey===",filterKey +" "+filterBy);
    if(filterBy === "listbycategory"){
      var categoryData = this.state.categoryData.filter((val,key)=>{ 
        // console.log("val ===",val.categoryUrl.toLowerCase());         
          return val.categoryUrl.toLowerCase() === filterKey.toLowerCase()
      })
      this.setState({
        categoryData:categoryData,
      },()=>{
          // console.log("after category filter categoryData===",categoryData);
      })
    }
    if(filterBy === "listbysubcategory"){
      // console.log("subcategory data====",categoryData); 
      var categoryData = this.state.categoryData.filter((val,key)=>{        
          // console.log("category  val===",val); 
          if(val.subCategory && val.subCategory.length>0){
            var categoryData = val.subCategory.filter((subval,key)=>{  
              // if(val.subCategoryUrl)
                // console.log("listbysubcategory val===",subval); 
                return val.subCategoryUrl?val.subCategoryUrl.toLowerCase():null;
                // return val.subCategoryUrl?val.subCategoryUrl.toLowerCase():null === filterKey.toLowerCase();
              
              })
          }
      })
      this.setState({
        categoryData:categoryData
      },()=>{
          // console.log("after Subcategory filter categoryData===",categoryData);
      })
    }
    if(filterBy === "listbysection"){
      var categoryData = this.state.categoryData.filter((val,key)=>{
        // console.log("section val ===",val.section +" 1"+filterKey);
        return val.section.toLowerCase() === filterKey.toLowerCase()
      })
      this.setState({
        categoryData:categoryData
      },()=>{
          // console.log("after section filter categoryData===",categoryData);
      })
    }
  }

  getCategoryData(){
    return axios.get("/api/category/get/list/")
        .then((response)=>{
            // console.log(" category response.data===",response.data);
            if(response){
              // response.data.filter()
              this.setState({
                categoryData: response.data,
              },()=>{
                  //show filters by category
                  var productApiUrl = this.props.productApiUrl;
                  var fields = productApiUrl.split('/');
                  var filterBy = fields[4];
                  var filterKey = fields[5];
                  this.filterCategoriesData(filterBy,filterKey);
              })
            }
        })
        .catch((error)=>{ 
              console.log('error', error);
        })
  }
  addCart(formValues, quantityAdded, availableQuantity) {
    if(localStorage.getItem('webSiteModel')==='FranchiseModel'){
      axios.post('/api/carts/post', formValues)
        .then((response) => {
          // store.dispatch(fetchCartData());
          this.props.fetchCartData();
          this.setState({
            messageData: {
              "type": "outpage",
              "icon": "fa fa-check-circle",
              "message": "&nbsp; " + response.data.message,
              "class": "success",
              "autoDismiss": true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 3000);
        })
        .catch((error) => {
          console.log('error', error);
        })
    }else{
    if (quantityAdded >= availableQuantity) {
    
      this.setState({
        messageData: {
          "type": "outpage",
          "icon": "fa fa-check-circle",
          "message": "Last " + availableQuantity + " items taken by you",
          "class": "success",
          "autoDismiss": true
        }
      })
      setTimeout(() => {
        this.setState({
          messageData: {},
        })
      }, 3000);
    } else {
      // console.log("formValues==",formValues);
      axios.post('/api/carts/post', formValues)
        .then((response) => {
          // console.log("this.props.fetchCartData();",this.props.fetchCartData());
          this.setState({
            messageData: {
              "type": "outpage",
              "icon": "fa fa-check-circle",
              "message": "&nbsp; " + response.data.message,
              "class": "success",
              "autoDismiss": true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 3000);
          this.props.fetchCartData();

        })
        .catch((error) => {
          console.log('cart post error', error);
        })
    }
  }//end else websiteModel
  }

  submitCart(event) { 
    const user_ID = localStorage.getItem('user_ID');
    // console.log("userId===",user_ID);
    if(user_ID){
      // console.log("recentCartData===",this.props.recentCartData);
      if(this.props.recentCartData.length>0 && this.props.recentCartData[0].cartItems.length>0){
          var cartLength = this.props.recentCartData[0].cartItems.length;
          var productId = event.target.id;
          for(let i=0;i<cartLength;i++){
              if(this.props.recentCartData[0].cartItems[i].product_ID === productId){
                this.setState({
                  messageData: {
                    "type": "outpage",
                    "icon": "fa fa-exclamation-circle",
                    "message": "This product is already in your cart",       
                    "class": "success",
                    "autoDismiss": false
                  }
                })
                setTimeout(() => {
                  this.setState({
                    messageData: {},
                  })
                }, 3000);
                break;
                // console.log("submitCart userId===",this.state);

              }//end if
          }//end for loop
      }
      // console.log("this.props.recentCartData[0].cartItems:",this.props.recentCartData[0].cartItems);
    var id = event.target.id;
    if(localStorage.getItem("websiteModel")=== "FranchiseModel"){
      var selectedSize = $('#'+id+"-size").val();      
      var size = event.target.getAttribute('mainsize');      
      var unit = event.target.getAttribute('unit');      
    }    
    const userid = localStorage.getItem('user_ID');
    var availableQuantity = event.target.getAttribute('availablequantity');
    // console.log("AvailableQuantity=======",$('.xyz'));
    var currProId = event.target.getAttribute('currpro');
    var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
    var productCartData = recentCartData.filter((a) => a.product_ID === id);
    var quantityAdded = productCartData.length > 0 ? productCartData[0].quantity : 0;
    var formValues ={};
    if(localStorage.getItem("websiteModel")=== "FranchiseModel"){
      if(selectedSize === size){
         var quantity = 1;
         var totalWeight = selectedSize +" "+unit
         formValues = {
          "user_ID": userid,
          "product_ID": event.target.id,
          "quantity": 1,  
          "selectedSize" : selectedSize,
          "size"         : size,
          "totalWeight"  : totalWeight,      
        }
      }else{
        quantity    = selectedSize/size;
        totalWeight = size*quantity +" "+unit;
        formValues = {
          "user_ID"      : userid,
          "product_ID"   : event.target.id,
          "quantity"     : quantity,
          "selectedSize" : selectedSize,
          "size"         : size,
          "totalWeight"  : totalWeight,
        }
      }

    }else{      
      formValues = {
        "user_ID": userid,
        "product_ID": event.target.id,
        "quantity": 1,        
      }      
    }

    this.addCart(formValues, quantityAdded, availableQuantity);
    this.setState({
      ['sizeCollage' + currProId]: false
    })
  }else{

    // console.log("user loged out====",localStorage.getItem('showLoginAs'));
    if(localStorage.getItem('showLoginAs')==="modal"){
      $('#loginFormModal').show();       
      }else{
      this.setState({
        messageData: {
          "type": "outpage",
          "icon": "fa fa-exclamation-circle",
          "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
          // "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
          
          "class": "danger",
          "autoDismiss": true
        }
      })
      setTimeout(() => {
        this.setState({
          messageData: {},
        })
      }, 3000);
    }//end else
  }
  }
  addtowishlist(event) {
    event.preventDefault();
    // console.log("recentWishlistData===",this.props.recentWishlistData);
    if (this.state.user_ID) {
      var id = event.target.id;
      // const userid = localStorage.getItem('user_ID');
      const formValues = {
        "user_ID": this.state.user_ID,
        "product_ID": id,
      }
      // console.log("inside wishlist==",formValues);
      axios.post('/api/wishlist/post', formValues)
        .then((response) => {
          // console.log("wishlist ressponse===",response.data);
          var previousUrl = window.location.href;
          localStorage.setItem("previousUrl", previousUrl);
          this.setState({
            messageData: {
              "type": "outpage",
              "icon": "fa fa-check-circle",
              "message": "&nbsp; " + response.data.message,
              "class": "success",
              "autoDismiss": true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 3000);
          this.getWishlistData();
          // this.props.getWishlistData();
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
    else {
      var previousUrl = window.location.href;
      localStorage.setItem("previousUrl",previousUrl);
      if(localStorage.getItem('showLoginAs')==="modal"){
        $('#loginFormModal').show();        
        }else{
        this.setState({
          messageData: {
            "type": "outpage",
            "icon": "fa fa-exclamation-circle",
            // "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
            "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
            "class": "warning",
            "autoDismiss": true
          }
        })
        setTimeout(() => {
          this.setState({
            messageData: {},
          })
        }, 3000);
      }
    }
  }

  showRatingBlock(event){
    event.preventDefault();
  }
  
    sortProducts = effect => {
    this.setState({ effect });
    var sortBy = effect.value;
    // console.log("sortBy==",sortBy);    
    if (sortBy === "alphabeticallyAsc") {
			let field = 'productName';
			this.setState({
				newProducts: this.state.newProducts.sort((a, b) => (a[field] || "").toString().localeCompare((b[field] || "").toString()))
			});
		}
		if (sortBy === "alphabeticallyDsc") {
			let field = 'productName';
			this.setState({
				newProducts: this.state.newProducts.sort((a, b) => -(a[field] || "").toString().localeCompare((b[field] || "").toString()))
			},()=>{
          // console.log("newProducts===",this.state.newProducts);
      });
		}
		if (sortBy === "priceAsc") {
			let field = 'discountedPrice';
			this.setState({
				newProducts: this.state.newProducts.sort((a, b) => a[field] - b[field])
			});
		}
		if (sortBy === "priceDsc") {
			let field = 'discountedPrice';
			this.setState({
				newProducts: this.state.newProducts.sort((a, b) => b[field] - a[field])
			},()=>{
        // console.log("newProducts===",this.state.newProducts);
      });
		}    
  };
  limitProducts = displayProduct => {
    event.preventDefault();
    this.setState({ displayProduct });
    var sortBy = displayProduct.value;
    this.setState({ displayProduct });
		var selector = this.state.selector;
    selector.limit = displayProduct.value;
		this.setState({ selector: selector }, () => {		
    // console.log("selector after setState===",this.state.selector);	
			this.getFilteredProducts(this.state.selector);			
    })
  }
  getFilteredProducts(selector){
    // console.log("selector===",selector);
    // console.log("$('.limitProducts').val()===",$('.limitProducts').val());
		if (selector.limit) {
      selector.limit = selector.limit;
      var pageUrl = window.location.pathname;
      // console.log("selector.pageUrl===",pageUrl);
      let a = pageUrl ? pageUrl.split('/') : "";
      const urlParam =a[2];
      if(a[1] === 'category'){
        selector.categoryUrl = urlParam;
      }else{
        selector.sectionUrl = urlParam;
      }
		} else {
			selector.limit = "50";
		}

    // axios.post("/api/products/post/list/filterProducts/", selector)
    axios.post("/api/products/post/list/filterProductsByCategory/", selector)
			.then((response) => {
        // console.log("selector response=======",response.data);
				this.setState({ 
          newProducts: response.data ,
          ProductsLoading : true
        });
			})
			.catch((error) => {
				console.log('error', error);
			})
	}
  render() {
    const { effect } = this.state;
    const { displayProducts } = this.state;
    // console.log("1. inside render");    
    
    var LGCol = 12/this.state.blockSettings.noOfProductPerLGRow;
    var MDCol = 12/this.state.blockSettings.noOfProductPerMDRow;
    var SMCol = 12/this.state.blockSettings.noOfProductPerSMRow;
    var XSCol = 12/this.state.blockSettings.noOfProductPerXSRow;
    
    return (
      !this.state.loading ?
      <div className={"col-12 " +Style.NoPadding}>        
          <Message messageData={this.state.messageData} />  
          {this.state.blockSettings.showTitle && this.state.newProducts && this.state.newProducts.length > 0 ?
            <div className="col-12">
              <div className={"col-12 " +Style.productcomponentheading +" " +Style.textCenter}>                
                <div className={ "col-12 " +Style.title4}>
                    <h2 className={"col-12 globalMainTitle  title_inner4 lang_trans globalMainTitle "+Style.textAlign} data-trans="#blog_1554730795823_title">{this.state.blockTitle}</h2>
                    <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                    <div className={"line "+Style.line}><span className={Style.span}></span></div>
			        	</div>
              </div>             
            </div>
          : null
          } 

          {/* show breadCrumbsLink */}
          { !this.state.blockSettings.showCarousel && this.state.blockSettings.filterSettings ?
          <div className={ "col-12 " +Style.breadCrumbs +" " +Style.NoPadding}>            
            <ul className={Style.links}>
								<li><Link href="/"><a>Home / </a></Link></li>&nbsp;
                {/* {console.log("breadcrum category===",this.state.categoryData)} */}
								{this.state.categoryData[0] ?
									// <li><Link href={"/section/"+this.state.categoryData[0].section.replace(/\s+/g, '-').toLowerCase()}>
                  <li><Link href={`/section/${encodeURIComponent(this.state.categoryData[0].section.replace(/\s+/g, '-').toLowerCase())}`}><a>
										{" " +this.state.categoryData[0].section}</a></Link>&nbsp;
                    {this.state.categoryData.length<=1?<a href="">/ {this.state.categoryData[0].category}</a>:null}
                    {this.state.categoryData[0].subCategory[0]?<a href="">/ {this.state.categoryData[0].subCategory[0].subCategoryUrl}</a>:null}
                  </li>
									: ""
								}
								<li><Link href="/"><a>{this.state.productscategoryName}</a></Link></li>
							</ul>
          </div>
          :null
          }
        <div className={"col-12 "}>
          {this.state.newProducts && this.state.newProducts.length > 0 ?
            <div id="home" className={"col-12 " +Style.ecommerceTabContent}>
              <div className={"col-12 mt-50 mb-50 " +Style.carouselWraper}>
                <div className={"col-12 "}>                    
                  {this.state.ProductsLoading === false ?                     
                    <Loader type="carouselloader" productLoaderNo = {4}/>                    
                  :
                  <div className={"col-12 " +Style.NoPadding}>               
                  { this.state.blockSettings.showCarousel === true?
                  <Carousel  
                    className={Style.customnNavButton +" " +Style.carouselNewWrapper}
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    responsive={responsive}
                    ssr={true} // means to render carousel on server-side.
                    infinite={false}
                    autoPlay= {false}
                    // autoPlay={this.props.deviceType !== "mobile" ? true : false}
                    autoPlaySpeed={3000}
                    keyBoardControl={true}
                    customTransition="all .20"
                    transitionDuration={500}
                    // containerclassName="carousel-container"
                    // removeArrowOnDeviceType={["tablet", "mobile"]}
                    deviceType={this.props.deviceType}
                    //dotListclassName="custom-dot-list-style"
                    itemclassName="carousel-item-padding-10-px">
                    {
                      
                      Array.isArray(this.state.newProducts) && this.state.newProducts.length > 0 ?
                        Array.isArray(this.state.newProducts) && this.state.newProducts.map((data, index) => {  
                            var x = this.state.wishList && this.state.wishList.length > 0 ? this.state.wishList.filter((abc) => abc.product_ID === data._id) : [];
                            // var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];                              
                          //  console.log("data===",data._id);
                            var wishClass = 'r';
                            var tooltipMsg = '';
                            // console.log("this.state.wishList===",this.state.wishList);
                            if (x && x.length > 0) {
                              wishClass = '';
                              tooltipMsg = 'Remove from wishlist';
                              // console.log("wishclassName=",wishClass);
                            } else {
                              wishClass = 'r';
                              // console.log("wishclassName=",wishClass);
                              tooltipMsg = 'Add To Wishlist';
                            }   
                            var categoryUrl = (data.category).replace(/\s+/g, '-').toLowerCase();
                            // console.log("data product=====",(data.category).replace(/\s+/g, '-').toLowerCase());                    
                          return (
                            // <div className={"col-lg-"+LGCol+" col-md-"+MDCol+" col-sm-"+SMCol+" col-xs-"+XSCol +" " +Style.productWrap +" " +Style.customePadding}   key={index}> 
                              <div key={index} className={"col-12 " +Style.singleProduct}>                          
                              <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                                <div className={"col-12 NoPadding"}>
                                  <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                                  <div className={"col-lg-12 NoPadding " +Style.wishlistBtn}>
                                      {this.state.productSettings.displayWishlist === true?
                                          this.state.user_ID?
                                          <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                                          :
                                          <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                                      :null
                                      }
                                      {data.discountPercent ? <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 "  +Style.discounttag}>{Math.floor(data.discountPercent)} % </div> : null}
                                    </div>
                                    <div className= {"col-12 NoPadding " +Style.ImgWrapper}>
                                    <Link href={`/productDetail/${encodeURIComponent(categoryUrl)}/${encodeURIComponent(data.productUrl)}/${encodeURIComponent(data._id)}`}>
                                    <a className={Style.product_item_photo } tabIndex="-1" >
                                      <img loading="lazy" src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.jpg"} alt="ProductImg" className={Style.noAvailableImg +" " +Style.productImg +"lazyload img-responsive NoPadding"}/>
                                      {/* <Image                                           
                                        src={data.productImage[0] ? data.productImage[0] : "/images/notavailable.jpg"}
                                        alt="ProductImg" 
                                        className={"img-responsive" +Style.NoAvailableImg }
                                        height={160}
                                        width={150} /> */}
                                    </a>
                                    </Link>
                                    </div>
                                  </div>
                                  <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                                    <div className={"col-12 " +Style.innerDiv}>
                                      {this.state.productSettings.displayBrand === true ?
                                        data.brandNameRlang?
                                        <div className={"col-12 globalProduct_brand RegionalFont"} title={data.brandNameRlang}>{data.brandNameRlang}</div>
                                        :
                                          <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={data.brand}>{data.brand}</div>

                                      :null
                                      }                                        
                                      
                                      {this.state.productSettings.displaySection === true ?
                                        <div className={"col-12 globalProductItemName"} title={data.section}>{data.section}</div>
                                      :null
                                      }
                                      {this.state.productSettings.displayCategory === true ?
                                        <div className={"col-12 globalProduct_brand"} title={data.category}>{data.category}</div>
                                      :null
                                      }
                                      {data.productNameRlang?
                                      <div className={"col-12 globalProductItemName NoPadding RegionalFont "+Style.NoPadding } title={data.productNameRlang}>
                                        <span className={"RegionalFont " +Style.ellipsis +" " +Style.globalProdName}>{data.productNameRlang} </span>&nbsp;                                        
                                      </div>
                                      :
                                      <div className={"col-12 globalProductItemName NoPadding "+Style.NoPadding } title={data.productName}>
                                      <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span>&nbsp;</div>
                                      }
                                      <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                                        {
                                          localStorage.getItem("websiteModel")=== "FranchiseModel"?                                  
                                            data.discountPercent ?    
                                            <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                              {/* <span className={Style.price}><span className={Style.oldprice}><i className="fas fa-rupee-sign "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fas fa-rupee-sign"></i> {data.discountedPrice} { data.size? "/ " +data.size +" "+data.unit:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span>                                  */}
                                              <span className={Style.price}><span className={Style.oldprice}><i className="fas fa-rupee-sign "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fas fa-rupee-sign"></i> {data.discountedPrice}</span>    
                                            </div>   
                                            :
                                              <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>
                                                <span className={Style.price}><i className="fas fa-rupee-sign"></i>&nbsp;{data.originalPrice} {data.size? "/ " +data.size:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span> &nbsp;                                       
                                              </div>
        
                                          :                                    
                                            data.discountPercent ?
                                            <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                              <span className={Style.price}><span className={Style.oldprice }>&nbsp;<i className="fas fa-rupee-sign"></i>&nbsp;{data.originalPrice}&nbsp;</span>&nbsp;
                                              <i className="fa fa-inr"></i>&nbsp;{data.discountedPrice+".00"} 
                                              </span>
                                            </div>
                                            :  
                                            <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                              <span className={Style.price}><i className="fas fa-rupee-sign"></i>&nbsp;{data.originalPrice} </span> &nbsp;                                      
                                            </div> 
                                        }
                                      </div>
                                      {this.state.productSettings.displayRating === true ?
                                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.displayRating +Style.customePadding}>
                                            <span id="productRating" className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 NoPadding " +Style.NoPadding} onMouseOver={this.showRatingBlock.bind(this)} >
                                                <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.showRating}> 4 <i className="fas fa-star"></i></div>                                        
                                            </span>  
                                            {/* <div className="col-12 NoPadding ratingBlock">
                                                <RatingBlock />
                                            </div>                                   */}
                                            <span className={"col-5 " +Style.customePadding}>(&nbsp;162 &nbsp;)</span>
                                            {this.state.productSettings.displayAssuranceIcon === true ?
                                              <span className={"col-4 NoPadding " +Style.NoPadding +" " +Style.assurenceIcon}>
                                                <img loading="lazy" className={"col-12 NoPadding " +Style.NoPadding} src="/images/assured.png" alt="Assured Img" />                                      </span>
                                            :null
                                            }
                                        </div>
                                        :null
                                      }                              
                                      <div className={"col-12 NoPadding " +Style.NoPadding}>
                                        <div className={"col-12 NoPadding " +Style.NoPadding}>                                  
                                          {
                                            localStorage.getItem("websiteModel")=== "FranchiseModel"?
                                            <div className={"col-12 NoPadding " +Style.btnWrap +" " +Style.NoPadding}>                                                                             
                                                <div className={"col--6 NoPadding " +Style.selectSizeBox +" " +Style.NoPadding}>                                                                              
                                                <select className={"col-12 " +Style.selectdropdown +" " +Style.valid +" " +Style.availablesize +" " +Style.NoPadding} currpro={data._id} id={data._id +"-size"} mainsize={data.size} unit={data.unit} name="size" aria-invalid="false">
                                                  { Array.isArray(data.availableSizes) && data.availableSizes.map((size, index) => {
                                                      return( 
                                                        // <option className="selectedSize" value={availablesize.productSize}>{availablesize.packSize} Pack</option>
                                                        
                                                          size === 1000?                                                  
                                                          <option className="" value={size} key={index}> 1 KG</option>
                                                          :
                                                          data.unit === "Box" || data.unit === "Wrap" || data.unit === "Pack" || data.unit==="pounch" ?                                                    
                                                            <option className={Style.selectedSize} value={size} key={index}>{size} Pack</option>
                                                              :
                                                          <option className={Style.selectedSize} value={size} key={index}>{size}&nbsp;{data.unit}</option>                                                        
                                                      )                                                        
                                                    })
                                                  }
                                                </select>                                     
                                              </div>    
                                              <button type="submit" color={data.color} id={data._id} productcode={data.productCode} availablequantity={data.availableQuantity} currpro={data._id} mainsize={data.size} unit={data.unit}  onClick={this.submitCart.bind(this)} 
                                                title="Add to Cart" className={"col-6 fa fa-shopping-cart "  }>                                                                         
                                                &nbsp;Add
                                              </button>                          
                                            </div>
                                            :
                                            data.availableQuantity > 0 ?
                                              // <button type="submit" id={data._id} className={"fa fa-shopping-cart pull-right" } color={data.color} productcode={data.productCode} availableQuantity={data.availablequantity} onClick={this.addtocart.bind(this)} title="Add to Cart" >
                                              <div>
                                              {this.state.user_ID?
                                              <button type="submit" id={data._id} className={data.availableQuantity +" fa fa-shopping-cart globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                                  &nbsp;Add To Cart
                                              </button>
                                              :
                                              <button type="submit" id={data._id} className={data.availableQuantity +" fa fa-shopping-cart globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
                                                  &nbsp;Add To Cart
                                              </button>
                                              }     
                                              </div>                                           
                                              :
                                              <div className={Style.outOfStock}>Sold Out</div>
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>                            
                          );
                        
                        })
                        :''
                        // <Loader type="carouselloader" productLoaderNo = {4}/>
                    }
                  </Carousel>
                  : 
                  <div className={"col-12 " +Style.ProductListWrapper}>              
                  <div className={"container-fluid " }>
                  {/* Fitters code */}
                  {this.state.blockSettings.leftSideFilters === true?
                  <div className={"row NoPadding " +Style.BlockWrapper +" " +Style.NoPadding}>     
                    
                    {this.state.categoryData && this.state.categoryData.length>0?    
                    <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-12  filterWrapper " +Style.filterBlockWrapper}> 
                    <div className="panel-group" id="accordion">                      
                      <div className={Style.categoryFilterTitle}> Categories </div>  
                      {
                      this.state.categoryData && this.state.categoryData.map((category,index)=>{
                        var i = index+1;
                        return(
                          <div key={index} className="panelCategory paneldefault">
                            <div className={"panel-heading "+Style.panelHeading}>
                            {category.subCategory && category.subCategory.length?
                              <h4 data-toggle="collapse" data-parent="#accordion" href={"#collapse"+i} className="panel-title expand">
                                <div className="right-arrow pull-right">+</div>                                  
                                <Link href={`/category/${encodeURIComponent(category.categoryUrl)}`}>
                                  <a >{category.category}</a>
                                </Link>
                              </h4>
                              :
                              <h4  className="panel-title expand">  
                                <Link href={`/category/${encodeURIComponent(category.categoryUrl)}`}>                              
                                  <a >{category.category}</a>
                                </Link>
                              </h4>
                              }
                            </div>
                            {category.subCategory?
                            <div id={"collapse"+i} className="panel-collapse collapse">
                              <div className="panel-body">
                                <ul className={Style.categoryUl}>
                                    {category.subCategory && category.subCategory.map((subcategory,index)=>{   
                                    return(
                                      <li key={index} className={Style.subcategoryLi}>                                          
                                        <Link href={`/subcategory/${encodeURIComponent(subcategory.subCategoryUrl)}`}>
                                          <a className={"subCategorylia "+Style.subCategorylia}>{subcategory.subCategoryTitle}</a>
                                        </Link> 
                                      </li>
                                    )
                                    })
                                    }
                                  </ul>
                              </div>                                
                            </div>
                            :null
                            }
                        </div>
                        )
                        })                 
                      }  
                    </div> 

                    {/* filter product by brand */}
                    <div className="panel-group" id="accordion">                      
                      <div className={Style.categoryFilterTitle}> Brand </div>  
                      {
                      this.state.brands && this.state.brands.length > 0?
                      this.state.brands.map((brand,index)=>{
                        // console.log("Brand   ===",brand);
                        var i = index+1;
                        return(
                          <div className="col-12 noPadding panelCategory paneldefault" key={index}>
                            <div className={"row panel-heading "+Style.panelHeading}>
                              <div className=" col-1 NoPadding centreDetailContainerEcommerce">
                                <input className=" " type="checkbox" name="brands[]" onChange={this.onSelectedItemsChange.bind(this, "brands")} value={brand} />
                                {/* <span className="col-1 centreDetailCheckEcommerce"></span> */}
                              </div>
                              <span className="col-11 centreDetaillistItemEcommerce">{brand}</span>
                            </div>                              
                          </div>
                        )
                        })   
                        :''
                      }
                    </div> 
                  </div> 
                  :' '
                  }
                  <div className={"col-9 col-sm-12 col-xs-12 NoPadding ProductViewWrapper "+Style.ProductViewWrapper}> 
                    <div className="row">
                      <div className={"col-12 " +Style.rightSidefilter}>
                        <div className="col-3 col-xs-12 pull-left">     
                          <div className="form-group ">
                              <label className="label-category labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">Sort Product By<span className="astrick"></span></label>
                              <Select
                                  value={effect}
                                  onChange={this.sortProducts}
                                  options={sortOptions}
                                  autoFocus = {false}
                              />
                          </div> 
                        </div>
                        <div className="col-3 col-xs-12 pull-right">
                            <div className="form-group ">
                                <label className="label-category labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">Sort Product By<span className="astrick"></span></label>
                                <Select
                                    value={displayProducts}
                                    onChange={this.limitProducts}
                                    options={displayProductOptions}
                                    autoFocus = {false}
                                />
                          </div>
                        </div>
                      </div>
                    </div> 
                    {this.state.newProducts.length>=1?
                      <Product newProducts={this.state.newProducts}
                            productSettings = {this.state.productSettings}
                            blockSettings   = {this.state.blockSettings}

                      />
                    :
                      <div>No Products available </div>
                    }
                  </div>                    
                  </div>                    
                  :
                  // if left side filters are not available in product block

                    <Product newProducts={this.state.newProducts}
                        productSettings = {this.state.productSettings}
                        blockSettings   = {this.state.blockSettings}

                    />
                  }  
                  </div>
                  </div>
                }
                            
                  </div>
                }
                  
                </div>
              </div>
            </div>
          :null
          }
       </div>
      </div>
      :
      <div className="col-2 offset-5 ">          
          <img loading="lazy" src="/images/eCommerce/no-products-found1.png" className="lazyload"></img>
      </div>
    );
  }
}
const mapStateToProps = state => (
  // console.log("state in productCarousel====",state.data),
  {
    recentCartData     : state.data.recentCartData,
    recentWishlistData : state.data.recentWishlistData,
    productApiUrl      : state.data.productApiUrl    
  } 
);
const mapDispatchToProps = {
  fetchCartData    : getCartData, 
  getWishlistData: getWishlistData,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductCarousel);