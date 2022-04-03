const Subscription = require('./../models/subscriptionModel')
const subscriptionAdd = async (req, res, next) => {
    if (!req?.user?._id) {
        return res.status(400).json({ error: { subscriber: "permision denied! please provide valid credentials!" } })
    }
    const { amount, duration, transaction_id, tx_ref } = req.body;
    try {
        const subs = await Subscription.create({
            amount, duration, transaction_id, tx_ref, subscriber: req.user._id
        })
        return res.status(201).json({ data: subs })
    }
    catch (error) {
        next(error)
    }
}
module.exports = { subscriptionAdd }