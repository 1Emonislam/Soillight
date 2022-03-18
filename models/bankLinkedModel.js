const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const LocationSchema = new Schema({
	type: {
		type: String,
		default: "Point"
	},
	coordinates: {
		type: [Number],
		index: "2dsphere"
	}
});
const bankLinkedSchema = mongoose.Schema({
    bank_acc_name: {
        type: String,
        required: [true, 'please provide bank account name!']
    },
    bank_acc_num: {
        type: Number,
        required: [true, 'please provide bank account number!']
    },
    routing_num: {
        type: String,
        required: [true, 'please provide bank Routing Number!']
    },
    bank_location:LocationSchema,
    bank_owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });
const BankLinked = mongoose.model("BankLinked", bankLinkedSchema);
module.exports = BankLinked;