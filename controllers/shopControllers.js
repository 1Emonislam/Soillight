const Shop = require('../models/shopModel');
const shopRegister = async (req, res, next) => {
    const { name, phone, address, openDate, closeDate, email } = req.body;
    const shop = await Shop.findOne({ user: req.user._id });
    //seller permission shop create 
    // shop <1
    try {
        if (shop) {
            if (req?.user?.isAdmin === true) {
                const created = await Shop.create({
                    name, phone, address, openDate, closeDate, status: 'approved', email, user: req.user._id
                })
                if (!created) {
                    return res.status(400).json({ error: { "shop": "Shop Registration failed!" } })
                }
                if (created) {
                    return res.status(200).json({ message: `Shop Registration Successfully! Your '${name}' shop is approved!` });
                }
            }
            return res.status(302).json({ error: { "shop": "The store is already registered! The seller will only be able to create one store." } })
        }
        if (!shop) {
            if (req?.user?.isAdmin === true) {
                const created = await Shop.create({
                    name, phone, address, openDate, closeDate, status: 'approved', email, user: req.user._id
                })
                if (!created) {
                    return res.status(400).json({ error: { "shop": "Shop Registration failed!" } })
                }
                if (created) {
                    return res.status(200).json({ message: `Shop Registration Successfully! Your '${name}' shop is approved!` });
                }
            }
            if ((req?.user?.role === 'seller')) {
                const created = await Shop.create({
                    name, phone, address, openDate, closeDate, email, user: req.user._id
                })
                if (!created) {
                    return res.status(400).json({ error: { "shop": "Shop Registration failed!" } })
                }
                if (created) {
                    return res.status(200).json({ message: `Shop Registration Successfully! Your '${name}' shop is Under Review. You will receive Confirmation Soon.` });
                }
            } else {
                return res.status(400).json({ error: { "buyer": "Permission denied! You can perform only seller!" } })
            }
        }
    } catch (error) {
        next(error)
    }
}
module.exports = { shopRegister };