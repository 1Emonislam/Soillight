const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const balanceWithdrawSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user ID"]
    },
    amount:{
        type:String,
    },
    transaction_id: {
        type: String,
    },
    tx_ref: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
    },
}, { timestams: true })
const BalanceWithdraw = mongoose.model("BalanceWithdraw", balanceWithdrawSchema);
module.exports = BalanceWithdraw;