const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const UserReviewsSchema = mongoose.Schema({
    name: { type: String, required: true },
    role: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
        required: true
    },
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
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },

}, { timestamps: true });
const UserReviews = mongoose.model('UserReviewsSchema', UserReviewsSchema);
module.exports = UserReviews;