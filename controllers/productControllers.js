const Shop = require('../models/shopModel');
const Product = require('../models/productModel');
const Notification = require('../models/notificationMdels');
const productCreate = async (req, res, next) => {
    const { name, category, subCategory, packType, servingSize, insideSubCategory, img, quantity, price } = req.body;
    const issue = {};
    if (!name) {
        issue.name = "Please fill up the Product Name!";
    }
    if (!category) {
        issue.category = "Please fill up the Product CategoryId!"
    }
    if (!subCategory) {
        issue.subCategory = "Please fill up the Product Sub CategoryId!"
    }
    if (!packType) {
        issue.packType = "Please fill up the Product Pack Type!"
    }
    if (!servingSize) {
        issue.servingSize = "Please fill up the Product Serving Size!";
    }
    if (!price) {
        issue.price = "Please fill up the Product Price!"
    }
    if (!insideSubCategory) {
        issue.price = "Please fill up the inside sub category!"
    }
    if (Object.keys(issue)?.length) {
        return res.status(400).json({ error: issue })
    }
    try {
        const shop = await Shop.findOne({ user: req?.user?._id });
        if (!shop) {
            return res.status(400).json({ error: { "product": "Shop registration required! Register Your Own Store!" } })
        }
        if (shop) {
            if (req?.user?.isAdmin === true) {
                const productCreated = await Product.create({
                    name, category, subCategory, packType, insideSubCategory, servingSize, status: 'approved', shop: shop._id, quantity, price, img, user: req?.user?._id
                });
                if (!productCreated) {
                    return res.status(400).json({ error: { "product": "Products submission failed! Please try again!" } })
                }
                if (productCreated) {
                    const NotificationSend = {
                        sender: req?.user?._id,
                        receiver: [req.user._id],
                        message: `Congratulations! The product is approved!.`,
                    };
                    await Notification.create(NotificationSend);
                    const resData = await Product.findOne({ _id: productCreated?._id }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize","_id servingSize");
                    return res.status(200).json({ message: "Product submission successfully! The product is approved!.", data: resData })
                }
            }
            if ((req?.user?.role === 'seller')) {
                const productCreated = await Product.create({
                    name, category, insideSubCategory, subCategory, packType, servingSize, quantity, price, img, user: req?.user?._id
                });
                if (!productCreated) {
                    return res.status(400).json({ error: { "product": "Products submission failed! Please try again!" } })
                }
                if (productCreated) {
                    const NotificationSend = {
                        sender: req?.user?._id,
                        receiver: [req.user._id],
                        message: `Your products are Under Review. You will Receive Confirmation Soon. you Can Check the status in products section once registered.`,
                    };
                    await Notification.create(NotificationSend);
                    const resData = await Product.findOne({ _id: productCreated?._id }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize","_id servingSize").populate("servingSize","_id servingSize");
                    return res.status(200).json({ message: "Your products are Under Review. You will Receive Confirmation Soon. you Can Check the status in products section once registered.", data: resData })
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
    const { name, category, subCategory, packType, insideSubCategory, servingSize, img, quantity, price } = req.body;
    try {
        if (!(req?.user?.role === 'seller' || req?.user?.isAdmin === true)) {
            return res.status(400).json({ error: { "product": "Permission denied! Buyers do not update the products!." } })
        } else {
            const productUpdated = await Product.findByIdAndUpdate(req.params.id, {
                name, category, subCategory, packType, servingSize, insideSubCategory, img, quantity, price
            }, { new: true }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize","_id servingSize");
            if (!productUpdated) {
                return res.status(400).json({ error: { "product": "Product not founds!" }, data: [] })
            }
            const productOwner = await Product.findOne({ _id: req.params.id }).populate("user", "_id name")
            if (productUpdated) {
                const NotificationSend = {
                    sender: req?.user?._id,
                    receiver: [productOwner?.user?._id],
                    message: `Your ${productOwner?.name} product updated successfully!`,
                };
                await Notification.create(NotificationSend);
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
                return res.status(400).json({ error: { "product": "Product not founds!" }, data: [] })
            }
            const productOwner = await Product.findOne({ _id: req.params.id }).populate("user", "_id name")
            if (productRemove) {
                const NotificationSend = {
                    sender: req?.user?._id,
                    receiver: [productOwner?.user?._id],
                    message: `Unfortunately Your ${productOwner?.name} Product Has Been Removed!`,
                };
                await Notification.create(NotificationSend);
                return res.status(200).json({ message: `Product ${productOwner?.name} removed successfully!` })
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
            select: "_id name sellerShop pic",
            populate: [
                {
                    path: "sellerShop",
                    select: "_id address location name",
                },
            ],
        }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize","_id servingSize");
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
    const productCheck = await Product.findOne({ _id: req.params.id }).populate({
        path: "user",
        select: "_id name sellerShop pic",
        populate: [
            {
                path: "sellerShop",
                select: "_id address location name",
            },
        ],
    }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize","_id servingSize");
    if (!productCheck) {
        return res.status(404).json({ error: { "product": "product not founds!" }, data: [] })
    }
    if (productCheck?.status === 'approved' && status === 'approved') {
        return res.status(400).json({ error: { "status": "you have already approved product please update another status!" } })
    }
    if (productCheck?.status === 'cancelled' && status === 'cancelled') {
        return res.status(400).json({ error: { "status": "you have already Cancelled product please update another status!" } })
    }
    if (productCheck?.status === 'pending' && status === 'pending') {
        return res.status(400).json({ error: { "status": "you have already Pending product please update another status!" } })
    }
    const product = await Product.findOneAndUpdate({ _id: req.params.id }, {
        status: status
    }, { new: true }).populate({
        path: "user",
        select: "_id name sellerShop pic",
        populate: [
            {
                path: "sellerShop",
                select: "_id address location name",
            },
        ],
    }).populate("category", "_id category").populate("subCategory", "_id subCategory").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize","_id servingSize");
    if (product?.status === 'approved') {
        const NotificationSend = {
            sender: req?.user?._id,
            receiver: [product?.user?._id],
            message: `Congratulations! Your product has been ${status}`,
        }
        Notification.create(NotificationSend)
    }
    if (product?.status === 'cancelled' || 'pending') {
        const NotificationSend = {
            sender: req?.user?._id,
            receiver: [product?.user?._id],
            message: `Unfortunately! Your product has been ${status}`,
        }
        Notification.create(NotificationSend)
    }
    return res.status(200).json({ message: `product status has been successfully ${status}`, data: product })
}
module.exports = { productCreate, productUpdate, productRemove, getSignleProduct, productStatusUpdate }