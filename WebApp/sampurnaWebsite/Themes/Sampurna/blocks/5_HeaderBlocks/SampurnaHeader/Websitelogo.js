import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';


class WebsiteLogo extends React.Component{

	constructor(props){
		super(props);
		 this.state = {
            CompanyLogo : '',
         }
    }    

    async componentDidMount(){
        var sampurnaWebsiteDetailsVal = await Promise.resolve(JSON.parse(localStorage.getItem("sampurnaWebsiteDetails")));
        console.log("0 sampurnaWebsiteDetailsVal => ", sampurnaWebsiteDetailsVal );

        if(sampurnaWebsiteDetailsVal && sampurnaWebsiteDetailsVal.data && sampurnaWebsiteDetailsVal.data.CompanyLogo){
            console.log("1 sampurnaWebsiteDetailsVal => ", sampurnaWebsiteDetailsVal );
            this.setState({
                CompanyLogo : sampurnaWebsiteDetailsVal.data.CompanyLogo
            });        
        }else{
            console.log("2 sampurnaWebsiteDetailsVal => ", sampurnaWebsiteDetailsVal );

            axios.get("/api/entitymaster/getCompany/1")
                .then((response) => {
                    if(response.data){
                        this.setState({
                            CompanyLogo : response.data.companyLogo[0]
                        });
                        sampurnaWebsiteDetailsVal.data = {
                            CompanyLogo : response.data.companyLogo[0]
                        };
                        console.log("3 sampurnaWebsiteDetailsVal => ", sampurnaWebsiteDetailsVal );
                        localStorage.setItem("sampurnaWebsiteDetails",JSON.stringify(sampurnaWebsiteDetailsVal));
                    }
                })
                .catch((error) => {
                    console.log("get comapany deatails error",error);
                })
        }

        // console.log("*** Loaded WebsiteLogo ***");

    }

   render(){
        return(  
            <div className="col-12 mr-6 mt-2 logoBlock mobileNoPadding ">
                <a href="/" title="navbar-brand Sitelogo ">
                    <img
                        src={this.state.CompanyLogo ? this.state.CompanyLogo : "/images/eCommerce/TrollyLogo.png"}
                        className={"logoImg hidden-x"}
                        height ={40}
                        layout={'intrinsic'}
                    />
                </a>
            </div>
        );        
    }
}
 
export default WebsiteLogo;