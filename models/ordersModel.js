const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;
const orderSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user ID"]
    },
    location: {
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        }
    },
    transaction_id: {
        type: String,
    },
    tx_ref: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
    },
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
        }
    }],
}, { timestamps: true })
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;