const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const balanceWithdrawSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        required: [true, 'please provide withdraw amount!']
    },
    transaction_id: {
        type: String,
    },
    tax: {
        type: Number,
    },
    bank_pay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankLinked"
    },
    status: {
        type: String,
        default: 'pending',
    },
},{ timestamps: true })
const BalanceWithdraw = mongoose.model("BalanceWithdraw", balanceWithdrawSchema);
module.exports = BalanceWithdraw;