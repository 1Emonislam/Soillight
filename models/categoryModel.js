const { mongoose, Schema } = require('mongoose')
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
}, { timestamps: true })
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;