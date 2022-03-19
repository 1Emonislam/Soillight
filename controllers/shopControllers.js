const Shop = require('../models/shopModel');
const User = require('../models/userModel')
const shopRegister = async (req, res, next) => {
    const { name, phone, address, openDate, closeDate, email } = req.body;
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || -0;
    const seller = await Shop.findOne({ user: req?.user?._id });
    // console.log(req.user)
    try {
        if (req?.user?.isAdmin === true) {
            if (seller) {
                const shopUpdated = await Shop.findOneAndUpdate({ user: req?.user?._id }, {
                    name, phone, address, openDate, closeDate, email, location: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] },
                }, { new: true });
                return res.status(200).json({ message: "shop update successfully!", shopUpdated })
            }
            const created = await Shop.create({
                name, phone, address, openDate, closeDate, status: 'approved', email, user: req?.user?._id
            })
            if (created) {
                await User.findByIdAndUpdate(req.user?._id, {
                    $push: { adminShop: { $each: [created._id], $position: 0 } }
                }, { new: true });
                await User.findByIdAndUpdate(req.user?._id, {
                    $unset: { sellerShop: "" }
                }, { new: true });
                return res.status(200).json({ message: `Shop Registration Successfully! Your '${name}' shop is approved!`, data: created });
            }
        }
        if ((req?.user?.role === 'seller')) {
            if (seller) {
                const shopUpdated = await Shop.findOneAndUpdate({ user: req?.user?._id }, {
                    name, phone, address, openDate, closeDate, email, location: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] },
                }, { new: true });
                return res.status(200).json({ message: "shop update successfully!", shopUpdated })
            }
            if (!seller) {
                const created = await Shop.create({
                    name, phone, address, openDate, location: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }, closeDate, email, user: req?.user?._id
                })
                if (!created) {
                    return res.status(400).json({ error: { "shop": "Shop Registration failed!" },data:[] })
                }
                if (created) {
                    const user = await User.findOne({ _id: req?.user?._id });
                    user.sellerShop = created._id;
                    await user.save();
                    await User.findByIdAndUpdate(req.user?._id, {
                        $unset: { adminShop: "" },
                    }, { new: true });
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
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || -0;
    try {
        if (!(req?.user?.role === 'seller' || req?.user?.isAdmin === true)) {
            return res.status(400).json({ error: { "shop": "Permission denied! Buyers do not update the store." } })
        } else {
            const shop = await Shop.findOne({ user: req?.user?._id });
            if (!shop) return res.status(404).json({ error: { "shop": "shop not founds!" },data:[] })
            if (shop) {
                const shopUpdated = await Shop.findByIdAndUpdate(req.params.id, {
                    name, phone, address, openDate, closeDate, email, location: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] },
                }, { new: true });
                if (!shopUpdated) {
                    return res.status(400).json({ error: { "shop": "shop not founds!" },data:[] })
                }
                if (shopUpdated) {
                    return res.status(200).json({ message: "shop updated successfully!", data: shopUpdated })
                }
            }
        }
    } catch (error) {
        next(error)
    }
}
const shopRemove = async (req, res, next) => {
    try {
        if (!(req?.user?.role === 'seller' || req?.user?.isAdmin === true)) {
            return res.status(400).json({ error: { "shop": "Permission denied! Buyers do not remove the store." } })
        } else {
            if (req?.user?.isAdmin === true) {
                const removeIt = await Shop.findByIdAndRemove(req.params.id);
                if (!removeIt) return res.status(400).json({ error: { "shop": "Shop not founds!" },data:[] });
                if (removeIt) {
                    await User.findByIdAndUpdate(req.user?._id, {
                        $pull: { adminShop: req.params.id },
                    }, { new: true });
                    return res.status(200).json({ message: `Shop successfully removed!` });
                }
            }
            if (req?.user?.role === 'seller') {
                const removeIt = await Shop.findByIdAndRemove(req.params.id);
                if (!removeIt) return res.status(400).json({ error: { "shop": "Shop not founds!"},data:[] });
                if (removeIt) {
                    await User.findByIdAndUpdate(req.user?._id, {
                        $unset: { sellerShop: "" }
                    }, { new: true });
                    await User.findByIdAndUpdate(req.user?._id, {
                        $unset: { adminShop: "" },
                    }, { new: true });
                    return res.status(200).json({ message: `Shop successfully removed!` });
                }
            }
        }
    } catch (error) {
        next(error)
    }
}

const myShop = async (req, res, next) => {
    // console.log(req.user)
    try {
        const shop = await Shop.findOne({ user: req?.user?._id });
        if (!shop) return res.status(400).json({ error: { "shop": "shop not founds!" }, data: [] });
        if (shop) return res.status(200).json({ data: shop });
    }
    catch (error) {
        next(error)
    }
}
module.exports = { shopRegister, updateShop, shopRemove, myShop };