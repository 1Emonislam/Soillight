const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const MyBalanceSchema = mongoose.Schema({
    balance: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })
const MyBalance = mongoose.model('MyBalance', MyBalanceSchema)
module.exports = MyBalance;