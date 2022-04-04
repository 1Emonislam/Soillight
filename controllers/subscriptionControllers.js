const Notification = require('../models/notificationMdels');
const Subscription = require('./../models/subscriptionModel');
const User = require('./../models/subscriptionModel');
const subscriptionAdd = async (req, res, next) => {
    if (!req?.user?._id) {
        return res.status(400).json({ error: { subscriber: "permision denied! please provide valid credentials!" } })
    }
    const { amount, duration, transaction_id, tx_ref } = req.body;
    const user = await User.findOne({ _id: req.user._id })
    try {
        const subs = await Subscription.create({
            amount, duration, transaction_id, status: 'approved', tx_ref, subscriber: req.user._id
        })
        if (subs) {
            user.subscription = subs?._id;
            await user.save();
            const sendNotification = {
                sender: req?.user?._id,
                receiver: [subs.subscriber],
                message: `Congratulations! Your Subscription Duration ${subs.duration} Amount is ${subs.amount}`
            }
            await Notification.create(sendNotification)
            return res.status(201).json({ data: subs })
        }
    }
    catch (error) {
        next(error)
    }
}
const singleSubscriptionGet = async (req, res, next) => {
    try {
        if (!req?.user?._id) {
            return res.status(400).json({ error: { subscriber: 'please provide valid credentials!' } });

        }
        const subs = await Subscription.findOne({ subscriber: req?.user?._id, _id: req?.params?._id });
        return res.status(200).json({ data: subs });
    }
    catch (error) {
        next(error)
    }
}
const mySubscriptionAllGet = async (req, res, next) => {
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    try {
        if (!req?.user?._id) {
            return res.status(400).json({ error: { subscriber: 'please provide valid credentials!' } });
        }
        const subs = await Subscription.find({ subscriber: req?.user?._id }).limit(limit * 1).skip((page - 1) * limit);
        const count = await Subscription.find({ subscriber: req?.user?._id }).count();
        return res.status(200).json({ count, data: subs })
    }
    catch (error) {
        next(error)
    }
}
module.exports = { subscriptionAdd, singleSubscriptionGet, mySubscriptionAllGet }