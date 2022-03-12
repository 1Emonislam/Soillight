const BalanceWithdraw = require('../models/balanceWithdrawModels');
const MyBalance = require('../models/myBalance');
const Notification = require('../models/notificationMdels');
const balanceWithdraw = async (req, res, next) => {
    const { amount, transaction_id, tx_ref } = req.body;
    try {
        const withdraw = await BalanceWithdraw.create({
            amount, transaction_id, tx_ref, user: req.user._id,
        })
        if (withdraw) {
        const myBalance = await MyBalance.findOne({ user: req.user._id }).populate("user", "name");
        if(myBalance?.balance === 0){
            return res.status(406).json({ error: { "withdraw": `You dont'n have enough balance to Insufficient Balance Withdraw incomplete! your account balance is ${myBalance?.balance} `},status:"incomplete" });
        }
        if (myBalance?.balance < Number(amount)) {
            return res.status(406).json({ error: { "withdraw": `You don't have enough balance to Insufficient Balance Withdraw incomplete! your account balance is ${myBalance?.balance} `},status:"incomplete" });
            }
            const updateTransaction = await MyBalance.findOneAndUpdate(
                {
                    user: req.user._id
                },
                { $inc: { balance: -myBalance?.balance } },
                { new: true }
            );
            const NotificationSendObj = {
                sender: req.user._id,
                receiver: [...req.user._id],
                message: `Congratulations!  ${myBalance?.name}  Withdraw Balance Transaction Complete. Manualy approve your Transaction!`,
            }
            await Notification.create(NotificationSendObj);
            myBalance.status = "pending";
            await myBalance.save();
            return res.status(200).json({ message: "order Successfully Completed! automatic added seller balance Transaction Complete!", data: order });
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports = { balanceWithdraw };