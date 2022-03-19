const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;
const LocationSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});
const orderSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user ID"]
    },
    location: LocationSchema,
    transaction_id: {
        type: String,
    },
    tx_ref: {
        type: String,
    },
    status: {
        type: String,
    },
    userType: {
        type: String,
        enum: ['admin', 'rider', 'seller', 'buyer', 'user'],
        default: 'user',
    },
    statusUpdatedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    products: [{
        productOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Please provide user ID"]
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
        },
        price: {
            type: Number
        },
        status: {
            default: progress
        }
    }],
}, { timestamps: true })
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;