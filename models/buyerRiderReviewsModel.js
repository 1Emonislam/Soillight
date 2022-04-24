const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const BuyerReviewsSchema = mongoose.Schema({
    name: { type: String, required: true },
    role: {
        type: String,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    reviewSender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    reviewReceiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const BuyerReviews = mongoose.model('BuyerReviewsSchema', BuyerReviewsSchema);
const RiderReviewsSchema = mongoose.Schema({
    name: { type: String, required: true },
    role: {
        type: String,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    reviewSender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    reviewReceiverOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true });
const RiderReviews = mongoose.model('RiderReviews', RiderReviewsSchema);
module.exports = {
    BuyerReviews,
    RiderReviews
};