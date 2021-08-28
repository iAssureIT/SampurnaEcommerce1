import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import S3FileUpload         from 'react-s3';
import IAssureTable         from "../../CategoryTable/IAssureTable.jsx";
import 'jquery-validation';
import 'bootstrap/js/tab.js';
import '../css/SectionManagement.css';


class SectionManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "addEditMode"   : "",
            "tableHeading"  : {
                // section     : "Section",
                section     : "Section Title",
                sectionRank : "Section Rank",
                // actions     : 'Action',
            },
            "tableObjects"  : {
                deleteMethod    : 'delete',
                apiLink         : '/api/sections',
                paginationApply : true,
                searchApply     : false,
                editUrl         : '/project-master-data/',
                patchStatusUrl  : '/api/sections/patch/status',
                getOneUrl       : '/api/sections/get/one/',
                type            : 'Sections',
                showAction 		: true,
                checkbox 		: false,
                deleteConfirmation : "If you delete this 'Section' all the 'Categories', 'SubCategories' and 'Products' associated with this section will get deleted."
            },
            "startRange"    : 0,
            "limitRange"    : 10,
            "editId"        : this.props.editId ? this.props.editId : '',
            "tableName"     : 'Section-mgmt'
        };
    }

    /** =========== handleChange =========== */
    handleChange(event) {
        const target    = event.target;
        const name      = target.name;
        this.setState({
            [name]  : event.target.value,
        });
    }

    /** =========== componentWillReceiveProps =========== */
    componentWillReceiveProps(nextProps) {
        // var editId = nextProps.editId;
        // if (editId) {
        //     this.setState({
        //         editId: editId
        //     })
        //     this.edit(editId);
        // }
        if(nextProps && nextProps.editId && nextProps.editId !== undefined &&  nextProps.history.location.pathname !== "/project-master-data"){      
            this.setState({
                editId : nextProps.editId
            },()=>{
                this.edit(this.state.editId);
            })
        }
    }

    /** =========== componentDidMount =========== */
    componentDidMount() {
        var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
        var token         = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

        var user_ID = userDetails.user_id;
        this.setState({
            user_ID : user_ID,
            editId  : this.props.editId
        },()=>{
            // console.log("this.state.editId = ",this.state.editId);
        })

        window.scrollTo(0, 0);

        var inputBox        = document.getElementById("sectionRank");
        var invalidChars    = ["-","+","e"];

        inputBox.addEventListener("keydown", function(e) {
            if (invalidChars.includes(e.key)) {
                e.preventDefault();
            }
        });

        if (this.props.editId) {
            this.edit(this.props.editId);
        }
        
        $.validator.addMethod("letterswithspace", function(value, element) {
            console.log("element => ",element);
            var test = /^[a-zA-Z]*$/g.test(value);
            console.log("test => ",test);

            this.optional(element) || /^[a-z][a-z\s]*$/i.test(value);
        }, "Please enter letters only");

        $.validator.addMethod("charactersLength", function(value, element) {
            return this.optional(element) || value.length <= 128;
        }, "Please enter less than 128 characters.");
        

        $.validator.addMethod("digitsLength", function(value, element) {
            return this.optional(element) || value.length <= 5;
        }, "Please enter max 5 digits only.");

        $.validator.addMethod("digitsOnly", function(value, element) {
            return this.optional(element) || /^[0-9]*$/.test(value);
        }, "Decimal is not accepted.");



        $.validator.setDefaults({
            debug  : true,
            success: "valid"
        });

        $("#sectionManagement").validate({
            rules: {
                section: {
                    required            : true,
                    // letterswithspace    : true,
                    // number          : false,
                    // charactersLength    : true
                },
                sectionRank: {
                    required        : true,
                    number          : true,
                    digitsLength    : true,
                    digitsOnly      :true
                },
                sectionImage: {
                    required        : true,
                },
                // /^[^-\s][a-zA-Z0-9_\s-]+$/
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") === "section") {
                    error.insertAfter("#section");
                }
                if (element.attr("name") === "sectionRank") {
                    error.insertAfter("#sectionRank");
                }
                if (element.attr("name") === "sectionImage") {
                    error.insertAfter("#sectionImage");
                }
            }
        });

        this.getDataCount();
        this.getData(this.state.startRange, this.state.limitRange);
    }

    getDataCount() {
        axios.get('/api/sections/get/count')
        .then((response) => {
            console.log('section dataCount', response.data);
            this.setState({
                dataCount: response.data.dataCount
            })
        })
        .catch((error) => {
            console.log('error', error);
            if(error.message === "Request failed with status code 401"){
                localStorage.removeItem("userDetails");
                localStorage.clear();
                swal({  
                    title : "Your Session is Expired.",                
                    text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
                })
                .then(okay => {
                    if (okay) {
                        window.location.href = "/login";
                    }
                });
            }
        });
    }

    getData(startRange, limitRange) {
        axios.get('/api/sections/get/list-with-limits/' + startRange + '/' + limitRange)
        .then((response) => {
            console.log('tableData = ', response.data);
            var tableData = response.data.map((a, i)=>{                      
				return{ 
                    _id         : a._id,
                    section     : a.section,
                    sectionRank : "<div class=textAlignCenter >" + a.sectionRank + "</div>",
                    status      : a.status,
                }
            })
            this.setState({
                tableData: tableData
            })
        })
        .catch((error) => {
            console.log('error', error);
            if(error.message === "Request failed with status code 401"){
                localStorage.removeItem("userDetails");
                localStorage.clear();
                swal({  
                    title : "Your Session is Expired.",                
                    text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
                })
                .then(okay => {
                    if (okay) {
                        window.location.href = "/login";
                    }
                });
            }
        });
    }

    submitsection(event) {
        // console.log("inside submit----");
        event.preventDefault();
        if ($('#sectionManagement').valid()) {            
            
            var formValues = {
                "section"       : this.state.section,
                "sectionRank"   : this.state.sectionRank,
                "createdBy"     : this.state.user_ID,
                "sectionImage"  : this.state.sectionImage
            }
            // console.log("section----",formValues);
            axios.post('/api/sections/post', formValues)
            .then((response) => {
                /* swal({text: response.data.message,});*/
                swal(" ",(response.data.message ));

                this.setState({
                    "section"               : '',
                    "sectionUrl"            : '',
                    "addEditModeSubsection" : '',
                    "sectionRank"           : '',
                    "sectionImage"          :''
                });
                // window.location.reload();
                this.getData(this.state.startRange, this.state.limitRange);
            })
            .catch((error) => {
                console.log('error', error);
                if(error.message === "Request failed with status code 401"){
                    localStorage.removeItem("userDetails");
                    localStorage.clear();
                    swal({  
                        title : "Your Session is Expired.",                
                        text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
                    })
                    .then(okay => {
                        if (okay) {
                            window.location.href = "/login";
                        }
                    });
                }
            });
        }
    }

    
    updatesection(event) {
        event.preventDefault();
        if ($('#sectionManagement').valid()) {
            var formValues = {
                "sectionID"     : this.state.editId,
                "section"       : this.state.section,
                "sectionRank"   : this.state.sectionRank,
                "sectionImage"  : this.state.sectionImage
            }
            // console.log('form', formValues);
            axios.patch('/api/sections/patch', formValues)
            .then((response) => {
                swal({
                    text: response.data.message,
                }).then(okay => {
                    if (okay) {
                        this.props.history.push('/project-master-data');
                        // window.location.href ='/project-master-data';
                    }
                });
                this.getData(this.state.startRange, this.state.limitRange);
                this.setState({
                    "section"       : '',
                    "sectionUrl"    : '',
                    "editId"        : '',
                    "sectionRank"   : '',
                    "sectionImage"  : ''          
                });                
                
            })
            .catch((error) => {
                console.log('error', error);
                if(error.message === "Request failed with status code 401"){
                    localStorage.removeItem("userDetails");
                    localStorage.clear();
                    swal({  
                        title : "Your Session is Expired.",                
                        text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
                    })
                    .then(okay => {
                        if (okay) {
                            window.location.href = "/login";
                        }
                    });
                }
            });
        }
    }

    edit(id) {
        axios.get('/api/sections/get/one/' + id)
        .then((response) => {
            // console.log('edit = ', response.data);
            if (response.data) {
                this.setState({
                    "section"       : response.data.section,
                    "sectionRank"   : response.data.sectionRank,
                    "sectionUrl"    : response.data.sectionUrl,
                    "sectionImage"  : response.data.sectionImage
                });
            }
        })
        .catch((error) => {
            console.log('error', error);
            if(error.message === "Request failed with status code 401"){
                localStorage.clear();
                swal({  
                    title : "Your Session is Expired.",                
                    text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
                })
                .then(okay => {
                    if (okay) {
                        window.location.href = "/login";
                    }
                });
            }
        });
    }

    createsectionUrl(event) {
        const target    = event.target;
        const name      = target.name;

        this.setState({
            [name]: event.target.value,
        });
        var url = event.target.value;
        // console.log('url',url);
        if (url) {
            url = url.replace(/\s+/g, '-').toLowerCase();
            // $(".productUrl").val(url);
            this.setState({
                sectionUrl: url
            })
        }else{
            this.setState({
                sectionUrl: ''
            })
        }
    }

    uploadImage(event){
        event.preventDefault();
        var sectionImage = "";

        if (event.currentTarget.files && event.currentTarget.files[0]) {
            // for(var i=0; i<event.currentTarget.files.length; i++){
                var file = event.currentTarget.files[0];
                if (file) {
                    var fileName    = file.name; 
                    var ext         = fileName.split('.').pop(); 

                    if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="webp" || ext==="WEBP" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
                        if (file) {
                            var objTitle = { fileInfo :file }
                            sectionImage = objTitle ;
                            
                        }else{          
                            swal("Images not uploaded");  
                        }//file
                    }else{ 
                        swal("Allowed images formats are (jpg,png,jpeg)");   
                    }//file types
                }//file
            // }//for 

            if(event.currentTarget.files){
                this.setState({
                    sectionImage : sectionImage
                });  
                main().then(formValues=>{
                    this.setState({
                        sectionImage : formValues.sectionImage
                    })
                });

                async function main(){
                    var config  = await getConfig();
                    var s3url   = await s3upload(sectionImage.fileInfo, config, this);

                    const formValues = {
                        "sectionImage"    : s3url,
                        "status"          : "New"
                    };    
                    return Promise.resolve(formValues);
                }

                function s3upload(image,configuration){
                    return new Promise(function(resolve,reject){
                        S3FileUpload
                        .uploadFile(image,configuration)
                        .then((Data)=>{
                            resolve(Data.location);
                        })
                        .catch((error)=>{
                            console.log(error);
                            if(error.message === "Request failed with status code 401"){
                                localStorage.clear();
                                swal({  
                                    title : "Your Session is Expired.",                
                                    text  : "You need to Login Again. Click 'OK' to Go to Login Page"
                                })
                                .then(okay => {
                                    if (okay) {
                                        window.location.href = "/login";
                                    }
                                });
                            }
                        })
                    })
                }  

                function getConfig(){
                    return new Promise(function(resolve,reject){
                        axios
                        // .get('/api/projectSettings/get/one/s3')
                        .get('/api/projectSettings/get/S3')
                        .then((response)=>{
                        // console.log("s3 response :",response.data);
                            const config = {
                                bucketName      : response.data.bucket,
                                dirName         : process.env.ENVIRONMENT,
                                region          : response.data.region,
                                accessKeyId     : response.data.key,
                                secretAccessKey : response.data.secret,
                            }
                            resolve(config);                           
                        })
                        .catch(function(error){
                            console.log(error);
                            if(error.message === "Request failed with status code 401"){
                                localStorage.removeItem("userDetails");
                                localStorage.clear();
                                swal({  
                                    title : "Your Session is Expired.",                
                                    text  : "You need to Login Again. Click 'OK' to Go to Login Page"
                                })
                                .then(okay => {
                                    if (okay) {
                                        window.location.href = "/login";
                                    }
                                });
                            }
                        })        
                    })
                }        
            }
        }
    }

    deleteImage(event){
		event.preventDefault();
		this.setState({
		  sectionImage : ""
		})
	}

    // deleteImage(event){     
    //     var id                  = event.target.id;
    //     var productImageArray   = this.state.productImageArray;
    //     // console.log('productImage', productImageArray, id);

    //     if(productImageArray && productImageArray > 0) {
    //         productImageArray.splice(productImageArray.findIndex(v => v == id), 1);
    //         this.setState({
    //             sectionImage        : "",
    //             productImageArray   : productImageArray
    //         },()=>{
    //             // console.log('subcatgArr', this.state.subcatgArr);
    //         });
    //     }
    // }

    selectedProducts(checkedProductsList) {
        // console.log('checkedUsersList', checkedUsersList);
        this.setState({
            checkedProducts: checkedProductsList,
            messageData: {}
        })

        // console.log("this.state.checkedUser",this.state.checkedUser);
    }

    setunCheckedProducts(value) {
        this.setState({
            unCheckedProducts: value,
            messageData: {}
        })
    }



    render() {
        return (
            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <div className="formWrapper">
                            <section className="content">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                                    <div className="">
                                        <div className="">
                                            <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                                <h4 className="weighttitle NOpadding-right">Section Master </h4>
                                            </div>
                                        
                                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding formContent">
                                                <form id="sectionManagement" className="">
                                                    <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 fieldWrapper NOpadding-right">
                                                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                                            <label>Section Title <i className="redFont">*</i></label>
                                                            <input value={this.state.section} name="section" id="section" onChange={this.createsectionUrl.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Section Title" ref="section" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 fieldWrapper NOpadding-left">
                                                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                                            <label>Section URL {/*<i className="redFont">*</i> */}</label>
                                                            <input disabled value={this.state.sectionUrl} onChange={this.handleChange.bind(this)} id="sectionUrl" name="sectionUrl" type="text" className="form-control sectionUrl" placeholder="Section URL" ref="sectionUrl" />
                                                        </div>                            
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 fieldWrapperSectionRank">
                                                        <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                                            <label>Section Rank <i className="redFont">*</i></label>                                                                    
                                                            <input value={this.state.sectionRank} onChange={this.handleChange.bind(this)} id="sectionRank" name="sectionRank" type="number" className="form-control sectionRank" placeholder="Section Rank" ref="sectionRank" min="1"  required/>
                                                        </div>                          
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 fieldWrapper">
                                                        <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                                            <label>Section Image <i className="redFont">*</i></label>                                                                              
                                                            {this.state.sectionImage 
                                                            ?
                                                                null
                                                            :                                                    
                                                                <div className="divideCatgRows categoryImgWrapper">
                                                                    {/* <label>Category Image</label>                                                                     */}
                                                                    <input type="file" onChange={this.uploadImage.bind(this)} title="Click to upload section image" className="" accept=".jpg,.jpeg,.png,.webp" id="sectionImage" name="sectionImage" />
                                                                </div>
                                                            }
                                                            {this.state.sectionImage 
                                                            ? 
                                                                <div className="row">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 productImgCol">
                                                                        <div className="imageDiv">
                                                                            <div className="prodImageInner">
                                                                                <span className="prodImageCross" title="Delete" data-imageUrl={this.state.sectionImage} onClick={this.deleteImage.bind(this)} >x</span>
                                                                            </div>
                                                                            {console.log("this.state.sectionImage => ",this.state.sectionImage)}
                                                                            <img title="view Image" alt="Please wait..." src={this.state.sectionImage ? this.state.sectionImage : "/images/notavailable.jpg"} className="img-responsive" />
                                                                        </div>    
                                                                    </div>
                                                                </div>
                                                                :
                                                                    null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBottom30">
                                                        {/* <div className=""> */}
                                                            
                                                            {this.state.editId 
                                                            ?
                                                                <button onClick={this.updatesection.bind(this)} className="btn button3 pull-right">Update</button>
                                                            :
                                                                <button onClick={this.submitsection.bind(this)} className="btn button3 pull-right">Submit</button>
                                                            }
                                                        {/* </div> */}
                                                    </div>                                         
                                                </form>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                                                <IAssureTable
                                                    tableHeading    = {this.state.tableHeading}
                                                    twoLevelHeader  = {this.state.twoLevelHeader}
                                                    dataCount       = {this.state.dataCount}
                                                    tableData       = {this.state.tableData}
                                                    getData         = {this.getData.bind(this)}
                                                    tableObjects    = {this.state.tableObjects}
                                                    tableName       = {this.state.tableName}
                                                    currentView     = {"Section-Management-table"}
                                                    selectedProducts={this.selectedProducts.bind(this)}
                                                    // getSearchText={this.getSearchText.bind(this)}
                                                    setunCheckedProducts={this.setunCheckedProducts.bind(this)}
                                                    unCheckedProducts={this.state.unCheckedProducts}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default SectionManagement;