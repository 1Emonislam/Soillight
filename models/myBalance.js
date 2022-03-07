const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const MyBalanceSchema = mongoose.Schema({
    prevBlance: {
        type: Number,
        default: 0,
    },
    currBalance: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    clearance: {
        type: String,
    }
}, { timestamps: true })
const MyBalance = mongoose.model('MyBalance', MyBalanceSchema)
module.exports = MyBalance;