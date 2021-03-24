import React     from 'react';
import { event } from 'jquery';
import swal      from 'sweetalert';
import axios     from 'axios';
import Switch from "react-switch";
import $                        from 'jquery';

const textSwitch={ 
    display        : "flex",
    justifyContent : "center",
    alignItem      : "center",
    height         : "100%",
    fontSize       : 12,
    color          : "#fff",
    paddingRight   : 2,
    paddingLeft    : 2,
    paddingTop     : 2,
}
class CreateECommblockForm extends React.Component {
	constructor(props) {
        super(props);
        this.state={
            blockTitle          : '',
            blockApi 		    : "",
            totalProducts 	    : 12,
            showCarousel        : true,
            showTitle           : true,
            leftSideFilters     : false,
            noOfProductPerLGRow : 4,
            noOfProductPerMDRow : 4,
            noOfProductPerSMRow : 4,
            noOfProductPerXSRow : 2,
            displayBrand        : true,
            displayWishlist     : true,
            displayRating       : true,
            displayFeature      : "",
            displayAssurenceIcon: true,
            displayCategory     : true,
            displaySubCategory  : true,
            displaySection      : true,
            urlParam            : "",
            block_id            : "",
            filterLabel         : "",
            dbFeildName         : ""

        };
    }
    
    handle1Change(event){
		event.preventDefault();
    	this.setState({
            [event.target.name]:event.target.value	
    	});
    }
    handleChange(checked,e) {
        this.setState({ checked });
    }
      
    // handleChange(event){
    //     this.setState({
    //       [event.target.id] : event.target.checked
    //     })
    // }
  componentWillReceiveProps(nextProps){
    var Block_id= nextProps.Block_id;
    var urlParam= nextProps.urlParam;

    this.setState({
               
                urlParam:urlParam,
                Block_id:Block_id,
               

    },()=>{
    //   console.log("Im Block_id ",this.state.Block_id,this.state.urlParam);
    });

  }

    submitBlockInfo(event){
        event.preventDefault();
        // var Block_id = this.props.Block_id;
        // console.log("Block_id",Block_id);
        var formValues = {
            blockType : "eCommBlock",
            blockTitle: this.state.blockTitle,
            blockSettings : {
                blockTitle 		    : this.state.blockTitle,
                blockApi 		    : this.state.blockApi,
                totalProducts 	    : this.state.totalProducts,
                showTitle           : this.state.showTitle,
                showCarousel        : this.state.showCarousel,
                leftSideFilters     : this.state.leftSideFilters,
                noOfProductPerLGRow : this.state.noOfProductPerLGRow,
                noOfProductPerMDRow : this.state.noOfProductPerMDRow,
                noOfProductPerSMRow : this.state.noOfProductPerSMRow,
                noOfProductPerXSRow : this.state.noOfProductPerXSRow,
            },
            productSettings : {
                displayBrand        : this.state.displayBrand,
                displayWishlist     : this.state.displayWishlist,
                displayRating       : this.state.displayRating,
                displayFeature      : this.state.displayFeature,
                displayAssurenceIcon: this.state.displayAssurenceIcon,
                displayCategory     : this.state.displayCategory,
                displaySubCategory  : this.state.displaySubCategory,
                displaySection      : this.state.displaySection,                
            },
            user_ID                 : localStorage.getItem('userID'),
        };
        // console.log("formValues====",formValues);
      axios.post('/api/blocks/post',formValues)
		.then( (response)=> {	
            // this.props.history.push("/cms/view-blocks");
            // swal("Thank you. Your Block is Created.");	
                console.log("response.data block Id-===",response.data.ID);
                console.log("this.props.Block_id===",this.props.Block_id);
                swal("Thank you. Your Block is Created.");	
                this.setState({
                    block_id : response.data.ID,
                })
             if (response.data) {
                var pageformValues = {
                  "block_id"        : response.data.ID,                   
                  "_id"             : this.props.Block_id,                   

                }
                console.log("pageformValues",pageformValues);
                axios
                .patch('/api/pages/patch/pageaddblocks/'+this.props.urlParam, pageformValues)

                    .then((response)=>{
                      // console.log("data in this.props page=",this.props);
                      // this.props.pageAddBlock(urlParam);
                      if (response) {
                    //   this.props.pageAddBlock(this.props.urlParam);
                         var modal = document.getElementById("editBlockFormM");
                        // modal.style.display = "none";
                        // $('.modal-backdrop').remove();
                        // $("#editBlockFormM .close").click();
                        // window.location.reload();

                      }
                      // swal("Thank you. Your Block is Created.");

                     
                    })
                  .catch(function(error){
                      console.log(error);
                        
                  })
          }
            this.setState({
                displayBrand        : true,
                displayWishlist     : true,
                displayRating       : true,
                displayFeature      : '',
                displayAssurenceIcon: true,
                displayCategory     : true,
                displaySubCategory  : true,
                displaySection      : true,
                blockTitle 		    : '',
                blockApi 		    : '',
                totalProducts 	    : '',
                showTitle           : '',                showCarousel        : true,
                noOfProductPerLGRow : '',
                noOfProductPerMDRow : '',
                noOfProductPerSMRow : '',
                noOfProductPerXSRow : '',
            });	    	 
        })
        .catch(function (error) {        
            console.log(error);
        });
    }
    
    updateBlockInfo(event){
        event.preventDefault();
        var urlParam = this.state.urlParam;
        console.log("urlParam===",urlParam);
        var formValues = {
            blockType : "eCommBlock",
            blockTitle: this.state.blockTitle,
            blockSettings : {
                blockTitle 		    : this.state.blockTitle,
                blockApi 		    : this.state.blockApi,
                totalProducts 	    : this.state.totalProducts,
                showTitle           : this.state.showTitle,
                showCarousel        : this.state.showCarousel,
                leftSideFilters     : this.state.leftSideFilters,
                noOfProductPerLGRow : this.state.noOfProductPerLGRow,
                noOfProductPerMDRow : this.state.noOfProductPerMDRow,
                noOfProductPerSMRow : this.state.noOfProductPerSMRow,
                noOfProductPerXSRow : this.state.noOfProductPerXSRow,
            },
            productSettings : {
                displayBrand        : this.state.displayBrand,
                displayWishlist     : this.state.displayWishlist,
                displayRating       : this.state.displayRating,
                displayFeature      : this.state.displayFeature,
                displayAssurenceIcon: this.state.displayAssurenceIcon,
                displayCategory     : this.state.displayCategory,
                displaySubCategory  : this.state.displaySubCategory,
                displaySection      : this.state.displaySection,                
            },
            user_ID             : localStorage.getItem('user_ID'),
        };
        axios.patch('/api/blocks/patch/'+this.state.block_id,formValues)
		  .then( (response)=> {
          var modal = document.getElementById("editBlockFormM");
          modal.style.display = "none";
          $('.modal-backdrop').remove();
          $("#editBlockFormM .close").click();
          console.log("this.props",this.props);

          this.props.pageAddBlock(urlParam);
        //   window.location.reload();

		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
    }

    // Filter settings functions
    submitfilterInfo(event){
        event.preventDefault();
        var formValues = {
            filterLabel : this.state.filterLabel,
            dbFeildName : this.state.dbFeildName,
        }
        // console.log("FormValues==================",formValues,this.state.blockId);
        axios.patch('/api/blocks/update/'+this.state.block_id,formValues)
		.then( (response)=> {	
            // this.props.history.push("/cms/view-blocks");
            swal("Thank you. Filter added successfuly.");	
            this.getFilterData();
            this.setState({                
                filterLabel : '',
                dbFeildName : '',
            });	    	 
        })
        .catch(function (error) {        
            console.log(error);
        });
    }
    getFilterData(){
        axios.get('/api/blocks/getFilter/'+this.state.block_id)
		.then( (response)=> {	
            console.log("filter response.data===",response.data);
            this.setState({                
                filterData: response.data.filterSettings,
            });	    
            console.log("filter response.data===",response.data);	 
        })
        .catch(function (error) {        
            console.log(error);
        });
    }
    updatefilterInfo(event){
        event.preventDefault();
    }
    RemovefromFilterList(){

    }
    showPage(){
        window.location.reload();
    }
	render() {
		return (
			<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 createECommForm">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bglightgclr">
                        <form className="eCommBlockForm">  
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NoPadding productSettingsBlock">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding productSettingsTitle">Product Settings</div> 
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">
                                        <div className="form-group">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Brand<span className="astrick"></span></label>
                                            {/* <label class="switch col-lg-5 col-md-5 col-sm-5 col-sm-5 ">
                                                <input type="checkbox" checked={this.state.displayBrand} id="displayBrand" name="displayBrand" ref="displayBrand" onChange={this.handleChange.bind(this)} className="toggleButton NOpadding"  />
                                                <span class="slider round"></span>    
                                            </label>   */}
                                            <Switch                                                
                                                checked={this.state.displayBrand}                                                
                                                id="displayBrand"
                                                onChange={(event) => { this.setState({"displayBrand": this.state.displayBrand===true?false:true}
                                                ,() => {
                                                    // console.log("display brand:",this.state.displayBrand);
                                                    })
                                                }}
                                                // checkedIcon={
                                                //     <div style={textSwitch}>Yes</div>
                                                // }
                                                // uncheckedIcon={
                                                //     <div style={textSwitch}>No</div>
                                                // }
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Wishlist<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.displayWishlist}                                   
                                                onChange={(event) => { this.setState({"displayWishlist": this.state.displayWishlist===true?false:true}
                                                ,() => {
                                                    console.log("displayWishlist:",this.state.displayWishlist);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>                                    
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Ratings<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.displayRating}                                   
                                                onChange={(event) => { this.setState({"displayRating": this.state.displayRating===true?false:true}
                                                ,() => {
                                                    console.log("displayWishlist:",this.state.displayRating);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />                               
                                        </div>                                      
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Assurance Icon<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.displayAssurenceIcon}                                   
                                                onChange={(event) => { this.setState({"displayAssurenceIcon": this.state.displayAssurenceIcon===true?false:true}
                                                ,() => {
                                                    console.log("displayAssurenceIcon:",this.state.displayAssurenceIcon);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>
                                    
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Category<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.displayCategory}                                   
                                                onChange={(event) => { this.setState({"displayCategory": this.state.displayCategory===true?false:true}
                                                ,() => {
                                                    // console.log("displayCategory:",this.state.displayCategory);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display SubCategory<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.displaySubCategory}                                   
                                                onChange={(event) => { this.setState({"displaySubCategory": this.state.displaySubCategory===true?false:true}
                                                ,() => {
                                                    // console.log("displaySubCategory:",this.state.displaySubCategory);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Section<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.displaySection}                                   
                                                onChange={(event) => { this.setState({"displaySection": this.state.displaySection===true?false:true}
                                                ,() => {
                                                    // console.log("displaySection:",this.state.displaySection);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>  
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Display Feature<span className="astrick"></span></label>
                                            <input type="text" ref="displayFeature" id="displayFeature" value={this.state.displayFeature} name="displayFeature"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>                                  
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NoPadding blockSettingsBlock">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding blockSettingsTitle">Block Settings</div> 
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Block Title<span className="astrick"></span></label>
                                            <input type="text" ref="blockTitle" id="blockTitle" value={this.state.blockTitle} name="blockTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Block API<span className="astrick"></span></label>
                                            <input type="text" ref="blockApi" id="blockApi" value={this.state.blockApi} name="blockApi"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Total Products<span className="astrick"></span></label>
                                            <input type="text" ref="totalProducts" id="totalProducts" value={this.state.totalProducts} name="totalProducts"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>     
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Block Title<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showTitle}                                   
                                                onChange={(event) => { this.setState({"showTitle": this.state.showTitle===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div>                                
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Carousel<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.showCarousel}                                   
                                                onChange={(event) => { this.setState({"showCarousel": this.state.showCarousel===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div> 
                                    { this.state.showCarousel === false?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 toggleWrapper">                                        
                                        <div className="form-group ">
                                            <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Display Left Side Filters<span className="astrick"></span></label>
                                            <Switch                                                
                                                checked={this.state.leftSideFilters}                                   
                                                onChange={(event) => { this.setState({"leftSideFilters": this.state.leftSideFilters===true?false:true}
                                                ,() => {
                                                    // console.log("showCarousel:",this.state.showCarousel);
                                                    })
                                                }}
                                                onColor={'#5CB85C'}
                                                offColor={'#D9534F'}
                                                height={25}
                                                width={60}
                                            />
                                        </div>                                      
                                    </div> 
                                    :null
                                    }
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Product Per LG Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfProductPerLGRow" id="noOfProductPerLGRow" value={this.state.noOfProductPerLGRow} name="noOfProductPerLGRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Product Per MD Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfProductPerMDRow" id="noOfProductPerMDRow" value={this.state.noOfProductPerMDRow} name="noOfProductPerMDRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Product Per SM Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfProductPerSMRow" id="noOfProductPerSMRow" value={this.state.noOfProductPerSMRow} name="noOfProductPerSMRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Number Of Product Per XS Row<span className="astrick"></span></label>
                                            <input type="number" ref="noOfProductPerXSRow" id="noOfProductPerXSRow" value={this.state.noOfProductPerXSRow} name="noOfProductPerXSRow"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtnWrapper">
                                {
                                    this.state.EditBlock
                                    ?
                                    <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.updateBlockInfo.bind(this)}>Update</button>
                                    :
                                    <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.submitBlockInfo.bind(this)}>Submit</button>
                                }
                            </div>
                            { this.state.leftSideFilters === true?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding filterSettingsBlock">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding productSettingsTitle">Filter Settings</div> 
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 inputWraper ">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Filter Label<span className="astrick"></span></label>
                                            <input type="text" ref="filterLabel" id="filterLabel" value={this.state.filterLabel} name="filterLabel"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Database Feild Name <span className="astrick"></span></label>
                                            <input type="text" ref="dbFeildName" id="dbFeildName" value={this.state.dbFeildName} name="dbFeildName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                        </div>
                                    </div>
                                
                                    <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12 filterSubmitBtn">
                                        {
                                            this.state.EditBlock
                                            ?
                                            <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.updatefilterInfo.bind(this)}>Update</button>
                                            :
                                            <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.submitfilterInfo.bind(this)}>Add</button>
                                        }
                                    </div>

                                    {/* Filter settings */}
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                                  
                                        <table className="table galleryTable table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="itemth">Sr. No</th>
                                                    <th>Feild Name</th>
                                                    <th>Database feild Name</th>
                                                    <th>Action</th>                                            
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {
                                            Array.isArray(this.state.filterData) && this.state.filterData.map((data, index)=>{                                                
                                                return(
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                                                {index+1}
                                                            </div>
                                                        </td>                                                    
                                                        <td>
                                                                <div>{data.filterLabel}</div>
                                                        </td>
                                                        <td>
                                                                <div>{data.dbFeildName}</div>
                                                        </td>
                                                        <td>
                                                            <span className="fa fa-trash trashIcon" id={data._id} onClick={this.RemovefromFilterList.bind(this)}><a href="/" style={{color:"#337ab7"}} > </a></span>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtnWrapper">                                        
                                        <button  type="button" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.showPage.bind(this)}>Update</button>
                                    </div>
                                    </div>
                                </div> 
                            :null
                            }
                        </form>
                    </div>
                </div>
            </div>
		);
	}
}

export default CreateECommblockForm;
