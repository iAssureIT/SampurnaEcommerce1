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
                    console.log("CompanySettings--",response.data);
                    this.setState({
                        CompanyLogo : response.data.companyLogo[0]
                    },()=>{
                        console.log("CompanyLogo==",this.state.CompanyLogo);
                    });
                }
            })
            .catch((error) => {
            console.log("error1",error);
            })

    }

   render(){
        return(  
            <div className="col-4 col-sm-2 mr-4 logoBlock NoPadding">
                <Link href="/">
                    <a title="navbar-brand Sitelogo ">
                        <Image
                            src={this.state.CompanyLogo ? this.state.CompanyLogo : "/images/eCommerce/multistoreLogo.png"}
                            className={"img-responsive logoImg hidden-x"}
                            height ={30}
                            width={120}
                            layout="responsive"
                        />
                    </a>
                </Link>
            </div>
        );        
    }
} 
  export default WebsiteLogo;