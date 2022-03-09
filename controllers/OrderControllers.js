const Order = require("../models/ordersModel");
const MyBalance = require("../models/myBalance");
const Notification = require("../models/notificationMdels")
const User = require("../models/userModel");
const orderAdd = async (req, res, next) => {
    const { products, transaction_id, tx_ref } = req.body;
    let productOwnerNotify = [];
    const buyer = await User.findOne({ _id: req.user._id })
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
            for (let owner = 0; owner < products.length; owner++) {
                productOwnerNotify.unshift(products[owner].productOwner)
            }
            const NotificationSendObj = {
                sender: req.user._id,
                product: [...products],
                receiver: [...productOwnerNotify],
                message: `You Have Received New Order From ${buyer.name}`,
            }
            await Notification.create(NotificationSendObj);
        }
        return res.status(200).json({ message: "order successfully!", data: created });
    }
    catch (error) {
        next(error)
    }
}

const orderSearch = async (req, res, next) => {
    let { status, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const order = await Order.find({ user: req.user._id, status: status }).sort({ createdAt: -1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Order.find({ user: req.user._id, status: status }).sort({ createdAt: -1, _id: -1 }).count();
        return res.status(200).json({ count, data: order })
    }
    catch (error) {
        next(error)
    }
}
const adminSeenOrdersSearch = async (req, res, next) => {
    if (req?.user?.isAdmin === true) {
        let { search, status, page = 1, limit = 10 } = req.query;
        limit = parseInt(limit);
        try {
            const order = await Order.find({ status: status }).populate("user", "name").populate("products.productOwner", "name").sort({ createdAt: -1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
            const count = await Order.find({ status: status }).sort({ createdAt: -1, _id: -1 }).count();
            return res.status(200).json({ count, data: order })
        }
        catch (error) {
            next(error)
        }
    } else {
        return res.status(400).json({ error: { "admin": "admin permission requied!" } })
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

const singleOrder = async (req, res, next) => {
    if (req?.user?.isAdmin === true) {
        const order = await Order.findOne({ _id: req.params.id }).populate({
            path: 'user',
            select: "_id name address"
        }).populate("products.productId","_id name img pack_type serving_size numReviews rating").populate({
            path: 'products.productOwner',
            select: "_id name address sellerShop",
            populate: [{
                path: "sellerShop",
                select: "_id address"
            }]
        })
        return res.status(200).json({ data: order })
    } else {
        return res.status(400).json({ error: { "admin": "admin permission required!" } })
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
module.exports = { orderAdd, myOrders, orderGet, orderSearch, singleOrder, adminSeenOrdersSearch }