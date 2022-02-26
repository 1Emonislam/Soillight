const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please select a product name!']
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Please select a category!']
    },
    subCategory: {
        type: String,
        trim: true,
        required: [true, 'Please select a sub category!']
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
        get: (v) => (v / 100).toFixed(2),
        set: (v) => v * 100,
        required: [true, 'Please select a product price!']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user ID"]
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
},
    {
        toJSON: { getters: true }
    },
    { timestamps: true }
)
const Product = mongoose.model('Product', productSchema);
module.exports = Product;