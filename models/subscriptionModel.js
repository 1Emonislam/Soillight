const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;
const subscriptionSchema = mongoose.Schema({
    amount: {
        type: Number,
        require: [true, "Amount is required!"]
    },
    duration: {
        type: String,
        require: [true, "Duration is required!"]
    },
    status:{
        type: String,
        default:'pending'
    },
    transaction_id: {
        type: String,
        require: [true, "Transaction is required!"]
    },
    tx_ref: {
        type: String,
        require: [true, "Tax Ref is required!"]
    },
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user ID"],
        ref: 'User',
    }
}, { timestamps: true })
const Subscription = mongoose.model("Subscription", subscriptionSchema)
module.exports = Subscription;