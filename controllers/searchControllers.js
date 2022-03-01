const User = require('../models/userModel')
const ProductReview = require('../models/productModel')
const singleUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const finding = await ProductReview.find({ user: id });
        let totalRate = finding?.length;
        let avgRating = finding?.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
        const user = await User.findOne({ _id: id });
        return res.status(200).json({ message: "data successfully fetch!", totalRate, avgRating, data: user })
    }
    catch (error) {

    }
}

const sellerSearch = async (req, res, next) => {
    // console.log(req.query)
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }, },
        ], role: 'seller'
    } : { role: 'seller' };
    try {
        const count = await User.find(keyword).count();
        const users = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).select("-password").limit(5)
        return res.status(200).json({ data: users, count })
    }
    catch (error) {
        next(error)
    }

}
const riderSearch = async (req, res, next) => {
    // console.log(req.query)
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }, },
        ], role: 'rider'
    } : { role: 'rider' };
    try {
        const count = await User.find(keyword).count();
        const users = await User.find(keyword).sort({ createdAt: 1, _id: -1 }).select("-password").limit(5)
        return res.status(200).json({ data: users, count })
    }
    catch (error) {
        next(error)
    }

}
module.exports = { singleUser, sellerSearch,riderSearch }