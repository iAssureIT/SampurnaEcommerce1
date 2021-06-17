import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';

class WebsiteLogo extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
            CompanyLogo : '',
         }
    }    
    componentDidMount(){
        axios.get("/api/entitymaster/getCompany/1")
            .then((response) => {
                if(response.data){
                    // console.log("CompanySettings--",response.data);
                    this.setState({
                        CompanyLogo : response.data.companyLogo[0]
                    },()=>{
                        // console.log("CompanyLogo==",this.state.CompanyLogo);
                    });
                }
            })
            .catch((error) => {
            console.log("get comapany deatails error",error);
            })

    }

   render(){
        return(  
            <div className="col-12 mr-6 mt-2 logoBlock NoPadding">
                {/* <Link href="/">
                    <a title="navbar-brand Sitelogo ">
                        <Image
                            src={this.state.CompanyLogo ? this.state.CompanyLogo : "/images/eCommerce/multistoreLogo.png"}
                            className={"logoImg hidden-x"}
                            height ={40}
                            width={170}
                            layout={'intrinsic'}
                        />
                    </a>
                </Link> */}
                <a href="/" title="navbar-brand Sitelogo ">
                    <Image
                        src={this.state.CompanyLogo ? this.state.CompanyLogo : "/images/eCommerce/loading.gif"}
                        className={"logoImg hidden-x"}
                        height ={40}
                        width={170}
                        layout={'intrinsic'}
                    />
                </a>
            </div>
        );        
    }
} 
  export default WebsiteLogo;