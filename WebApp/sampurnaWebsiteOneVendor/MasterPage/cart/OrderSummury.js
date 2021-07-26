import React, { Component } from 'react';
class OrderSummury extends Component{
    constructor(props) {
        super(props);
        this.state={
            vendorWiseCartData : {},
            discountdata : "Percent",
            discountdata : 5,
            discountvalue: 5

        }
    }

// static getDerivedStateFromProps(props, state) {
//     console.log("props ===",props.vendorWiseCartData );
//         return {
//             vendorWiseCartData: props.vendorWiseCartData,
//         };
//     // Return null if the state hasn't changed
//     return null;
// }
rendor(){
    // console.log("vendorWiseCartData===",this.state.vendorWiseCartData);
    return(
        <div className="col-12 cartSummary">
            <strong className="cartSummaryTitle"> vendor wise Summary</strong>
            <div className="col-12">
                <div className="row">
                    <table className="table table-responsive summaryTable">
                        <tbody>
                            {/* <tr>
                                <td>Cart Total</td>
                                <td className="textAlignRight">&nbsp; <i className={"fa fa-inr"}></i> {vendorWiseCartData.cartTotal > 0 ? parseInt(vendorWiseCartData.cartTotal) : 0.00} </td>
                            </tr>
                            <tr>
                                <td>Order Total</td>
                                <td className="textAlignRight">&nbsp; <i className={"fa fa-inr"}></i> {vendorWiseCartData.total > 0 ? parseInt(vendorWiseCartData.total) : 0.00} </td>
                            </tr>
                            <tr>
                                <td>Delivery Charges</td>
                                <td className="textAlignRight saving">&nbsp;{ 
                                    this.state.minvalueshipping > vendorWiseCartData.total ?
                                        // "This store requires minimum order of Rs."+this.state.minvalueshipping
                                        // "Make minimum purchase of Rs."+this.state.minvalueshipping+" to checkout your order."
                                        "No Delivery"
                                    :  
                                        "0.00"
                                    }
                                </td>
                            </tr> */}
                            {/* <tr>
                                <td>Discount {this.state.discountin === "Percent"?
                                                <span>  ({this.state.discountvalue > 1 ? this.state.discountvalue:null} %) </span>                                                                      
                                            :null
                                            } 
                                </td>    
                                <td className="textAlignRight saving">&nbsp; 
                                {this.state.discountvalue?
                                    <span> - &nbsp;
                                        {this.state.discountin === "Amount" ? 
                                            <span>
                                                <i className="fa fa-inr" /> 
                                                {this.state.discountvalue > 1 ? 
                                                    this.state.discountvalue 
                                                :  Number("0.00")
                                                } 
                                            </span>
                                        :   
                                            <span> 
                                                <i className="fa fa-inr" />                                                                       
                                                {this.state.discountvalue > 1 ? 
                                                    <span> {Math.floor((vendorWiseCartData.total > 0 ? parseInt(vendorWiseCartData.total) : 0.00) * this.state.discountvalue/100) } </span>
                                                :  Number("0.00")
                                                } 
                                            </span>
                                        }
                                    </span>
                                :"0.00"}
                                </td>
                            </tr> */}
                            {/* <tr>
                                <td>Tax</td>  
                                <td className="textAlignRight saving">&nbsp; 
                                    <span>
                                        {this.state.taxrate>0? 
                                            <span>+&nbsp;<i className="fa fa-inr" />
                                            {this.props.recentCartData.length > 0 ?
                                            this.state.discountdata !== undefined ?
                                                this.props.recentCartData.length > 0 && this.state.discountin === "Percent" ?
                                                    Math.round((parseInt(vendorWiseCartData.total) - (parseInt(vendorWiseCartData.total) * this.state.discountvalue / 100)) * this.state.taxrate/100)
                                                    :Math.round((parseInt(vendorWiseCartData.total) - this.state.discountvalue)*this.state.taxrate/100)
                                                : Math.round(parseInt(vendorWiseCartData.total)*this.state.taxrate/100)
                                            : "0.00"
                                            }
                                            </span>
                                            :"0.00"
                                        }
                                    </span>
                                </td>
                            </tr> */}
                            {/* <tr>
                                <td className="cartTotal">Grand Total</td>
                                <td className="textAlignRight cartTotal">&nbsp; <i className={"fa fa-inr"}></i>
                                {
                                    Math.round(
                                        Number( this.props.recentCartData.length > 0 ?
                                            this.state.discountdata !== undefined ?
                                                this.state.discountin === "Percent" ?                                                                        
                                                    parseInt(vendorWiseCartData.total) - (parseInt(vendorWiseCartData.total) * this.state.discountvalue / 100)
                                                    : parseInt(vendorWiseCartData.total) - this.state.discountvalue
                                            : parseInt(vendorWiseCartData.total)
                                            : "0.00"
                                        )                                                                
                                        +
                                        Number( this.state.taxrate>0?  
                                            this.props.recentCartData.length > 0 ?
                                                this.state.discountdata !== undefined ?
                                                    this.state.discountin === "Percent" ?
                                                        
                                                        Math.round((parseInt(vendorWiseCartData.total) - (parseInt(vendorWiseCartData.total) * this.state.discountvalue / 100)) * this.state.taxrate/100)
                                                    :
                                                        this.state.discountvalue>0?
                                                            Math.round((parseInt(vendorWiseCartData.total) - this.state.discountvalue)*this.state.taxrate/100) 
                                                        :"0.00"
                                                : 
                                                    Math.round(parseInt(vendorWiseCartData.total)*this.state.taxrate/100) 
                                            : 
                                                "0.00"
                                        :0.00
                                        )
                                    )
                                    }                                 
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    )
}
}

export default OrderSummury;