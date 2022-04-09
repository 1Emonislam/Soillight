const { mongoose, Schema } = require('mongoose')
const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
},{ timestamps: true })

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;