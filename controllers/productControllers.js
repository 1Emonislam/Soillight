const Shop = require('../models/shopModel');
const Product = require('../models/productModel');
const productCreate = async (req, res, next) => {
    const { name, category, subCategory, pack_type, serving_size, img, quantity, price } = req.body;
    if (!name) {
        return res.status(400).json({ error: { "name": "Please fill up the Product Name!" } });
    }
    if (!category) {
        return res.status(400).json({ error: { "category": "Please fill up the Product Category!" } });
    }
    if (!subCategory) {
        return res.status(400).json({ error: { "subCategory": "Please fill up the Product Sub Category!" } });
    }
    if (!pack_type) {
        return res.status(400).json({ error: { "pack_type": "Please fill up the Product Pack Type!" } });
    }
    if (!serving_size) {
        return res.status(400).json({ error: { "serving_size": "Please fill up the Product Serving Size!" } });
    }
    if (!price) {
        return res.status(400).json({ error: { "price": "Please fill up the Product Price!" } });
    }
    try {
        const shop = await Shop.findOne({ user: req?.user?._id });
        if (!shop) {
            return res.status(400).json({ error: { "product": "Shop registration required! Register Your Own Store!" } })
        }
        if (shop) {
            if (req?.user?.isAdmin === true) {
                const productCreated = await Product.create({
                    name, category, subCategory, pack_type, serving_size, status: 'approved', shop: shop._id, quantity, price, img, user: req?.user?._id
                });
                if (!productCreated) {
                    return res.status(400).json({ error: { "product": "Products submission failed! Please try again!" } })
                }
                if (productCreated) {
                    return res.status(200).json({ message: "Product submission successfully! The product is approved!." })
                }
            }
            if ((req?.user?.role === 'seller')) {
                const productCreated = await Product.create({
                    name, category, subCategory, pack_type, serving_size, quantity, price, img, user: req?.user?._id
                });
                if (!productCreated) {
                    return res.status(400).json({ error: { "product": "Products submission failed! Please try again!" } })
                }
                if (productCreated) {
                    return res.status(200).json({ message: "Your products are Under Review. You will Receive Confirmation Soon. you Can Check the status in products section once registered." })
                }
            } else {
                return res.status(400).json({ error: { "product": "Permission denied! You can perform only seller!" } })
            }
        }
    }
    catch (error) {
        next(error)
    }
}
const productUpdate = async (req, res, next) => {
    const { name, category, subCategory, pack_type, serving_size, img, quantity, price } = req.body;
    try {
        if (!(req?.user?.role === 'seller' || req?.user?.isAdmin === true)) {
            return res.status(400).json({ error: { "product": "Permission denied! Buyers do not update the products!." } })
        } else {
            const productUpdated = await Product.findByIdAndUpdate(req.params.id, {
                name, category, subCategory, pack_type, serving_size, img, quantity, price
            }, { new: true });
            if (!productUpdated) {
                return res.status(400).json({ error: { "product": "Product not founds!" },data:[] })
            }
            if (productUpdated) {
                return res.status(200).json({ message: "Product updated successfully!", data: productUpdated })
            }
        }
    }
    catch (error) {
        next(error)
    }
}
const productRemove = async (req, res, next) => {
    try {
        if (!(req?.user?.role === 'seller' || req?.user?.isAdmin === true)) {
            return res.status(400).json({ error: { "product": "Permission denied! Buyers do not remove the products!." } })
        } else {
            const productRemove = await Product.findByIdAndRemove(req.params.id);
            if (!productRemove) {
                return res.status(400).json({ error: { "product": "Product not founds!" },data:[] })
            }
            if (productRemove) {
                return res.status(200).json({ message: "Product removed successfully!" })
            }
        }
    }
    catch (error) {
        next(error)
    }
}

const getSignleProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id }).populate({
            path: "user",
            select: "_id name sellerShop",
            populate: [
                {
                    path: "sellerShop",
                    select: "_id address location name",
                },
            ],
        });
        return res.status(200).json({ data: product })
    }
    catch (error) {
        next(error)
    }
}
const productStatusUpdate = async (req, res, next) => {
    const checkStatus = ['approved', 'cancelled', 'pending'];
    const { status } = req.body;
    // console.log(status)
    // console.log(req.user)
    if (!(req?.user?.isAdmin === true)) {
        return res.status(400).json({ error: { admin: "you can perform only admin!" } })
    }

    if (!(checkStatus.includes(status))) return res.status(400).json({ error: { "status": "please provide valid status credentials!" } })
    const product = await Product.findOneAndUpdate({ _id: req.params.id }, {
        status: status
    }, { new: true }).populate({
        path: "user",
        select: "_id name sellerShop",
        populate: [
            {
                path: "sellerShop",
                select: "_id address location name",
            },
        ],
    });
    return res.status(200).json({ message: "product status has been successfully updated!", data: product })
}
module.exports = { productCreate, productUpdate, productRemove, getSignleProduct, productStatusUpdate }