const Shop = require('../models/shopModel');
const User = require('../models/userModel')
const shopRegister = async (req, res, next) => {
    const { name, phone, address, openDate, closeDate, email } = req.body;
    try {
        if (req?.user?.isAdmin === true) {
            const created = await Shop.create({
                name, phone, address, openDate, closeDate, status: 'approved', email, user: req.user._id
            })
            if (!created) {
                return res.status(400).json({ error: { "shop": "Shop Registration failed!" } })
            }
            if (created) {
                await User.findByIdAndUpdate(req.user?._id, {
                    $push: { shop: { $each: [created._id], $position: 0 } }
                }, { new: true });
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
                await User.findByIdAndUpdate(req.user?._id, {
                    $push: { shop: { $each: [created._id], $position: 0 } }
                }, { new: true });
                return res.status(200).json({ message: `Shop Registration Successfully! Your '${name}' shop is Under Review. You will receive Confirmation Soon.` });
            }
        }

    } catch (error) {
        next(error)
    }
}
module.exports = { shopRegister };