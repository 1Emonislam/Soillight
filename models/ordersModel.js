const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;
const geometrySchema = new Schema({
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
    location: {
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        }
    },
    geometry: geometrySchema,
    transaction_id: {
        type: String,
    },
    tx_ref: {
        type: String,
    },
    currentStatus: {
        type: String,
        default: 'progress'
    },
    buyerUpdatedStatus: {
        type: String,
        default: "progress"
    },
    sellerUpdatedStatus: {
        type: String,
        default: "progress"
    },
    riderUpdatedStatus: {
        type: String,
        default: "progress"
    },
    adminUpdatedStatus: {
        type: String,
        default: "progress"
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
    }],

}, { timestamps: true })
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;