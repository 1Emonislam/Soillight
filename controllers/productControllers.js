const Shop = require('../models/shopModel');
const Product = require('../models/productModel');
const productCreate = async (req, res, next) => {
    const { name, category, subCategory, pack_type, serving_size, quantity, price } = req.body;
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
        const shop = await Shop.findOne({ user: req.user._id });
        if (!shop) {
            return res.status(400).json({ error: { "shop": "Shop registration required! Register Your Own Store!" } })
        }
        if (shop) {
            if (req?.user?.isAdmin === true) {
                const productCreated = await Product.create({
                    name, category, subCategory, pack_type, serving_size, status: 'approved', quantity, price, shop: shop._id, user: req.user._id
                });
                if (!productCreated) {
                    return res.status(400).json({ error: { "admin": "Products submission failed! Please try again!" } })
                }
                if (productCreated) {
                    return res.status(200).json({ message: "Product submission successfully! The product is approved!." })
                }
            }
            if ((req?.user?.role === 'seller')) {
                const productCreated = await Product.create({
                    name, category, subCategory, pack_type, serving_size, quantity, price, shop: shop._id, user: req.user._id
                });
                if (!productCreated) {
                    return res.status(400).json({ error: { "seller": "Products submission failed! Please try again!" } })
                }
                if (productCreated) {
                    return res.status(200).json({ message: "Your products are Under Review. You will Receive Confirmation Soon. you Can Check the status in products section once registered." })
                }
            } else {
                return res.status(400).json({ error: { "buyer": "Permission denied! You can perform only seller!" } })
            }
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports = { productCreate }