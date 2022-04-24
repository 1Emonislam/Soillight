const Product = require('../models/productModel')
const productSearch = async (req, res, next) => {
    let { search, ratingMax, ratingMin, priceMax, priceMin, page = 1, limit = 10 } = req.query;
    try {
        limit = parseInt(limit);
        const KeyWordRegExp = new RegExp(search, "i");
        if (!search) {
            const result = await Product.find({ status: 'approved' }).populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ status: 'approved' }).populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").count();
            return res.json({ count: count, data: result })
        }

        if (search && ratingMax && ratingMin && priceMax && priceMin) {
            const result = await Product.find({
                $or: [{ name: KeyWordRegExp }, { rating: { $lte: ratingMax || 1000000000, $gte: ratingMin || 0 }, price: { $lte: priceMax || 1000000000, $gte: priceMin || 0 } },], status: 'approved'
            }).populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                $or: [{ name: KeyWordRegExp }, { rating: { $lte: ratingMax || 1000000000, $gte: ratingMin || 0 }, price: { $lte: priceMax || 1000000000, $gte: priceMin || 0 } },], status: 'approved'
            }).count();
            if (count === 0) {
                return res.status(404).json({ error: { "product": "Search not found 404!" }, data: [] })
            }
            return res.json({ count: count, data: result });
        }
        if (search) {
            // console.log(req.query.search)
            const keyword = req.query.search ? {
                $and: [
                    { name: { $regex: req.query.search?.trim(), $options: "i" } },
                ], status: 'approved'
            } : { status: 'approved' };
            const result = await Product.find(keyword).populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find(keyword).count();
            if (count === 0) {
                return res.status(404).json({ error: { "product": "Search not found 404!" }, data: [] })
            }
            return res.json({ count: count, data: result });
        }
    }
    catch (error) {
        next(error)
    }
}
const categoriesSearch = async (req, res, next) => {
    let { category, subCategory, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    category = new RegExp(category, "i");
    subCategory = new RegExp(subCategory, "i");
    try {
        if (category && subCategory) {
            const result = await Product.find({
                status: 'approved'
            }).populate({ path: 'category', match: { category: { $regex: category } } }).populate({ path: 'subCategory', match: { subCategory: { $regex: subCategory } } }).populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }.populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType")).limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                status: 'approved'
            }).populate({ path: 'category', match: { category: { $regex: category } } }).populate({ path: 'subCategory', match: { subCategory: { $regex: subCategory } } }).populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").count();
            return res.json({ count: count, data: result })
        }
        if (category) {
            const result = await Product.find({
                status: 'approved'
            }).populate({ path: 'category', match: { category: { $regex: category } } }).populate("subCategory").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                status: 'approved'
            }).populate({ path: 'category', match: { category: { $regex: category } } }).populate("subCategory").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").count();
            return res.json({ count: count, data: result })
        }
        if (subCategory) {
            const result = await Product.find({
                status: 'approved'
            }).populate({ path: 'subCategory', match: { name: { $regex: subCategory } } }).populate("category").populate("user", "_id pic").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                status: 'approved'
            }).populate({ path: 'subCategory', match: { name: { $regex: subCategory } } }).populate("category").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").count()
            return res.json({ count: count, data: result })
        }

    }
    catch (error) {
        next(error)
    }
}

const latestProducts = async (req, res, next) => {
    let { status, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const keyword = req.query.search ? {
            $and: [
                { name: { $regex: req.query.search?.trim(), $options: "i" } },
            ], status: status || 'approved'
        } : { status: 'approved' };
        if (!(req.query?.search || status)) {
            const result = await Product.find(keyword).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).skip((page - 1) * limit);
            const count = await Product.find(keyword).count();
            return res.json({ count: count, data: result })
        }
        if (req.query?.search || status) {
            const result = await Product.find(keyword).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find(keyword).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").count();
            return res.json({ count: count, data: result })
        }
    }
    catch (error) {
        next(error)
    }
}
const myProducts = async (req, res, next) => {
    let { status, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        if (status) {
            const result = await Product.find({ user: req?.user?._id, status: status }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ user: req?.user?._id, status: status }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").count();
            return res.json({ count: count, data: result })
        } else {
            const result = await Product.find({ user: req?.user?._id }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ user: req?.user?._id }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").count();
            return res.json({ count: count, data: result })
        }
    }
    catch (error) {
        next(error)
    }
}
const othersSellerProducts = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        const result = await Product.find({ user: req?.params.id, status: 'approved' }).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").populate({
            path: "user",
            select: "_id name pic sellerShop",
            populate: [
                {
                    path: "sellerShop",
                    select: "_id address location name",
                },
            ],
        }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Product.find({ user: req?.params.id, status: 'approved' }).count();
        const numReviews = await result?.length;
        const rating = await result?.reduce((acc, item) => item.rating + acc, 0) / result?.length;
        // console.log(result.length,numReviews,rating)
        return res.json({ count: count, numReviews, rating, data: result })
    }
    catch (error) {
        next(error)
    }
}


const allProductGet = async (req, res, next) => {
    try {
        let { status, page = 1, limit = 10 } = req.query;
        // console.log(status)
        limit = parseInt(limit);
        // console.log(req.query.search)
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
            ], status: status
        } : { status: status };
        const product = await Product.find(keyword).populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").sort("-createdAt").populate({
            path: "user",
            select: "_id name sellerShop pic",
            populate: [
                {
                    path: "sellerShop",
                    select: "_id address location name",
                },
            ],
        }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Product.find(keyword).count();
        return res.status(200).json({ "message": "product data successfully fetch!", count, data: product })

    }
    catch (error) {
        next(error)
    }
}

module.exports = { othersSellerProducts, productSearch, categoriesSearch, latestProducts, myProducts, allProductGet };