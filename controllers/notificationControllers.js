const Notification = require("../models/notificationMdels");

const getMyNotification = async (req, res, next) => {
    const lastWeek = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
    const today = new Date();
    const notificationToday = await Notification.find({ timestamp: { $gte: today }, receiver: req.user?._id }).limit(100);
    const notificationLastWeak = await Notification.find({ timestamp: { $gte: lastWeek }, receiver: req.user?._id }).limit(100);
    const notificationObj = { today: { todayDate: today, data: notificationToday }, lastWeek: { lastWeekDate: lastWeek, data: notificationLastWeak } };
    return res.status(200).json({ data: notificationObj })
}

module.exports = { getMyNotification };