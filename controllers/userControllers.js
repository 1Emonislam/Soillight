const User = require('../models/userModel');
const { genToken } = require('../utils/genToken');
const login = async (req, res, next) => {
    let { email, password } = req.body;
    email?.toLowerCase();
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: { "email": "Could not find user" } })
        }
        if (!(user && (await user.matchPassword(password)))) {
            return res.status(400).json({ error: { "password": "Password invalid! please provide valid password!" } });
        } else if (user && (await user.matchPassword(password))) {
            return res.status(200).json({ message: "Login Successfully!", data: user, token: genToken(user._id) });
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
    if (userExist) {
        return res.status(302).json({ error: { "buyer": "Already exists! please login!" } })
    }
    try {
        const created = await User.create({ name, phone, email, role: 'buyer', password, address });
        if (!created) {
            return res.status(400).json({ error: { "buyer": "Buyer Registration failed!" } });
        }
        if (created) {
            return res.status(200).json({ message: "Buyer Registration successfully!", data: created, token: genToken(created._id) })
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
    if (userExist) {
        return res.status(302).json({ error: { "seller": "Already exists! please login!" } })
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
            return res.status(200).json({ message: "Seller Registration successfully!", data: created, token: genToken(created._id) })
        }
    }
    catch (error) {
        next(error)
    }

}

const registrationRider = async (req, res, next) => {
    let { name, email, phone, password, valid_id, license_card, address } = req.body;
    let { verify_id, back_side_id, front_side_id } = valid_id;
    let { verify_card, back_side_card, front_side_card } = license_card;
    email?.toLowerCase();
    function validateEmail(elementValue) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
        return res.status(400).json({ error: { email: "Email Invalid! Please provide a valid Email!" } })
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(302).json({ error: { "rider": "Already exists! please login!" } })
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
            return res.status(200).json({ message: "Rider Registration successfully!", data: created, token: genToken(created._id) })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { registrationSeller, registrationBuyer, registrationRider, login };