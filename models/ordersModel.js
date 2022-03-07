const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;
const orderSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user ID"]
    },
    transaction_id: {
        type: String,
    },
    tx_ref: {
        type: String,
    },
    products: [{
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