import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

// export const Orders = new Mongo.Collection('orders');
export const Cart = new Mongo.Collection("cart");
export const Wishlist = new Mongo.Collection("wishlist");

if(Meteor.isServer){
    // Meteor.publish("OrdersData", (_id)=> {
    //     var orderData = Orders.find({});
    //     return orderData;
    // });
    Meteor.publish("productsCart", (_id)=> {
        var cartData = Cart.find({});
        return cartData;
    });
}