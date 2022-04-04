const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const categoryCollectionSchema = mongoose.Schema({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user ID"]
    },
}, { timestamps: true })
const CategoryCollection = mongoose.model("CategoryCollection", categoryCollectionSchema);
module.exports = CategoryCollection;