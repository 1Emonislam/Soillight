const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const BuyerSellerRiderReviewsSchema = mongoose.Schema({
    name: { type: String, required: true },
    role: {
        type: String,
    },
    buyerMode: {
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    sellerMode: {
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    riderMode: {
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    adminMode: {
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    reviewSender: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }],
    reviewReceiverOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true });
const BuyerSellerRiderReviews = mongoose.model('BuyerSellerRiderReviews', BuyerSellerRiderReviewsSchema);
module.exports = BuyerSellerRiderReviews;