const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const categorySchema = mongoose.Schema({
    category: {
        type: String,
        trim: true,
        required: [true, 'Please select a category!']
    },
    img: {
        type: String,
    },
    age: {
        type: String,
    }
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema);
const subCategorySchema = mongoose.Schema({
    subCategory: {
        type: String,
        trim: true,
        required: [true, 'Please select a sub category!']
    },
    img: {
        type: String,
    },
    age: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, 'Please select a category!']
    },
}, { timestamps: true })

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

const insideSubCategorySchema = mongoose.Schema({
    insideSubCategory: {
        type: String,
        trim: true,
        required: [true, 'Please select a inside Sub Category!']
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, 'Please select a Sub Category!']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, 'Please select a Category!']
    },
}, { timestamps: true })

const InsideSubCategory = mongoose.model("InsideSubCategory", insideSubCategorySchema);

const insidePackTypeSchema = mongoose.Schema({
    packType: {
        type: String,
        trim: true,
        required: [true, 'Please select a pack type!']
    },
    insideSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InsideSubCategory",
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, 'Please select a Sub category!']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, 'Please select a category!']
    },
}, { timestamps: true })
const InsidePackType = mongoose.model("InsidePackType", insidePackTypeSchema);

const insideServingSizeSchema = mongoose.Schema({
    servingSize: {
        type: String,
        trim: true,
        required: [true, 'Please select a Serving size!']
    },
    insideSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InsideSubCategory",
    },
    packType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InsidePackType",
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, 'Please select a sub category!']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, 'Please select a category!']
    },
}, { timestamps: true })

const InsideServingSize = mongoose.model("InsideServingSize", insideServingSizeSchema);
module.exports = {
    Category,
    SubCategory,
    InsideSubCategory,
    InsidePackType,
    InsideServingSize
};