const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please write a unique product name!']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: false
    },
    pack_type: {
        type: String,
        required: [true, 'Please select a pack type!']
    },
    serving_size: {
        type: String,
        required: [true, 'Please select a serving size!']
    },
    status: {
        type: String,
        default: 'pending'
    },
    quantity: {
        type: Number,
        default: 1,
    },
    price: {
        type: Number,
        required: [true, 'Please select a product price!']
    },
    img: {
        type: String,
        required: [true, 'Please select a product Image!']
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user ID"]
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductReview'
    }],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
)
const Product = mongoose.model('Product', productSchema);
module.exports = Product;