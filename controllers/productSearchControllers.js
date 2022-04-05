const Product = require('../models/productModel')
const productSearch = async (req, res, next) => {
    let { search, ratingMax, ratingMin, priceMax, priceMin, page = 1, limit = 10 } = req.query;
    try {
        limit = parseInt(limit);
        const KeyWordRegExp = new RegExp(search, "i");
        if (!search) {
            const result = await Product.find({ status: 'approved' }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ status: 'approved' }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").count();
            return res.json({ count: count, data: result })
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
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find(keyword).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).count();
            if (count === 0) {
                return res.status(404).json({ error: { "product": "Search not found 404!" }, data: [] })
            }
            return res.json({ count: count, data: result });
        }
        if (search && ratingMax && ratingMin && priceMax && priceMin) {
            const result = await Product.find({
                $or: [{ name: KeyWordRegExp }, { category: KeyWordRegExp }, { subCategory: KeyWordRegExp }, { rating: { $lte: ratingMax || 1000000000, $gte: ratingMin || 0 }, price: { $lte: priceMax || 1000000000, $gte: priceMin || 0 } },], status: 'approved'
            }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                $or: [{ name: KeyWordRegExp }, { category: KeyWordRegExp }, { subCategory: KeyWordRegExp }, { rating: { $lte: ratingMax || 1000000000, $gte: ratingMin || 0 }, price: { $lte: priceMax || 1000000000, $gte: priceMin || 0 } },], status: 'approved'
            }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).count();
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
    let { category, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    category = category?.trim();
    const KeyWordRegExp = new RegExp(category, "i");
    try {
        if (category) {
            const result = await Product.find({
                $or: [{ category: KeyWordRegExp }], status: 'approved'
            }).populate("user", "_id pic").populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                $or: [{ category: KeyWordRegExp }], status: 'approved'
            }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            })
            return res.json({ count: count, data: result })
        }
        if (category && subCategory) {
            const result = await Product.find({
                $or: [{ category: KeyWordRegExp }, { subCategory: KeyWordRegExp },], status: 'approved'
            }).populate("user", "_id pic").populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({
                $or: [{ category: KeyWordRegExp }, { subCategory: KeyWordRegExp }], status: 'approved'
            }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            })
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
            const result = await Product.find(keyword).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find(keyword).count();
            return res.json({ count: count, data: result })
        }
        if (req.query?.search || status) {
            const result = await Product.find(keyword).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find(keyword).count();
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
            const result = await Product.find({ user: req?.user?._id, status: status }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ user: req?.user?._id, status: status }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").count();
            return res.json({ count: count, data: result })
        } else {
            const result = await Product.find({ user: req?.user?._id }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ user: req?.user?._id }).sort("-createdAt").count();
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
        if (status) {
            const result = await Product.find({ user: req?.params.id, status:  'approved' }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ user: req?.params.id, status: 'approved' }).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").count();
            return res.json({ count: count, data: result })
        } else {
            const result = await Product.find({user: req?.params.id, status: 'approved'}).populate({
                path: "user",
                select: "_id name sellerShop",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            }).sort("-createdAt").limit(limit * 1).skip((page - 1) * limit);
            const count = await Product.find({ user: req?.params.id, status: 'approved' }).sort("-createdAt").count();
            return res.json({ count: count, data: result })
        }
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
        const product = await Product.find(keyword).populate({
            path: "user",
            select: "_id name sellerShop",
            populate: [
                {
                    path: "sellerShop",
                    select: "_id address location name",
                },
            ],
        }).sort({ "createdAt": 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Product.find(keyword).count();

        return res.status(200).json({ "message": "product data successfully fetch!", count, data: product })

    }
    catch (error) {
        next(error)
    }
}

module.exports = {othersSellerProducts, productSearch, categoriesSearch, latestProducts, myProducts, allProductGet };