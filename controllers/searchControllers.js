const User = require('../models/userModel')
const ProductReview = require('../models/productModel');
const Order = require('../models/ordersModel')
const DashboardCounterData = async (req, res, next) => {
    try {

        var todayD = new Date();
        var lastWeekDate = new Date(todayD?.getFullYear(), todayD?.getMonth(), todayD?.getDate() - 7).toDateString();
        const orderCount = await Order.find({}).count();
        const todayDate = new Date()?.toDateString()
        const buyerCount = await User.find({ role: 'buyer' }).count();
        const sellerCount = await User.find({ role: 'seller' }).count();
        const riderCount = await User.find({ role: 'rider' }).count();

        const today = new Date();
        const todayOrderCount = await Order.find({ timestamp: { $gte: today } }).count();
        const todayBuyerCount = await User.find({ timestamp: { $gte: today }, role: 'buyer' }).count();
        const todayRiderCount = await User.find({ timestamp: { $gte: today }, role: 'rider' }).count();
        const todaySellerCount = await User.find({ timestamp: { $gte: today }, role: 'seller' }).count();
        const todaySellerApprove = await User.find({ timestamp: { $gte: today }, role: 'seller', status: 'approved' }).count();
        const todayOrderDelivered = await Order.find({ timestamp: { $gte: today }, status: 'delivered' }).count();
        const todayOrderCancel = await Order.find({ timestamp: { $gte: today }, status: 'cancelled' }).count();
        const todayOrderPending = await Order.find({ timestamp: { $gte: today }, status: 'pending' }).count();
        const todayRiderApprove = await User.find({ timestamp: { $gte: today }, role: 'rider', status: 'approved' }).count();
        const todayRiderRejected = await User.find({ timestamp: { $gte: today }, role: 'rider', status: 'rejected' }).count();
        const todayBuyerRejected = await User.find({ timestamp: { $gte: today }, role: 'buyer', status: 'rejected' }).count();
        const todaySellerRejected = await User.find({ timestamp: { $gte: today }, role: 'seller', status: 'rejected' }).count();
        // last weak data 
        const lastWeak = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
        const lastWeekOrderCount = await Order.find({ timestamp: { $gte: lastWeak } }).count();
        const lastWeekBuyerCount = await User.find({ timestamp: { $gte: lastWeak }, role: 'buyer' }).count();
        const lastWeekRiderCount = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider' }).count();
        const lastWeekSellerCount = await User.find({ timestamp: { $gte: lastWeak }, role: 'seller' }).count();
        const lastWeekSellerApprove = await User.find({ timestamp: { $gte: lastWeak }, role: 'seller', status: 'approved' }).count();
        const lastWeekRiderApprove = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider', status: 'approved' }).count();
        const lastWeekRiderRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider', status: 'rejected' }).count();
        const lastWeekOrderPending = await Order.find({ timestamp: { $gte: lastWeak }, status: 'pending' }).count();
        const lastWeekOrderDelivered = await Order.find({ timestamp: { $gte: lastWeak }, status: 'delivered' }).count();
        const lastWeekOrderCancel = await Order.find({ timestamp: { $gte: lastWeak }, status: 'cancelled' }).count();
        const lastWeakSellerRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'seller', status: 'rejected' }).count();
        const lastWeekBuyerRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'buyer', status: 'rejected' }).count();
        return res.status(200).json({ message: 'data successfully fetch', lastWeekDate, todayDate, totalCount: { buyerCount, sellerCount, riderCount, orderCount }, today: { todayOrderCount, todayOrderCancel, todayOrderPending, todayOrderDelivered, todayBuyerCount, todayRiderCount, todaySellerCount, todaySellerApprove, todayRiderApprove, todayBuyerRejected, todaySellerRejected, todayRiderRejected }, lastWeek: { lastWeekOrderCount, lastWeekOrderCancel, lastWeekOrderDelivered, lastWeekOrderPending, lastWeekBuyerCount, lastWeekRiderCount, lastWeekSellerCount, lastWeekSellerApprove, lastWeekRiderApprove, lastWeekRiderRejected, lastWeekBuyerRejected, lastWeakSellerRejected } })
    } catch (error) {
        next(error)
    }
}


const searchSellerBuyerRider = async (req, res, next) => {
    let {role, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    // console.log(req.query)
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }, },
        ], role: role
    } : { role: role };
    try {
        const count = await User.find(keyword).count();
        const users = await User.find(keyword).limit(limit * 1).skip((page - 1) * limit).sort([['date', -1]]).select("-password").select("-adminShop")
        return res.status(200).json({ count,data: users })
    }
    catch (error) {
        next(error)
    }
}

const newSearchSellerRiderBuyer = async (req, res, next) => {
    let {role, page = 1, limit = 10 } = req.query;
    // console.log(req.query)
    limit = parseInt(limit);
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" }, },
            ], role: role
        } : { role: role };
        const data = await User.find(keyword).sort([['date', -1]]).limit(limit * 1).skip((page - 1) * limit)
        const count = await User.find(keyword).sort([['date', -1]]).count();
        return res.status(200).json({ count,data: data})

    } catch (error) {
        next(error)
    }
}

const searchStatusBySellerRiderBuyer = async (req, res, next) => {
    let {role,status, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" }, },
            ], role: role, status: status
        } : { role: role, status: status };
        const data = await User.find(keyword).sort([['date', -1]]).limit(limit * 1).skip((page - 1) * limit)
        const count = await User.find(keyword).sort([['date', -1]]).count();
        return res.status(200).json({count, data: data })

    } catch (error) {
        next(error)
    }
}

module.exports = { searchSellerBuyerRider, newSearchSellerRiderBuyer, searchStatusBySellerRiderBuyer, DashboardCounterData }