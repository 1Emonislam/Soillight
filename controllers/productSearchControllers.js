const Product = require('../models/productModel')
const productSearch = async (req, res, next) => {
    let { search,ratingMax,ratingMin,priceMax,priceMin, page = 1, limit = 10 } = req.query;
    try {
        limit = parseInt(limit);
        search = search?.trim();
        const KeyWordRegExp = new RegExp(search, "i");
        if (!search) {
            const result = await Product.find({}).populate("user","_id pic").sort({ createdAt: 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({}).sort({ createdAt: 1, _id: -1 }).count();
          return  res.json({ count: count, data: result })
        }
        if (search) {
            const result = await Product.find({
                $or: [{ name: KeyWordRegExp }, { category: KeyWordRegExp }, { subCategory: KeyWordRegExp }, { rating: { $lte: ratingMax || 1000000000, $gte: ratingMin || 0 }, price: { $lte: priceMax || 1000000000, $gte: priceMin || 0 } },],
            }).populate("user","_id pic").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                $or: [{ name: KeyWordRegExp }, { category: KeyWordRegExp }, { subCategory: KeyWordRegExp }, { rating: { $lte: ratingMax || 1000000000, $gte: ratingMin || 0 }, price: { $lte: priceMax || 1000000000, $gte: priceMin || 0 } },]
            }).count();
            if (count === 0) {
                return res.status(404).json({ error: { badRequest: "Search not found 404!" } })
            }
          return  res.json({ count: count, data: result });
        }
    }
    catch (error) {
        next(error)
    }
}
const categoriesSearch = async (req, res, next) => {
    let {category, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    category = category?.trim();
    const KeyWordRegExp = new RegExp(category, "i");
    try {
        const result = await Product.find({
            $or: [{ category: KeyWordRegExp },{subCategory:KeyWordRegExp},]}).sort({ createdAt: 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Product.find({
            $or: [{ category: KeyWordRegExp },{subCategory:KeyWordRegExp},]}).sort({ createdAt: 1, _id: -1 }).count();
        return res.json({ count: count, data: result })
    }
    catch (error) {
        next(error)
    }
}

const latestProducts = async (req, res, next) => {
    try {   
        const result = await Product.find({}).sort({ createdAt: 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Product.find({}).sort({ createdAt: 1, _id: -1 }).count();
        return res.json({ count: count, data: result })
    }
    catch (error) {
        next(error)
    }
}
module.exports = { productSearch, categoriesSearch, latestProducts };