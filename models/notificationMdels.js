const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema(
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
		read_by: [
			{
				readerId: { type: Schema.Types.ObjectId, ref: "User" },
				read_at: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);
const Notification = model("Notification", NotificationSchema);
module.exports = Notification;
