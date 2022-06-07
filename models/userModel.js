const bcrypt = require("bcryptjs");
const { Schema, model } = require("mongoose");
const geometrySchema = new Schema({
	type: {
		type: String,
		default: "Point"
	},
	coordinates: {
		type: [Number],
		index: "2dsphere"
	}
});
const userSchema = new Schema(
	{
		role: {
			type: String,
			lowercase: true,
			required: [true, "Please Select your Role!"],
		},
		status: {
			type: String,
			default: "pending",
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			required: [true, "Please fillup the Name!"],
		},
		phone: {
			type: String,
			required: [true, "please fillup the Number!"],
		},
		phoneVerified: {
			type: Boolean,
			default: false,
		},
		location: {
			latitude: {
				type: Number,
				default: 0,
			},
			longitude: {
				type: Number,
				default: 0
			},
			address: {
				type: String,
				default: 'N/A'
			},
			houseNumber: {
				type: String,
				default: 'N/A'
			},
			floor: {
				type: String,
				default: 'N/A'
			},
			information: {
				type: String,
				default: 'N/A'
			}
		},
		geometry: geometrySchema,
		email: {
			type: String,
			required: [true, "Please fillup the Email!"],
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, "Please fillup the Password!"],
		},
		action: {
			type: String,
			enum: ['active', 'inactive', 'block', 'closed'],
			default: 'active'
		},
		socketId: String,
		lastOnline: Date,
		valid_id: {
			id: {
				type: String,
			},
			verify_id: {
				type: Boolean,
			},
			back_side_id: {
				type: String,
			},
			front_side_id: {
				type: String,
			},
		},
		license_card: {
			id: {
				type: String,
			},
			verify_card: {
				type: Boolean,
			},
			back_side_card: {
				type: String,
			},
			front_side_card: {
				type: String,
			},
		},
		my_balance: {
			type: Schema.Types.ObjectId,
			ref: "MyBalance",
		},
		address: {
			type: String,
		},
		pic: {
			type: String,
			default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
		},
		sellerShop: {
			type: Schema.Types.ObjectId,
			ref: "Shop",
		},
		adminShop: [
			{
				type: Schema.Types.ObjectId,
				ref: "Shop",
			},
		],
	},
	{
		timestamps: true,
	}
);
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});
const User = model("User", userSchema);
module.exports = User;
