const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const geometrySchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});
const shopSchema = mongoose.Schema({
    name: { type: String, required: [true, "Please write your Shop Name!"] },
    phone: { type: String, required: [true, "Please write your Shop Phone Number!"] },
    address: { type: String, required: [true, "please write your Shop Address!"] },
    openDate: {
        type: Date,
    },
    closeDate: {
        type: Date,
    },
    status: {
        type: String,
        default: 'pending'
    },
    email: {
        type: String,
        lowercase: true
    },
    location: {
        latitude: {
            type: Number,
            default: 0,
        },
        longitude: {
            type: Number,
            default: 0
        },
        address: {
            type: String,
            default: 'N/A'
        },
        houseNumber: {
            type: String,
            default: 'N/A'
        },
        floor: {
            type: String,
            default: 'N/A'
        },
        information: {
            type: String,
            default: 'N/A'
        }
    },
    geometry: geometrySchema,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user ID"],
        ref: 'User',
    }
}, { timestamps: true });
const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;