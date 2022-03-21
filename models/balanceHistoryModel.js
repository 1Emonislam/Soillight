const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const balanceHistorySchema = mongoose.Schema({
    balanceReceiver: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    balanceSender:[ {
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    amount: {
        type: Number,
        required: [true, 'please provide withdraw amount!']
    },
    transaction_id: {
        type: String,
    },
    tax: {
        type: Number,
        default: 0,
    },
    bank_pay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankLinked"
    },
    status: {
        type: String,
        default: 'pending',
    },
    trans_pay: {
        type: String,
        default: null,
    },
}, { timestamps: true })
const BalanceHistory = mongoose.model("BalanceHistory", balanceHistorySchema);
module.exports = BalanceHistory;