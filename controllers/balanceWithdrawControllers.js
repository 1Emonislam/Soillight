const BalanceWithdraw = require('../models/balanceWithdrawModels');
const User = require('../models/userModel');
const BankLinked = require('../models/bankLinkedModel');
const Notification = require('../models/notificationMdels');
const { BalanceAdd, MyBalance } = require('../models/myBalance');
const myBalanceAdd = async (req, res, next) => {
    try {
        if (!req.user?._id) {
            return res.status(400).json({ error: { email: "Permission denied Please Login Before access this page" } })
        }
        const { amount, transaction_id, tx_ref } = req.body;
        const balanceAdded = await BalanceAdd.create({ amount, transaction_id, tx_ref, user: req.user?._id });
        if (!balanceAdded) {
            return res.status(400).json({ error: { my_balance: 'Balance added failed!' } })
        }
        if (balanceAdded) {
            const myBalance = await MyBalance.findOneAndUpdate({ user: req.user?._id }, { $inc: { balance: balanceAdded?.amount } },
                { new: true });
            const notificationObj = {
                receiver: req.user?._id,
                message: `Congratulations you have added New Balance ${balanceAdded.amount} Total balance available ${myBalance.balance}`,
            }
            await Notification.create(notificationObj);
            return res.status(200).json({ message: `Congratulations you have added New Balance ${balanceAdded.amount} Total balance available ${myBalance.balance}`, data: myBalance });
        }
    }
    catch (error) {
        next(error)
    }
}
const myBalanceGet = async (req, res, next) => {
    try {
        const myBalance = await User.findOne({ _id: req?.user?._id }).select("my_balance").populate("my_balance")
        return res.status(200).json({ data: myBalance })
    }
    catch (error) {
        next(error)
    }
}
const balanceWithdraw = async (req, res, next) => {
    let { amount, tax } = req.body;
    try {
        // console.log(req.user)
        if (!req.user?._id) {
            return res.status(400).json({ error: { token: 'Please Login Before access this page!' } })
        }
        const myBalance = await MyBalance.findOne({ user: req?.user?._id }).populate("user", "name");
        // console.log(myBalance)
        const bankLinked = await BankLinked.findOne({ bank_owner: req?.user?._id });
        if (!bankLinked) {
            return res.status(400).json({ error: { "withdraw": "please bank linked before withdrawing your balance" } })
        }
        // console.log(myBalance)
        if (!myBalance) {
            return res.status(400).json({ error: { "withdraw": "bad request please try again! provide valid credentials" } })
        }
        if (myBalance?.balance === 0) {
            return res.status(406).json({ error: { "withdraw": `You dont'n have enough balance to Insufficient Balance Withdraw incomplete! your account balance is ${myBalance?.balance} ` }, status: "incomplete" });
        }
        if (tax && amount) {
            amount = (Number(amount) + Number(tax));
        } else {
            amount = Number(amount);
        }
        if (myBalance?.balance < amount) {
            return res.status(406).json({ error: { "withdraw": `You don't have enough balance to Insufficient Balance Withdraw incomplete! your account balance is ${myBalance?.balance} ` }, status: "incomplete" });
        }
        const updateTransaction = await MyBalance.findOneAndUpdate(
            {
                user: req?.user?._id
            },
            { $inc: { balance: -amount } },
            { new: true }
        );

        const NotificationSendObj = {
            sender: req?.user?._id,
            receiver: [req.user._id],
            message: `Congratulations!  ${myBalance?.user?.name}  Your withdrawal balance transaction is complete. Manualy approve your Transaction!`,
        }
        const withdraw = await BalanceWithdraw.create({
            amount,
            tax,
            user: req?.user?._id,
            bank_pay: bankLinked._id,
        })
        function withdrawTrans(length, id) {
            for (var s = ''; s.length < length; s += `${id}abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01`.charAt(Math.random() * 62 | 0));
            return s;
        }
        if (withdraw) {
            withdraw.transaction_id = withdrawTrans(10, withdraw?._id);
            await withdraw.save();
            await Notification.create(NotificationSendObj);
            return res.status(200).json({ message: `Congratulations! ${myBalance?.user?.name} Your withdrawal balance transaction is complete. Manualy approve your Transaction!`, data: withdraw });
        }
    }
    catch (error) {
        next(error)
    }
}
const withdrawTransAcction = async (req, res, next) => {
    try {
        if (!(req?.user?.isAdmin === true)) {
            return res.status(400).json({ error: { "status": "permission denied! please provide admin credentials!" } })
        }
        const { status } = req.body;
        const arrCheck = ['approved', 'cancelled', 'pending'];
        if (!(arrCheck.includes(status))) {
            return res.status(400).json({ error: { status: "please provide valid status credentials!" } })
        }
        if (req?.user?.isAdmin === true) {
            const statusUpdated = await BalanceWithdraw.findOneAndUpdate({ _id: req.params.id }, {
                status: status
            }, { new: true }).populate("bank_pay").populate({
                path: "user",
                select: "_id name sellerShop pic",
                populate: [
                    {
                        path: "sellerShop",
                        select: "_id address location name",
                    },
                ],
            });
            if (status === 'approved') {
                const NotificationSend = {
                    sender: req?.user?._id,
                    receiver: [statusUpdated.user],
                    message: `Congratulations! Your Withdrawal Transaction is Approved!`,
                };
                await Notification.create(NotificationSend);
            }
            if (status === 'cancelled') {
                const NotificationSend = {
                    sender: req?.user?._id,
                    receiver: [statusUpdated.user],
                    message: `Unfortunately! Your Withdrawal Transaction is Cancelled!`,
                };
                await Notification.create(NotificationSend);
            }
            return res.status(200).json({ message: `Withdraw Transaction is ${status}!`, data: statusUpdated })
        }
    }
    catch (error) {
        next(error)
    }
}

const withdrawStatusByHistory = async (req, res, next) => {
    let { status, page = 1, limit = 10 } = req.query;
    limit = parseInt(limit);
    // console.log(status)
    try {
        if (!(req?.user?.isAdmin === true)) {
            return res.status(400).json({ error: { "status": "permission denied! you can perform only admin!" } })
        }

        const keyword = req.query.search?.trim() ? {
            $or: [
                { transaction_id: { $regex: req.query.search?.trim(), $options: "i" }, },
            ], status: status?.trim()
        } : { status: status?.trim() };
        const withdraw = await BalanceWithdraw.find(keyword).populate("bank_pay", "bank_acc_num").populate({
            path: "user",
            select: "_id name sellerShop pic",
            populate: [
                {
                    path: "sellerShop",
                    select: "_id address location name",
                },
            ],
        }).sort({ "createdAt": 1, _id: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const count = await BalanceWithdraw.find(keyword).count();
        return res.status(200).json({ "message": "balance data successfully fetch!", count, data: withdraw })

    }
    catch (error) {
        next(error)
    }
}
const getWithdrawSingle = async (req, res, next) => {
    if (!(req?.user?.isAdmin === true)) {
        return res.status(400).json({ error: { "status": "permission denied! you can perform only admin!" } })
    }
    try {
        const withdraw = await BalanceWithdraw.findOne({ _id: req.params.id }).populate("bank_pay").populate({
            path: "user",
            select: "_id name sellerShop pic",
            populate: [
                {
                    path: "sellerShop",
                    select: "_id address location name",
                },
            ],
        });
        return res.status(200).json({ data: withdraw })
    }
    catch (error) {
        next(error)
    }
}
module.exports = {
    myBalanceGet,
    balanceWithdraw,
    getWithdrawSingle,
    withdrawTransAcction,
    withdrawStatusByHistory,
    myBalanceAdd
};