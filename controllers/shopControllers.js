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
                    $push: { adminShop: { $each: [created._id], $position: 0 } }
                }, { new: true });
                return res.status(200).json({ message: `Shop Registration Successfully! Your '${name}' shop is approved!`, data: created });
            }
        }
        if ((req?.user?.role === 'seller')) {
            const seller = await Shop.findOne({ user: req.user._id });
            if (seller) {
                return res.status(400).json({ error: { "shop": "You have already created a seller Shop!" } })
            } if (!seller) {
                const created = await Shop.create({
                    name, phone, address, openDate, closeDate, email, user: req.user._id
                })
                if (!created) {
                    return res.status(400).json({ error: { "shop": "Shop Registration failed!" } })
                }
                if (created) {
                    const user = await User.findOne({ _id: req.user._id });
                    user.sellerShop = created._id;
                    await user.save();
                    return res.status(200).json({ message: `Shop Registration Successfully! Your '${name}' shop is Under Review. You will receive Confirmation Soon.`, data: created });
                }
            }
        } else {
            return res.status(400).json({ error: { "shop": "Permission denied! Buyers do not create the store." } })
        }

    } catch (error) {
        next(error)
    }
}
const updateShop = async (req, res, next) => {
    const { name, phone, address, openDate, closeDate, email } = req.body;
    try {
        const shop = await Shop.findOne({ user: req.user._id });
        if (!shop) return res.status(404).json({ error: { "shop": "shop not founds!" } })
        if (shop) {
            const shopUpdated = await Shop.findByIdAndUpdate(req.params.id, {
                name, phone, address, openDate, closeDate, email
            }, { new: true });
            if (!shopUpdated) {
                return res.status(400).json({ error: { "shop": "shop updated failed!" } })
            }
            if (shopUpdated) {
                return res.status(200).json({ message: "shop updated successfully!", data: shopUpdated })
            }
        }
    } catch (error) {
        next(error)
    }
}
const shopRemove = async (req, res, next) => {
    try {
        if (req?.user?.isAdmin === true) {
            const removeIt = await Shop.findByIdAndRemove(req.params.id);
            if (!removeIt) return res.status(400).json({ error: { "shop": "Shop not founds!" } });
            if (removeIt) {
                await User.findByIdAndUpdate(req.user?._id, {
                    $pull: { adminShop: { $each: [req.params.id], $position: 0 } }
                }, { new: true });
                return res.status(200).json({ message: `Shop successfully removed!` });
            }
        }
        if (req?.user?.role === 'seller') {
            const removeIt = await Shop.findByIdAndRemove(req.params.id);
            if (!removeIt) return res.status(400).json({ error: { "shop": "Shop not founds!" } });
            if (removeIt) {
                await User.findByIdAndUpdate(req.user?._id, {
                    $unset: { sellerShop: "" }
                }, { new: true });
                return res.status(200).json({ message: `Shop successfully removed!` });
            }
        }
    } catch (error) {
        next(error)
    }
}
module.exports = { shopRegister, updateShop, shopRemove };