const User = require('../models/userModel')
const ProductReview = require('../models/productModel')

const DashboardCounterData = async (req, res, next) => {
    try {

        var todayD = new Date();
        var lastWeekDate = new Date(todayD?.getFullYear(), todayD?.getMonth(), todayD?.getDate() - 7).toDateString();
        const todayDate = new Date()?.toDateString()
        const buyerCount = await User.find({ role: 'buyer' }).count();
        const sellerCount = await User.find({ role: 'seller' }).count();
        const riderCount = await User.find({ role: 'rider' }).count();
        let startOfToday = new Date();
        const today = new Date();
        const todayBuyerCount = await User.find({timestamp: { $gte: today }, role: 'buyer' }).count();
        const todayRiderCount = await User.find({ timestamp: { $gte: today }, role: 'rider' }).count();
        const todaySellerCount = await User.find({ timestamp: { $gte: today }, role: 'rider' }).count();
        const todaySellerApprove = await User.find({ timestamp: { $gte: today }, role: 'seller', status: 'approved' }).count();
        const todayRiderApprove = await User.find({ timestamp: { $gte: today }, role: 'rider', status: 'approved' }).count();
        const todayRiderRejected = await User.find({ timestamp: { $gte: today }, role: 'rider', status: 'rejected' }).count();
        const todayBuyerRejected = await User.find({ timestamp: { $gte: today }, role: 'buyer', status: 'rejected' }).count();
        const todaySellerRejected = await User.find({ timestamp: { $gte: today }, role: 'seller', status: 'rejected' }).count();
        // last weak data 
        const lastWeak = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
        const lastWeekBuyerCount = await User.find({ timestamp: { $gte: lastWeak }, role: 'buyer' }).count();
        const lastWeekRiderCount = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider' }).count();
        const lastWeekSellerCount = await User.find({ timestamp: { $gte: lastWeak }, role: 'seller' }).count();
        const lastWeekSellerApprove = await User.find({ timestamp: { $gte: lastWeak }, role: 'seller', status: 'approved' }).count();
        const lastWeekRiderApprove = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider', status: 'approved' }).count();
        const lastWeekRiderRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'rider', status: 'rejected' }).count();
        const lastWeakSellerRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'seller', status: 'rejected' }).count();
        const lastWeekBuyerRejected = await User.find({ timestamp: { $gte: lastWeak }, role: 'buyer', status: 'rejected' }).count();
        return res.status(200).json({ message: 'data successfully fetch', lastWeekDate, todayDate, totalCount: { buyerCount, sellerCount, riderCount }, today: { todayBuyerCount, todayRiderCount, todaySellerCount, todaySellerApprove, todayRiderApprove, todayBuyerRejected, todaySellerRejected, todayRiderRejected }, lastWeek: { lastWeekBuyerCount, lastWeekRiderCount, lastWeekSellerCount, lastWeekSellerApprove, lastWeekRiderApprove, lastWeekRiderRejected, lastWeekBuyerRejected, lastWeakSellerRejected } })
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
        const users = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).select("-password").select("-adminShop").skip((page - 1) * limit)
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
        const users = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).select("-adminShop").select("-password").skip((page - 1) * limit)
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
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }, },
        ], role: 'rider'
    } : { role: 'rider' };
    try {
        const count = await User.find(keyword).count();
        const users = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).select("-password").skip((page - 1) * limit)
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
        const data = await User.find({ role: 'seller' }).sort({ createdAt: 1, _id: -1 }).skip((page - 1) * limit)
        const count = await User.find({ role: 'seller' }).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}
const riderSearchNew = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const data = await User.find({ role: 'rider' }).sort({ createdAt: 1, _id: -1 }).skip((page - 1) * limit)
        const count = await User.find({ role: 'rider' }).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}
const sellerSearchApproved = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const data = await User.find({ role: 'seller',status:'approved' }).sort({ createdAt: 1, _id: -1 }).skip((page - 1) * limit)
        const count = await User.find({ role: 'seller',status:'approved'}).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}
const riderSearchApproved = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const data = await User.find({ role: 'rider',status:'approved'}).sort({ createdAt: 1, _id: -1 }).skip((page - 1) * limit)
        const count = await User.find({ role: 'rider',status:'approved'}).sort({ createdAt: 1, _id: -1 }).count();
        return res.status(200).json({ data: data, count })

    } catch (error) {
        next(error)
    }
}

module.exports = { buyerSearch,sellerSearchApproved,riderSearchApproved,riderSearchNew, DashboardCounterData, sellerSearch, riderSearch, sellerSearchNew }