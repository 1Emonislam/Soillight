const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;
const subscriptionSchema = mongoose.Schema({
    amount: {
        type: Number,
        require: [true, "Amount is required!"]
    },
    duration: {
        type: Date,
        require: [true, "Duration is required!"]
    },
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user ID"],
        ref: 'User',
    }
}, { timestamps: true })
const Subscription = mongoose.model("Subscription", subscriptionSchema)
module.exports = Subscription;