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
        const todayOrderCount = await Order.find({ timestamp: { $gte: today }}).count();
        const todayBuyerCount = await User.find({ timestamp: { $gte: today }, role: 'buyer' }).count();
        const todayRiderCount = await User.find({ timestamp: { $gte: today }, role: 'rider' }).count();
        const todaySellerCount = await User.find({ timestamp: { $gte: today }, role: 'seller' }).count();
        const todaySellerApprove = await User.find({ timestamp: { $gte: today }, role: 'seller', status: 'approved' }).count();
        const todayOrderApprove = await Order.find({ timestamp: { $gte: today }, status: 'complete' }).count();
        const todayRiderApprove = await User.find({ timestamp: { $gte: today }, role: 'rider', status: 'approved' }).count();
        const todayOrderRejected = await Order.find({ timestamp: { $gte: today }, status: 'cancel' }).count();
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
        const lastWeekOrderApprove = await Order.find({ timestamp: { $gte: lastWeak }, status: 'complete' }).count();
        const lastWeekRiderApprove = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider', status: 'approved' }).count();
        const lastWeekRiderRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider', status: 'rejected' }).count();
        const lastWeekOrderRejected = await Order.find({ timestamp: { $gte: lastWeak }, status: 'cancel' }).count();
        const lastWeakSellerRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'seller', status: 'rejected' }).count();
        const lastWeekBuyerRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'buyer', status: 'rejected' }).count();
        return res.status(200).json({ message: 'data successfully fetch', lastWeekDate, todayDate, totalCount: { buyerCount, sellerCount, riderCount,orderCount }, today: {todayOrderCount,todayOrderRejected,todayOrderApprove, todayBuyerCount, todayRiderCount, todaySellerCount, todaySellerApprove, todayRiderApprove, todayBuyerRejected, todaySellerRejected, todayRiderRejected }, lastWeek: {lastWeekOrderCount,lastWeekOrderApprove,lastWeekOrderRejected, lastWeekBuyerCount, lastWeekRiderCount, lastWeekSellerCount, lastWeekSellerApprove, lastWeekRiderApprove, lastWeekRiderRejected, lastWeekBuyerRejected, lastWeakSellerRejected } })
    } catch (error) {
        next(error)
    }
}


const buyerSearch = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }, },
        ], role: 'buyer'
    } : { role: 'buyer' };
    try {
        const count = await User.find(keyword).count();
        const users = await User.find(keyword).limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: 1, _id: -1 }).select("-password").select("-adminShop")
        return res.status(200).json({ data: users, count })
    }
    catch (error) {
        next(error)
    }
}

const sellerSearch = async (req, res, next) => {
    // console.log(req.query)
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }, },
        ], role: 'seller'
    } : { role: 'seller' };
    try {
        const count = await User.find(keyword).count();
        const users = await User.find(keyword).limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: 1, _id: -1 }).select("-adminShop").select("-password")
        return res.status(200).json({ data: users, count })
    }
    catch (error) {
        next(error)
    }

}
const riderSearch = async (req, res, next) => {
    // console.log(req.query)
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    // console.log(page,limit)
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }, },
        ], role: 'rider'
    } : { role: 'rider' };
    try {
        const count = await User.find(keyword).count();
        const users = await User.find(keyword).limit(limit * 1).limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: 1, _id: -1 }).select("-password")
        return res.status(200).json({ data: users, count })
    }
    catch (error) {
        next(error)
    }

}
const sellerSearchNew = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" }, },
            ], role: 'seller'
        } : { role: 'seller' };
        const data = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit)
        const count = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}
const riderSearchNew = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" }, },
            ], role: 'rider'
        } : { role: 'rider' };
        const data = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit)
        const count = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}
const sellerSearchApproved = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" }, },
            ], role: 'seller', status: 'approved'
        } : { role: 'seller', status: 'approved' };
        const data = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit)
        const count = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}
const riderSearchApproved = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" }, },
            ], role: 'rider', status: 'approved'
        } : { role: 'rider', status: 'approved' };
        const data = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit)
        const count = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}

module.exports = { buyerSearch, sellerSearchApproved, riderSearchApproved, riderSearchNew, DashboardCounterData, sellerSearch, riderSearch, sellerSearchNew }