const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	_id			              : mongoose.Schema.Types.ObjectId,
    orderID                   : Number,
    numericOrderID            : Number,
    billNumber                : Number,
    user_ID                   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    userName                  : String,
    userFullName              : String,
    emailID                   : String,
    franchiseCustId           : { type: mongoose.Schema.Types.ObjectId, ref: 'franchisecustomers' },
    allocatedToFranchise      : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },

    paymentDetails            :{
        beforeDiscountTotal       : Number,
        discountAmount            : Number,
        afterDiscountTotal        : Number,
        disocuntCoupon_id         : { type: mongoose.Schema.Types.ObjectId, ref: 'coupon' }, 
        discountCouponPercent     : Number,
        discountCouponAmount      : Number,
        afterDiscountCouponAmount : Number,
        couponCancelMessage       : String,
        taxAmount                 : Number,
        shippingCharges           : Number,
        netPayableAmount          : Number,  //NetPayableAmount = afterDiscountCouponAmount + taxAmount + shippingCharges
        currency                  : String,
        payment_TransactionID     : Number,
        payment_response_code     : String,
        payment_response_message  : String,
        payment_reference_no      : String,
        payment_status            : String,  // paid, unpaid
        paymentMethod             : String,
    },

    customerShippingTime      : String,
    order_numberOfProducts    : Number, //Sum of all number of products in all vendors
    order_quantityOfProducts  : Number, //Sum of total quantity of items in each vendor
    orderStatus               : String, //New, Delivered, Cancelled


    vendorOrders : [
        {
            vendor_id           : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
            vendorLocation_id   : String,
            vendorName          : String,
            products            : [
                {
                    "product_ID"        : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
                    "productName"       : String,
                    "productNameRlang"  : String,
                    "originalPrice"     : Number,
                    "discountPercent"   : Number,
                    "discountedPrice"   : Number,
                    "savedAmount"       : Number,
                    "color"             : String,
                    "size"              : String,
                    "unit"              : String,
                    "currency"          : String,
                    "quantity"          : Number,
                    "subTotal"          : Number,
                    "SGST"              : Number,
                    "CGST"              : Number,
                    "SGSTAmt"           : Number,
                    "CGSTAmt"           : Number,
                    "productImage"      : Array,
                    "section_ID"        : { type: mongoose.Schema.Types.ObjectId, ref: 'section' },
                    "section"           : String,
                    "category_ID"       : { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
                    "vendor_ID"         : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
                    "category"          : String,
                    "subCategory_ID"    : String,
                    "subCategory"       : String,
                    "productStatus"     : String,
                    "returnedDate"      : Date
                }
            ],
            orderStatus               : String,  //new,verified,packing,inspection,dispatched,delivered,cancelled
            delivery_person_id        : { type: mongoose.Schema.Types.ObjectId, ref: 'businessAssociate' }, 
            delivery_person_name      : String,

            returnedProduct           : Array, // Array of Products returned by customer
            vendor_numberOfProducts   : Number,  //Number of products. 
            vendor_quantityOfProducts : Number,  //Quantity in each product. 1 product may have 5 quantity                
            vendor_beforeDiscountTotal: Number,
            vendor_discountAmount     : Number,
            vendor_afterDiscountTotal : Number,
            vendor_taxAmount          : Number,
            vendor_shippingCharges    : Number,
            deliveryStatus            : [{
                "status"          : String,  //Only 4 status to be shown to user: New, Packaging, Dispatched, Delivered
                "timestamp"       : Date,
                "statusUpdatedBy" : String,
                "expDeliveryDate" : Date,
            }], 
        }

    ],
    deliveryAddress           : {
                                    "name"            : String,
                                    "email"           : String,
                                    "addressLine1"    : String,
                                    "addressLine2"    : String,
                                    "pincode"         : String,
                                    "city"            : String,
                                    "district"        : String,
                                    "stateCode"       : String,
                                    "state"           : String,
                                    "mobileNumber"    : String,
                                    "countryCode"     : String,
                                    "country"         : String,
                                    "addType"         : String,
                                    "latitude"        : Number,
                                    "longitude"       : Number,
                                },
    createdBy                 : String,
    createdAt                 : Date
});

module.exports = mongoose.model('order',orderSchema);