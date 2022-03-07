const Order = require("../models/ordersModel")
const Order = async (req, res, next) => {
    const { productId, quantity, transaction_id, tx_ref, price } = req.body;
  try{
    const created = await Order.create({
        user: req.user._id,
        transaction_id,
        tx_ref,
        products: [{
            productId,
            quantity,
            price
        }]
    })
    if (!created) {
        return res.status(400).json({ error: { order: "something wrong data sving!" } })
    }
    if (created) {
        return res.status(200).json({ message: "order successfully!", data: created });
    }
  }
  catch(error){
    next(error)
  }
}
module.exports = { Order }