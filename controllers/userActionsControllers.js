const Notification = require("../models/notificationMdels");
const User = require("../models/userModel");

const userActionAccount = async (req, res, next) => {
    try {
        const { userId, action } = req.body;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ error: { action: `user doesn't exist` } })
        }
        user.action = action || user.action;
        const save = await user.save();
        if (save.action === 'block') {
            const sendNotification = {
                sender: user?._id,
                receiver: user?._id,
                message: `Your account has been temporarily blocked.`
            }
            await Notification.create(sendNotification)
        }
        if (save.action === 'closed') {
            const sendNotification = {
                sender: user?._id,
                receiver: user?._id,
                message: `Your account has been temporarily closed.`
            }
            await Notification.create(sendNotification)
        }
        if (save.action === 'active') {
            const sendNotification = {
                sender: user?._id,
                receiver: user?._id,
                message: `Congratulations! your account has been active`
            }
            await Notification.create(sendNotification)
        }
        if (save.action === 'inactive') {
            const sendNotification = {
                sender: user?._id,
                receiver: user?._id,
                message: `Your account has been temporarily inactive. contact customer support`
            }
            await Notification.create(sendNotification)
        }
        return res.status(200).json({ message: `User successfully ${save.action || ''}` })
    }
    catch (error) {
        next(error)
    }
}
module.exports = {
    userActionAccount,

}