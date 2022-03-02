const User = require('../models/userModel');
const ProductReview = require('../models/productReviewModel');
const { genToken } = require('../utils/genToken');
const singleUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const finding = await ProductReview.find({ user: id });
        let totalRate = finding?.length;
        let avgRating = finding?.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
        const user = await User.findOne({ _id: id }).populate("sellerShop","-user");
        return res.status(200).json({ totalRate, avgRating, data: user })
    }
    catch (error) {

    }
}

const login = async (req, res, next) => {
    let { email, password } = req.body;
    email?.toLowerCase();
    const user = await User.findOne({ email });
    try {
        if (!user) {
            return res.status(400).json({ error: { "email": "Could not find user" } })
        }
        if (!(user && (await user.matchPassword(password)))) {
            return res.status(400).json({ error: { "password": "Password invalid! please provide valid password!" } });
        } else if (user && (await user.matchPassword(password))) {
            const userExists = await User.findOne({ email }).select("-password");
            return res.status(200).json({ message: "Login Successfully!", data: userExists, token: genToken(user._id) });
        }
    }
    catch (error) {
        next(error)
    }
}
const registrationBuyer = async (req, res, next) => {
    let { name, phone, email, password, address } = req.body;
    email?.toLowerCase();
    function validateEmail(elementValue) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
        return res.status(400).json({ error: { email: "Email Invalid! Please provide a valid Email!" } })
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if (userExist) {
        return res.status(302).json({ error: { "buyer": "Already exists! please login!" } })
    }
    if (phoneExist) {
        return res.status(302).json({ error: { "buyer": "This phone number is linked to another account, please enter another number." } })
    }
    try {
        const created = await User.create({ name, phone, email, role: 'buyer', status: 'approved', password, address });
        if (!created) {
            return res.status(400).json({ error: { "buyer": "Buyer Registration failed!" } });
        }
        if (created) {
            const userRes = await User.findOne({ _id: created._id }).select("-password");
            return res.status(200).json({ message: "Buyer Registration successfully!", data: userRes, token: genToken(created._id) })
        }
    }
    catch (error) {
        next(error)
    }

}
const registrationSeller = async (req, res, next) => {
    let { name, phone, email, password, address } = req.body;
    email?.toLowerCase();
    function validateEmail(elementValue) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
        return res.status(400).json({ error: { email: "Email Invalid! Please provide a valid Email!" } })
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if (userExist) {
        return res.status(302).json({ error: { "buyer": "Already exists! please login!" } })
    }
    if (phoneExist) {
        return res.status(302).json({ error: { "buyer": "This phone number is linked to another account, please enter another number." } })
    }
    if (!address) {
        return res.json({ error: { address: "Please fillup the Address!" } })
    }
    try {
        const created = await User.create({ name, phone, email, role: 'seller', password, address });

        if (!created) {
            return res.status(400).json({ error: { "seller": "Seller Registration failed!" } });
        }
        if (created) {
            const userRes = await User.findOne({ _id: created._id }).select("-password");
            return res.status(200).json({ message: "Seller Registration successfully!", data: userRes, token: genToken(created._id) })
        }
    }
    catch (error) {
        next(error)
    }

}

const registrationRider = async (req, res, next) => {
    let { name, email, phone, password, address } = req.body;
    let verify_id = req?.body?.valid_id?.verify_id;
    let back_side_id = req?.body?.valid_id?.back_side_id;
    let front_side_id = req?.body?.valid_id?.front_side_id;
    let verify_card = req?.body?.license_card?.verify_card;
    let back_side_card = req?.body?.license_card?.back_side_card;
    let front_side_card = req?.body?.license_card?.front_side_card;
    email?.toLowerCase();
    function validateEmail(elementValue) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
        return res.status(400).json({ error: { email: "Email Invalid! Please provide a valid Email!" } })
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if (userExist) {
        return res.status(302).json({ error: { "buyer": "Already exists! please login!" } })
    }
    if (phoneExist) {
        return res.status(302).json({ error: { "buyer": "This phone number is linked to another account, please enter another number." } })
    }
    if (!address) {
        return res.json({ error: { address: "Please fillup the Address!" } })
    }
    if (!front_side_id) {
        return res.json({ error: { "front_side_id": "Please fillup the valided front side ID!" } });
    }
    if (!back_side_id) {
        return res.json({ error: { "back_side_id": "Please fillup the valided back side ID!" } });
    }
    if (!front_side_card) {
        return res.json({ error: { "back_side_card": "Please fillup the license card valided front side!" } });
    }
    if (!back_side_card) {
        return res.json({ error: { "back_side_id": "Please fillup the license card  valided back side!" } });
    }
    try {
        const created = await User.create({ name, email, role: 'rider', phone, password, address, valid_id: { verify_id, back_side_id, front_side_id }, license_card: { verify_card, back_side_card, front_side_card } });
        if (!created) {
            return res.status(400).json({ error: { "rider": "Rider Registration failed!" } });
        }
        if (created) {
            const userRes = await User.findOne({ _id: created._id }).select("-password");
            return res.status(200).json({ message: "Rider Registration successfully!", data: userRes, token: genToken(created._id) })
        }
    } catch (error) {
        next(error)
    }
}
const profileUpdate = async (req, res, next) => {
    let { name, email, role, phone, password, address } = req.body;
    let verify_id = req?.body?.valid_id?.verify_id;
    let back_side_id = req?.body?.valid_id?.back_side_id;
    let front_side_id = req?.body?.valid_id?.front_side_id;
    let verify_card = req?.body?.license_card?.verify_card;
    let back_side_card = req?.body?.license_card?.back_side_card;
    let front_side_card = req?.body?.license_card?.front_side_card;
    try {
        if (!(req?.user?.role === 'seller' || 'buyer' || 'rider')) {
            return res.status(400).json({ error: { "role": "profile update permission denied! please switch to another role!" } })
        }
        if (req?.user?.role === 'buyer') {
            const updatedCheck = await User.findOneAndUpdate({ _id: req.user._id }, {
                name, email, role: role || req.user.role, phone, address, password
            }, { new: true });
            if (!updatedCheck) {
                return res.status(304).json({ error: { buyer: "Buyer profile update failed!" } })
            } if (updatedCheck) {
                const resData = await User.findOne({ _id: updatedCheck._id }).select("-password")
                return res.status(200).json({ message: "Buyer profile updated successfully!", data: resData })
            }
        }
        if (req?.user?.role === 'seller') {
            const updatedCheck = await User.findOneAndUpdate({ _id: req.user._id }, {
                name, email, role: role || req.user.role, phone, address, password
            }, { new: true })
            if (!updatedCheck) {
                return res.status(304).json({ error: { seller: "Seller profile update failed!" } })
            } if (updatedCheck) {
                const resData = await User.findOne({ _id: updatedCheck._id }).select("-password")
                return res.status(200).json({ message: "Seller profile updated successfully!", data: resData })
            }
        }
        if (req?.user?.role === 'rider') {
            const updatedCheck = await User.findOneAndUpdate({ _id: req.user._id }, {
                name, email, phone, password, role: role || req.user.role, address, valid_id: { verify_id, back_side_id, front_side_id }, license_card: { verify_card, back_side_card, front_side_card }
            }, { new: true }).select("-password");
            if (!updatedCheck) {
                return res.status(304).json({ error: { rider: "Rider profile update failed!" } })
            } if (updatedCheck) {
                const resData = await User.findOne({ _id: updatedCheck._id }).select("-password")
                return res.status(200).json({ message: "Rider profile updated successfully!", data: resData })
            }
        }
    } catch (error) {
        next(error)
    }
}


module.exports = { login, registrationSeller, registrationBuyer, registrationRider, profileUpdate,singleUser };