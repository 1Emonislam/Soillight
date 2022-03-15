const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const bankLinkedSchema = mongoose.Schema({
    bank_acc_num: {
        type: Number,
        required: [true, 'please provide bank account number!']
    },
    routing_num: {
        type: String,
        required: [true, 'please provide bank account name!']
    },
    bank_acc_name: {
        type: String,
        required: [true, 'please provide bank account name!']
    },
    bank_location: {
        type: String,
        required: [true, 'please provide bank location!']
    },
    bank_owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestams: true });
const BankLinked = mongoose.model("BankLinked", bankLinkedSchema);
module.exports = BankLinked;