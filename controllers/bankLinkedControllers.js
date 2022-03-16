const BankLinked = require("../models/bankLinkedModel");
const Notification = require("../models/notificationMdels");
const bankLinked = async (req, res, next) => {
    const { bank_acc_name, bank_acc_num, routing_num, bank_location } = req.body;
    try {
        const bankCheck = await BankLinked.findOne({ bank_owner: req.user._id })
        if (bankCheck) {
            return res.status(302).json({ error: { "bank": "you have already linked bank!" } })
        }
        const created = await BankLinked.create({
            bank_acc_name, bank_acc_num, routing_num, bank_location, bank_owner: req.user._id,
        })
        if (created) {
            const NotificationSendObj = {
                sender: req.user._id,
                receiver: [req.user._id],
                message: `Your Bank Account Linked Successfully! Manualy approve your Bank accounts!`,
            }
            await Notification.create(NotificationSendObj)
        }
        return res.status(200).json({ message: 'you have successfully bank linked!', data: created })
    }
    catch (error) {
        next(error)
    }
}
const bankLinkedUpdate = async (req, res, next) => {
    const { bank_acc_name, bank_acc_num, routing_num, bank_location } = req.body;
    try {
        const bankUpdated = await BankLinked.findOneAndUpdate({ _id: req.params.id }, {
            bank_acc_name, bank_acc_num, routing_num, bank_location
        }, { new: true });
        return res.status(200).json({ message: "you have successfully updated bank information!", data: bankUpdated })
    }
    catch (error) {
        next(error)
    }
}

const bankLinkedRemoved = async (req, res, next) => {
    try {
        // console.log(req.params.id?.trim())
        const del = await BankLinked.deleteOne({ _id: req.params.id?.trim() })
        if (del.acknowledged && del.deletedCount == 1) {
            return res.status(200).json({ "message": "Bank account successfully removed!" })
        } else {
            const NotificationSendObj = {
                sender: req.user._id,
                receiver: [req.user._id],
                message: `your Bank account successfully removed!`,
            }
            await Notification.create(NotificationSendObj)
            return res.status(400).json({ error: { "bank": 'bank removed failed! please try again!' } })
        }
    }
    catch (error) {
        next(error)
    }
}
const bankStatusAction = async (req, res, next) => {
    const { status } = req.body;
    if (!(req?.user?.isAdmin === true)) {
        return res.status(400).json({ error: { "status": "permission denied! you can perform only admin!" } })
    }
    const valided = ['pending', 'approved', 'rejected']
    if (!(valided.includes(status))) {
        return res.status(400).json({ error: { "status": "please provide valid status credentials!" } })
    }
    try {
        await BankLinked.findOneAndUpdate({ _id: req.params.id?.trim() }, {
            status: status
        }, { new: true })
            .then((doc) => {
                if (status === 'approved') {
                    const NotificationSendObj = {
                        sender: req.user._id,
                        receiver: [req.user._id],
                        message: `Congratulations! your bank account is approved!`,
                    }
                    Notification.create(NotificationSendObj)
                }
                if (status === 'rejected') {
                    const NotificationSendObj = {
                        sender: req.user._id,
                        receiver: [req.user._id],
                        message: `Unfortunately! your bank account is Rejected!`,
                    }
                    Notification.create(NotificationSendObj)
                }
                return res.status(200).json({ message: `Bank Account is ${status}`, data: doc })
            })
            .catch(error => res.status(400).json({ error: { "status": "bank status update faild!" } }));
    }
    catch (error) {
        next(error)
    }
}
module.exports = { bankLinked, bankLinkedUpdate, bankLinkedRemoved, bankStatusAction }