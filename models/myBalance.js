const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const MyBalanceSchema = mongoose.Schema({
    balance: {
        type: Number,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true })
const MyBalance = mongoose.model('MyBalance', MyBalanceSchema)
const MyBalanceAddSchema = mongoose.Schema({
    amount: {
        type: Number,
        default: 0,
    },
    transaction_id: {
        type: String,
    },
    tx_ref: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true })
const BalanceAdd = mongoose.model('BalanceAdd', MyBalanceAddSchema)
module.exports = {
    MyBalance,
    BalanceAdd
};