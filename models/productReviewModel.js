const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const productReviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
}, { timestamps: true });
const ProductReview = mongoose.model('ProductReview', productReviewSchema);
module.exports = ProductReview;