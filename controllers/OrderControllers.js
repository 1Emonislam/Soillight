const Order = require("../models/ordersModel")
const orderAdd = async (req, res, next) => {
    const { products, transaction_id, tx_ref } = req.body;
    try {
        const created = await Order.create({
            user: req.user._id,
            transaction_id,
            tx_ref,
            products
        })

        if (!created) {
            return res.status(400).json({ error: { order: "something wrong data saving!" } })
        }
        if (created) {
            return res.status(200).json({ message: "order successfully!", data: created });
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports = { orderAdd }