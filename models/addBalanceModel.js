const { Schema, mongoose } = require("mongoose");
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
module.exports = BalanceAdd;