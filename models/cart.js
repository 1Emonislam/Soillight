const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let ItemSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity can not be less then 1."],
        },
        price: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;

const CartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        items: [ItemSchema],
        subTotal: {
            default: 0,
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);
const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
