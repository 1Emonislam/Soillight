const mongoose = require('mongoose');
const shopSchema = mongoose.Schema({
    name: { type: String, required: [true, "Please write your Shop Name!"] },
    phone: { type: Number, required: [true, "Please write your Shop Phone Number!"] },
    address: { type: String, required: [true, "please write your Shop Address"] },
    openDate: {
        type: Date,
    },
    closeDate: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user id"],
        ref: 'User',
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });
const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;