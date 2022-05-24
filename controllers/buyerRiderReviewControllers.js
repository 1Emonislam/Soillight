const UserReviews = require("../models/buyerRiderSellerReviewsModel");
const { BuyerReviews } = require("../models/buyerRiderSellerReviewsModel");
const User = require("../models/userModel");

const giveAReviewUser = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    // console.log(Number(rating))
    const user = await User.findOne({ _id: req?.params?.id });
    if (Number(rating) >= 6 || Number(rating) === 0) {
        return res.status(404).json({ error: { "rating": `Review failed! Please enter a minimum of 1 to a maximum of 5` } })
    }
    try {
        //console.log(product)
        if (user) {
            if (req.user?.isAdmin === true || req.user?.role === 'rider' || 'seller' || 'buyer' || 'admin') {
                const reviewed = await UserReviews.findOne({ reviewSender: req?.user?._id, role: user.role, product: productId, reviewReceiver: req.params.id })
                if (reviewed) {
                    if (reviewed?.role === 'buyer') {
                        return res.status(400).json({ error: { "buyer": "Buyer already reviewed!" } })
                    }
                    if (reviewed?.role === 'seller') {
                        return res.status(400).json({ error: { "Seller": "Seller already reviewed!" } })
                    }
                    if (reviewed?.role === 'rider') {
                        return res.status(400).json({ error: { "rider": "Rider already reviewed!" } })
                    }
                    if (reviewed?.role === 'admin' || req.user.isAdmin === true) {
                        return res.status(400).json({ error: { "admin": "Admin already reviewed!" } })
                    }
                } else {
                    const review = {
                        role: user?.role,
                        name: req.user?.name,
                        rating: Number(rating),
                        comment,
                        product: productId,
                        reviewSender: req?.user?._id,
                        reviewReceiver: req?.params?.id
                    }
                    const reviewAdded = await UserReviews.create(review);
                    const NotificationSend = {
                        sender: req?.user?._id,
                        receiver: req?.user?._id,
                        message: `Thank you for your feedback ${rating} rating`,
                    };
                    await Notification.create(NotificationSend);
                    const NotificationSend2 = {
                        sender: req?.user?._id,
                        receiver: req.params?.id,
                        message: `You have received a new feedback ${rating} rating from ${req.user?.name}`,
                    };
                    await Notification.create(NotificationSend2);
                    return res.status(201).json({ message: `Thank you for your feedback ${rating} rating`, data: reviewAdded });
                }
            }
        } else {
            return res.status(404).json({ error: { "review": "Review failed!" } })
        }
    }
    catch (error) {
        next(error)
    }
}

const updateUserReview = async (req, res, next) => {
    const { rating, comment } = req.body;
    if (Number(rating) >= 6 || Number(rating) === 0) {
        return res.status(404).json({ error: { "product": "Product review rate! Please enter a minimum of 1 to a maximum of 5" } })
    }
    const reviewUpdate = await UserReviews.findOne({ _id: req?.params?.id });
    try {
        if (reviewUpdate) {
            const review = {
                name: req?.user?.name,
                rating: Number(rating),
                comment,
            }
            const reviewUpdated = await ProductReview.updateOne({ _id: req?.params?.id }, review, { new: true });
            if (!reviewUpdated) {
                return res.status(400).json({ error: { "review": "Review update failed!" } })
            }
            if (reviewUpdated) {
                const NotificationSend = {
                    sender: req?.user?._id,
                    receiver: req?.user?._id,
                    message: `Thank you changes your feedback ${rating} rating`,
                };
                await Notification.create(NotificationSend);
                const NotificationSend2 = {
                    sender: req?.user?._id,
                    receiver: req.params?.id,
                    message: `You have received a changes feedback ${rating} rating from ${req.user?.name}`,
                };
                await Notification.create(NotificationSend2);
                return res.status(200).json({ message: "Review update successfully!", reviewUpdated })
            }
        } else {
            return res.status(404).json({ error: { "review": "user not founds!" }, data: [] })
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports = { giveAReviewUser, updateUserReview }