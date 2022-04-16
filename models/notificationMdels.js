const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;
const NotificationSchema = mongoose.Schema(
	{
		sender: { type: Schema.Types.ObjectId, ref: "User" },
		product: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
				},
				productOwner: { type: Schema.Types.ObjectId, ref: "User" },
				price: {
					type: Number,
				},
				quantity: {
					type: Number,
				},
			},
		],
		receiver: [{ type: Schema.Types.ObjectId, ref: "User" }],
		message: {
			type: String,
		},
		seen: {
			type: Boolean,
			default: false,
		},
		read_at: { type: Date, default: Date.now },
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);
const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
