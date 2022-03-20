const BankLinked = require("../models/bankLinkedModel");
const Notification = require("../models/notificationMdels");
const bankLinked = async (req, res, next) => {
    const { bank_acc_name, address, bank_acc_num, bank_name, routing_num } = req.body;
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || 0;
    try {
        const bankCheck = await BankLinked.findOne({ bank_owner: req?.user?._id })
        if (bankCheck) {
            return res.status(302).json({ error: { "bank": "you have already linked bank!" } })
        }
        const created = await BankLinked.create({
            bank_acc_name, bank_acc_num, routing_num, address, bank_name, location: { latitude, longitude }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }, bank_owner: req?.user?._id,
        })
        if (created) {
            const NotificationSendObj = {
                sender: req?.user?._id,
                receiver: [req.user._id],
                message: `Your ${created?.bank_name} Bank Account Linked Successfully! Manualy approve your Bank accounts!`,
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
    const { bank_acc_name, bank_name, bank_acc_num, routing_num } = req.body;
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || 0;
    try {
        const bankUpdated = await BankLinked.findOneAndUpdate({ _id: req.params.id }, {
            bank_acc_name, bank_acc_num, bank_name, routing_num, location: { latitude, longitude }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] },
        }, { new: true });
        if (bankUpdated) {
            const NotificationSendObj = {
                sender: req?.user?._id,
                receiver: [bankUpdated?.bank_owner],
                message: `Your Bank ${bankUpdated?.bank_name} Account Linked Successfully! Manualy approve your Bank accounts!`,
            }
            await Notification.create(NotificationSendObj)
        }
        return res.status(200).json({ message: " your Bank Information Has Been Successfully updated.", data: bankUpdated })
    }
    catch (error) {
        next(error)
    }
}

const bankLinkedRemoved = async (req, res, next) => {
    try {
        const bankCheck = await BankLinked.findOne({ _id: req?.params?.id?.trim() });
        if (bankCheck) {
            const NotificationSendObj = {
                sender: req?.user?._id,
                receiver: [bankCheck?.bank_owner],
                message: `your ${bankCheck?.bank_name} Bank account successfully removed!`,
            }
            await Notification.create(NotificationSendObj)
        }
        const del = await BankLinked.deleteOne({ _id: req.params.id?.trim() })
        if (del.acknowledged && del.deletedCount == 1) {
            return res.status(200).json({ "message": "Bank account successfully removed!" })
        } else {
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
        const updatedBank = await BankLinked.findOneAndUpdate({ _id: req.params.id?.trim() }, {
            status: status
        }, { new: true });
        if (!updatedBank) {
            res.status(400).json({ error: { "status": "bank status updated failed! please provide valid credentials!" } });
        }
        if (updatedBank?.status === 'approved') {
            const NotificationSendObj = {
                sender: req?.user?._id,
                receiver: [updatedBank?.bank_owner],
                message: `Congratulations! your ${updatedBank?.bank_name} bank account is approved!`,
            }
            Notification.create(NotificationSendObj)
        }
        if (updatedBank?.status === 'rejected') {
            const NotificationSendObj = {
                sender: req?.user?._id,
                receiver: [updatedBank?.bank_owner],
                message: `Unfortunately! your ${updatedBank?.bank_name} bank account is Rejected! Please provide Valid Bank Informations!`,
            }
            Notification.create(NotificationSendObj)
        }
        return res.status(200).json({ message: `Bank Account is ${updatedBank?.status}`, data: doc })
    }
    catch (error) {
        next(error)
    }
}
module.exports = { bankLinked, bankLinkedUpdate, bankLinkedRemoved, bankStatusAction }