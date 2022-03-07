const Order = require("../models/ordersModel");
const MyBalance = require("../models/myBalance");
const User = require("../models/userModel");
const orderAdd = async (req, res, next) => {
    const { products, transaction_id, tx_ref } = req.body;
    try {
        const created = await Order.create({
            user: req.user._id,
            transaction_id,
            tx_ref,
            products
        })
        if (!created) {
            return res.status(400).json({ error: { order: "something wrong!" } })
        }
        if (created) {
            return res.status(200).json({ message: "order successfully!", data: created });
        }
    }
    catch (error) {
        next(error)
    }
}
const orderSearch = async (req, res, next) => {
    let { status, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const order = await Order.find({ user: req.user._id,status:status}).sort({ createdAt: -1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Order.find({ user: req.user._id,status:status}).sort({ createdAt: -1, _id: -1 }).count();
        return res.status(200).json({count, data: order })
    }
    catch (error) {
        next(error)
    }
}
const orderGet = async (req, res, next) => {
    try {
        const result = await Order.find()
            .populate({
                path: 'products',
                populate: {
                    path: 'products.productId'
                }
            })
        res.json({ result })
    }
    catch (error) {
        next(error)
    }
}
const myOrders = async (req, res, next) => {
    // try {
    //     const order = await Order
    // }
    // catch (error) {
    //     next(error)
    // }
}
module.exports = { orderAdd, myOrders, orderGet, orderSearch }